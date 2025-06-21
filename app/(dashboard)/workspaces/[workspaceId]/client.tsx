"use client";
import React from "react";
import Link from "next/link";

import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, Plus, Settings } from "lucide-react";

import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";

import { Task } from "@/features/tasks/type";
import Analytics from "@/components/analytics";
import PageError from "@/components/page-error";
import { Button } from "@/components/ui/button";
import { Member } from "@/features/members/type";
import PageLoader from "@/components/page-loader";
import { Project } from "@/features/projects/type";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import {cn} from "@/lib/utils";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspacesId();
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId: workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId: workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId: workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId: workspaceId,
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLoading) return <PageLoader />;
  if (!analytics || !tasks || !projects || !members)
    return <PageError message="Failed to load workspace analytics" />;

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
        <MemberList data={members.documents} total={members.total} />
      </div>
    </div>
  );
};

interface TaskListProps {
  data: Task[];
  total: number;
}
export const TaskList = ({ data, total }: TaskListProps) => {
  const workspaceId = useWorkspacesId();
  const { open: createTask } = useCreateTaskModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-slate-50 h-full rounded-lg p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Tasks ({total})</p>
            <Button
              variant="secondary"
              onClick={createTask}
              size={"icon"}
              className="bg-neutral-200 hover:bg-neutral-300"
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <Separator className="my-4" />
          <ul className="flex flex-col gap-y-2">
            {data.map((task) => (
              <li key={task.$id}>
                <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                  <Card className="shadow-none border-none rounded-md hover:opacity-75 transition py-1">
                    <CardContent className="px-4 py-2">
                      <p className="text-lg font-medium truncate mb-1">{task.name}</p>
                      <div className="flex items-center gap-x-2">
                        <p className="text-sm">{task.project?.name}</p>
                        <div className="h-5 w-[1px] bg-neutral-300" />
                        <div className="text-sm text-muted-foreground flex items-center">
                          <CalendarIcon className="size-4 mr-1" />
                          <span className="truncate">
                            {formatDistanceToNow(new Date(task.dueDate))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
            <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
              No tasks found
            </li>
          </ul>
        </div>
        <Button
            variant={"secondary"}
            className={cn(
                "mt-2 w-full bg-slate-200 hover:bg-slate-300"
            )}
            disabled={data.length === 0}
            size={"sm"}
            asChild
        >
          <Link
              href={data.length === 0 ? "#" : `/workspaces/${workspaceId}/tasks`}
              className={cn(
                  "flex items-center justify-center gap-x-2 px-4 py-2 rounded-md text-sm font-medium text-primary hover:bg-slate-300 transition",
                  data.length === 0 && "opacity-50 pointer-events-none"
              )}
              onClick={(e) => {
                if (data.length === 0) {
                  e.preventDefault();
                }
              }}
          >Show all</Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
  total: number;
}
export const ProjectList = ({ data, total }: ProjectListProps) => {
  const workspaceId = useWorkspacesId();
  const { open: createProject } = useCreateProjectModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="border rounded-lg p-4 h-full">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button
            variant="secondary"
            onClick={createProject}
            size={"icon"}
            className="bg-neutral-200 hover:bg-neutral-300"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className={cn(
            "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-3",
            data.length === 0 && "md:grid-cols-1 lg:grid-cols-1 justify-center items-center"
        )}>
          {data.map((project) => (
            <li key={project.$id} className="border-b border-neutral-200 pb-3">
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none border-0 rounded-sm hover:opacity-75 transition p-0">
                  <CardContent className="flex items-center gap-x-2.5 p-0">
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className="size-8 text-lg"
                    />
                    <p className="text-md font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  );
};

interface MemberListProps {
  data: Member[];
  total: number;
}
export const MemberList = ({ data, total }: MemberListProps) => {
  const workspaceId = useWorkspacesId();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Member ({total})</p>
          <Button
            variant="secondary"
            size={"icon"}
            className="bg-neutral-200 hover:bg-neutral-300"
            asChild
          >
            <Link href={`/workspaces/${workspaceId}/members`}>
              <Settings className="size-4" />
            </Link>
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          {data.map((member) => (
            <li key={member.$id} className="border rounded-md">
              <Card className="shadow-none border-none rounded-lg overflow-hidden p-2 hover:opacity-75 transition">
                <CardContent className="p-0 flex flex-col items-center gap-x-2">
                  <MemberAvatar
                    name={member.name}
                    className="size-12 text-lg"
                  />
                  <p className="text-lg font-medium line-clamp-1">{member.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1 truncate">{member.email}</p>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  );
};