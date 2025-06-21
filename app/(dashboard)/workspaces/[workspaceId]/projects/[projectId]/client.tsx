"use client";


import React from "react";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetProject } from "@/features/projects/api/use-get-project";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

const ProjectClientId = () => {
  const projectId = useProjectId();
  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });

  if (isLoadingProject) {
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

      </div>
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

export default ProjectClientId;
