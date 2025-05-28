import React from 'react'
import { getCurrent } from '@/features/auth/queries'
import { redirect } from 'next/navigation'
import WorksapceIdJoinClient from './client'

const WorkspaceIdJoinPage = async () => {
  const user = await getCurrent()
  if (!user) redirect("/sign-in");

  return (
    <WorksapceIdJoinClient />
  )
}

export default WorkspaceIdJoinPage