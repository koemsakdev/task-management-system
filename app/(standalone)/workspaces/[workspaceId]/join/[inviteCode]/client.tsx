"use client";
import React from 'react'

import JoinWorkspaceForm from '@/features/workspaces/components/join-workspace-form';
import PageLoader from '@/components/page-loader';
import PageError from '@/components/page-error';
import { useGetWorksapceInfo } from '@/features/workspaces/api/use-get-workspace-info';
import { useWorkspacesId } from '@/features/workspaces/hooks/use-workspaces-id';

const WorksapceIdJoinClient = () => {
    const workspaceId = useWorkspacesId();
  const { data: initialValues, isLoading } = useGetWorksapceInfo({ workspaceId });
  if (isLoading) {
    return <PageLoader />;
  }
  if (!initialValues) {
    return <PageError message="Project not found" />;
  }
  return (
    <div className='w-full lg:max-w-2xl'>
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  )
}

export default WorksapceIdJoinClient