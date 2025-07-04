import React from "react";
import { TaskStatus } from "@/features/tasks/type";
import { snackCaseToTitleCase } from "@/lib/utils";

import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDotDashedIcon className="size-[18px] text-pink-400" />
  ),
  [TaskStatus.TODO]: <CircleDotIcon className="size-[18px] text-red-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDashedIcon className="size-[18px] text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: <CircleIcon className="size-[18px] text-blue-400" />,
  [TaskStatus.DONE]: <CircleCheckIcon className="size-[18px] text-green-400" />,
};

export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  const icon = statusIconMap[board];
  const { open } = useCreateTaskModal();
  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snackCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700">
          {taskCount}
        </div>
      </div>
      <Button
        className="size-5"
        onClick={open}
        variant={"ghost"}
        size={"icon"}
      >
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};
