import { Project } from "@/features/projects/type";
import React from "react";
import { TaskStatus } from "../type";
import { cn } from "@/lib/utils";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";
import { useRouter } from "next/navigation";

interface EventCardProps {
  title: string;
  assignee: any;
  project: Project;
  status: TaskStatus;
  id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-pink-500",
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-green-500",
}

const EventCard = ({
  title,
  assignee,
  project,
  status,
  id,
}: EventCardProps) => {
    const workspaceId = useWorkspacesId();
    const rounter = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        rounter.push(`/workspaces/${workspaceId}/tasks/${id}`);
    }
  return (
    <div className="px-2">
        <div onClick={handleClick} className={cn(
            "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hovver:opacity-75 transition",
            statusColorMap[status]
        )}>
            <p>{title}</p>
            <div className="flex items-center gap-x-1">
                <MemberAvatar
                    name={assignee?.name}
                    className="size-7"
                />
                <div className="size-1 rounded-full bg-neutral-200"></div>
                <ProjectAvatar
                    name={project?.name}
                    image={project?.imageUrl}
                    className="size-7 rounded-full"
                />
            </div>
        </div>
    </div>
  );
};

export default EventCard;
