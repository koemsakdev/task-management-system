import React from "react";
import { Task } from "../type";
import TaskAction from "./task-action";
import { MoreHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import TaskDate from "./task-date";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

interface KanbanCardProps {
  task: Task;
}

const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p>{task.name}</p>
        <TaskAction id={task.$id} projectId={task.projectId}>
          <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition cursor-pointer" />
        </TaskAction>
      </div>
      <Separator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={task.assignee?.name}
          fallbackClassName="text-[10px]"
          className="size-5"
        />
        <div className="size-1 rounded-full bg-neutral-300"></div>
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={task.project?.name}
          image={task.project.imageUrl}
          className="size-5 rounded-full"
        />
        <div className="size-1 rounded-full bg-neutral-300"></div>
        <span className="text-xs font-medium truncate"> {task.project.name} </span>
      </div>
    </div>
  );
};

export default KanbanCard;
