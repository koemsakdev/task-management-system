import { getCurrent } from "@/features/auth/queries";
import { getWorkspace } from "@/features/workspaces/queries";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";
import React from "react";

interface WorkspaceIdSettingPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

const WorkspaceIdSettingPage = async ({
  params,
}: WorkspaceIdSettingPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const { workspaceId } = await params;
  const initialValues = await getWorkspace({ workspaceId });
  if (!initialValues) redirect(`/workspaces/${workspaceId}`);

  return (
    <div className="w-full lg:max-w-2xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdSettingPage;
