import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import appLogo from '../assets/app.png';
import { Separator } from './ui/separator';
import { Navigation } from './navigation';
import WorkspaceSwitcher from './workspace-switcher';
import Projects from './projects';

const SideBar = () => {
    return (
        <aside className='h-full bg-neutral-100 p-2 w-full'>
            <Link href="/" className='flex items-center gap-3'>
                <Image src={appLogo} width={48} height={48} alt="logo" />
                <p className='font-bold text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-1.5'>Planova</p>
            </Link>
            <Separator className='mb-4 mt-2' />
            <WorkspaceSwitcher />
            <Separator className='my-4' />
            <Navigation />
            <Separator className='my-4' />
            <Projects />
        </aside>
    )
}

export default SideBar