
import { getCurrent } from '@/features/auth/queries';
import { SignInForm } from '@/features/auth/components/sign-in-form'
import { redirect } from 'next/navigation';

const SignInPage = async () => {
  const user = await getCurrent();
  if (user) {
    return redirect('/');
  }
  return (
    <div className='w-full max-w-sm md:max-w-4xl'>
        <SignInForm />
    </div>
  )
}

export default SignInPage