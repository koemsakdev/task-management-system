"use client";

import React from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import { CirclePlus, Loader, MoreVertical, Settings, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { cn } from "@/lib/utils";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UseConfirmHook from "@/hooks/use-confirm";
import {useDeleteProject} from "@/features/projects/api/use-delete-project";

const Projects = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useCreateProjectModal();
  const workspaceId = useWorkspacesId();
  const { data, isLoading } = useGetProjects({ workspaceId });
  const {mutate: deleteProject} = useDeleteProject();

  const [ConfirmDialog, DeleteDialog] = UseConfirmHook(
      "Delete project",
      "Are you sure you want to delete this project? This action cannot be undone.",
      "destructive"
  );

  const handleSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`${pathname}/settings`);
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();

    const ok = await ConfirmDialog();
    if (!ok) return;
    deleteProject({
      param: {projectId: projectId}
    }, {
      onSuccess: () => {
        router.push(`/workspaces/${workspaceId}`);
      }
    })
  };

  return (
    <div className='flex flex-col gap-y-1'>
      <DeleteDialog/>
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
          <div
            key={project.$id}
            className={cn(
              "group flex items-center gap-2 p-2 rounded-md hover:opacity-75 transition text-neutral-500",
              isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
            )}
          >
            <Link 
              href={href}
              className="flex items-center justify-start gap-2 min-w-0 flex-1"
            >
              <ProjectAvatar
                image={project?.imageUrl}
                name={project?.name}
                className="shrink-0"
              />
              <span className="truncate text-sm block">
                {project?.name}
              </span>
            </Link>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="ml-auto px-0 bg-transparent shadow-none transition opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => handleSettings(e)}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 size-4" />
                  <span>Project Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => handleDelete(e, project.$id)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 size-4 text-destructive" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

export default Projects;