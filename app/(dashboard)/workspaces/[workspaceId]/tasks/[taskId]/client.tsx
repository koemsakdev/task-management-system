"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Separator } from "@/components/ui/separator";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import TaskBreadcrumbs from "@/features/tasks/components/task-breadcrumbs";
import TaskDescription from "@/features/tasks/components/task-description";
import TaskOverView from "@/features/tasks/components/task-over-view";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";

const TaskIdClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Task not found" />;
  }

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.project} task={data} />
      <Separator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverView task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
};

export default TaskIdClient;
