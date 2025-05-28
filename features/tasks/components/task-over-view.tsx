import React from "react";
import { Task } from "../type";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
import OverviewProperties from "./overview-properties";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import TaskDate from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snackCaseToTitleCase } from "@/lib/utils";

interface TaskOverViewProps {
  task: Task;
}

const TaskOverView = ({ task }: TaskOverViewProps) => {
  const { open } = useEditTaskModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            variant="secondary"
            size={"sm"}
            className="bg-blue-200 hover:bg-blue-300 text-blue-600 hover:text-blue-800 rounded-sm"
            onClick={() => {open(task.$id)}}
          >
            <Pencil />
            Modify
          </Button>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperties label="Assginee">
            <MemberAvatar name={task.assignee?.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperties>
          <OverviewProperties label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperties>
          <OverviewProperties label="Status">
            <Badge variant={task.status} className="rounded-sm text-white">
              {snackCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperties>
        </div>
      </div>
    </div>
  );
};

export default TaskOverView;
