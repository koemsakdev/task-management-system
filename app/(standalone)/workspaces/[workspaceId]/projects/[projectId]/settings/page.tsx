import { getCurrent } from '@/features/auth/queries'
import { redirect } from 'next/navigation';
import ProjectIdSettingClient from './client';

const ProjectIdSettingPage = async () => {
  const user = getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className='w-full lg:max-w-2xl'>
      <ProjectIdSettingClient />
    </div>
  )
}

export default ProjectIdSettingPage