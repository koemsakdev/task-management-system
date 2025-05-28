import { Project } from "@/features/projects/type";
import React from "react";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";
import { useDeleteTask } from "../api/use-delete-task";
import UseConfirmHook from "@/hooks/use-confirm";
import { Task } from "../type";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import Link from "next/link";
import { ChevronRight, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspacesId();
  const { mutate, isPending } = useDeleteTask();
  const [confirmDelte, ConfirmDeleteDialog] = UseConfirmHook(
    "Delete Task",
    "This action cannot be undone.",
    "destructive"
  );

  const handleDeleteTask = async () => {
    const ok = await confirmDelte();
    if (!ok) return;
    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDeleteDialog />
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        className="ml-auto rounded-sm bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600"
        variant={"destructive"}
        size={"sm"}
        onClick={handleDeleteTask}
        disabled={isPending}
      >
        <Trash className="size-4" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};

export default TaskBreadcrumbs;
