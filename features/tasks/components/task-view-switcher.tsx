"use client";
import { useQueryState } from "nuqs";
import React, { useCallback } from "react";
import { Loader, Plus } from "lucide-react";

import Columns from "./columns";
import { TaskStatus } from "../type";
import DataFilter from "./data-filter";
import { DataTable } from "./data-table";
import DataCalendar from "./data-calendar";
import { Button } from "@/components/ui/button";
import { useGetTasks } from "../api/use-get-tasks";
import { Separator } from "@/components/ui/separator";
import { useTaskFilter } from "../hooks/use-task-filter";
import DataKanban from "@/features/tasks/components/data-kanban";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

const TaskViewSwitcher = ({ hideProjectFilter }: TaskViewSwitcherProps) => {
  const [{ projectId, status, assigneeId, dueDate }] = useTaskFilter();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const workspaceId = useWorkspacesId();
  const paramProjectId = useProjectId();
  const { open } = useCreateTaskModal();

  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const { data: tasks, isLoading: isLoadingTask } = useGetTasks({
    workspaceId,
    projectId: paramProjectId || projectId,
    assigneeId,
    status,
    dueDate,
  });

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdate({ json: { tasks } });
    },
    [bulkUpdate]
  );
  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-sm"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger
              className="h-8 w-full lg:w-auto px-4 cursor-pointer rounded-sm"
              value="table"
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              className="h-8 w-full lg:w-auto px-4 cursor-pointer rounded-sm"
              value="kanban"
            >
              Board
            </TabsTrigger>
            <TabsTrigger
              className="h-8 w-full lg:w-auto px-4 cursor-pointer rounded-sm"
              value="calendar"
            >
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            className="w-full lg:w-auto px-4 cursor-pointer rounded-sm bg-blue-100 hover:bg-blue-200 text-blue-500 hover:text-blue-600"
            variant="secondary"
            size={"sm"}
            onClick={open}
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>
        <Separator className="my-4" />
        <DataFilter hideProjectFilter={hideProjectFilter} />
        <Separator className="my-4" />
        {isLoadingTask ? (
          <div className="w-full border rounded-lg h-[200px] flex items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground mr-2" />
          </div>
        ) : (
          <>
            <TabsContent value="table">
              <DataTable columns={Columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban">
              <DataKanban
                onChange={onKanbanChange}
                data={tasks?.documents ?? []}
              />
            </TabsContent>
            <TabsContent value="calendar">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
