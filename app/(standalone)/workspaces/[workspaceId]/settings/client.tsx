"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetWorksapce } from "@/features/workspaces/api/use-get-workspace";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";
import React from "react";

const WorkspaceIdSettingClient = () => {
    const workspaceId = useWorkspacesId();
  const { data: initialValues, isLoading } = useGetWorksapce({ workspaceId });
  if (isLoading) {
    return <PageLoader />;
  }
  if (!initialValues) {
    return <PageError message="Project not found" />;
  }
  return (
    <div className="w-full">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdSettingClient;
