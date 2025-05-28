"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CirclePlus, Loader, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { cn } from "@/lib/utils";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

const Projects = () => {
  const pathname = usePathname();
  const { open } = useCreateProjectModal();
  const workspaceId = useWorkspacesId();
  const { data, isLoading } = useGetProjects({ workspaceId });

  return (
    <div className='flex flex-col gap-y-2'>
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase font-bold text-neutral-500">Projects</p>
        <Button
          variant={"secondary"}
          onClick={open}
          // disabled={isLoading}
          size={"icon"}
        >
          <CirclePlus className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
        </Button>
      </div>

      {data?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;
        return (
          <Link href={href} key={project.$id}>
            <div className={cn(
              "flex items-center gap-2 p-2 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
              isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
            )}>
              <div className="flex items-center justify-start gap-2 min-w-0 flex-1">
                <ProjectAvatar
                  image={project?.imageUrl}
                  name={project?.name}
                  className="shrink-0"
                />
                <span className="truncate text-sm block">
                  {project?.name}
                </span>

                <Button
                  variant={"secondary"}
                  size={"sm"}
                  className="ml-auto"
                >
                  <MoreVertical className="size-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </Link>
        )
      })}
      {isLoading && (
        <div className="flex items-center justify-center p-7">
          <Loader className="size-5 text-muted-foreground animate-spin" />
        </div>
      )}
    </div>
  )
}

export default Projects