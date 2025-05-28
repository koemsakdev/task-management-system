"use client";

import Analytics from "@/components/analytics";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";

const ProjectClientId = () => {
  const projectId = useProjectId();
  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });
  const { data: projectAnalytics, isLoading: isLoadingProjectAnalytics } =
    useGetProjectAnalytics({ projectId });

  if (isLoadingProject || isLoadingProjectAnalytics) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError message="Project not found" />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button
            variant="secondary"
            size={"sm"}
            asChild
            className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-500 hover:text-blue-600"
          >
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
            >
              <Pencil className="size-4" /> Edit Project
            </Link>
          </Button>
        </div>
      </div>

      {projectAnalytics && <Analytics data={projectAnalytics} />}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

export default ProjectClientId;
