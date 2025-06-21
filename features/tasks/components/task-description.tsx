import React, { useState } from "react";
import { Task } from "../type";
import { useUpdateTask } from "../api/use-update-task";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
interface TaskDescriptionProps {
  task: Task;
}

const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);
  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate({
      json: { description: value },
      param: { taskId: task.$id },
    }, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button
          variant="secondary"
          size={"sm"}
          className={cn(
            "rounded-sm",
            !isEditing
              ? "bg-blue-200 hover:bg-blue-300 text-blue-600 hover:text-blue-800"
              : "bg-red-200 hover:bg-red-300 text-red-600 hover:text-red-800"
          )}
          disabled={isPending}
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? <X /> : <Pencil />}
          {isEditing ? "Cancel" : "Modify"}
        </Button>
      </div>
      <Separator className="my-6" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
            <Textarea
                placeholder="Add description"
                value={value}
                rows={4}
                onChange={(e) => setValue(e.target.value)}
                disabled={isPending}
                className="focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-0"
            />
            <Button
                variant="secondary"
                size={"sm"}
                className="w-fit ml-auto rounded-sm bg-green-200 hover:bg-green-300 text-green-600 hover:text-green-800"
                onClick={handleSave}
                disabled={isPending}
            >
                {isPending ? "Saving..." : "Save Changes"}
            </Button>
        </div>
      ) : (
        <div>
          {task.description || (
            <p className="text-muted-foreground text-center">No description yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskDescription;
