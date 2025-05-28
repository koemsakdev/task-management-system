import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { UserButton } from '@/features/auth/components/user-button'
import logo from '@/assets/app.png'

const StandAloneLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className='min-h-screen'>
            <div className='mx-auto max-w-screen-2xl p-4'>
                <nav className='flex justify-between items-center h-[73px] sticky top-0 backdrop-blur-sm z-50'>
                    <Link href="/" className='flex items-center gap-3'>
                        <Image src={logo} width={48} height={48} alt="logo" />
                        <p className='font-bold text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-1.5'>Planova</p>
                    </Link>
                    <UserButton />
                </nav>
                <div className='flex flex-col items-center justify-center py-4'>
                    {children}
                </div>
            </div>
        </main>
    )
}

export default StandAloneLayout