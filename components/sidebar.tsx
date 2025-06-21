import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import appLogo from '../assets/app.png';
import {Separator} from './ui/separator';
import {Navigation} from './navigation';
import WorkspaceSwitcher from './workspace-switcher';
import Projects from './projects';

const SideBar = () => {
    return (
        <aside className='h-full bg-neutral-100 w-full overflow-hidden flex flex-col'>
            <Link href="/" className='flex items-center gap-3 sticky top-0 z-50 backdrop-blur-2xl p-2'>
                <Image src={appLogo} width={48} height={48} alt="logo"/>
                <p className='font-bold text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-1.5'>Planova</p>
            </Link>
            <div
                className="p-2 bg-neutral-100 w-full overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
            >
                <WorkspaceSwitcher/>
                <Separator className='my-4'/>
                <Navigation/>
                <Separator className='my-4'/>
                <Projects/>
            </div>
        </aside>
    )
}

export default SideBar
