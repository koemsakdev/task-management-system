"use client";
import { UserButton } from '@/features/auth/components/user-button'
import React from 'react'
import MobileSidebar from './mobile-sidebar'
import { usePathname } from 'next/navigation'

const pathnameMap  = {
    "tasks": {
        title: "Tasks",
        description: "View of all your task here."
    },
    "projects": {
        title: "My Projects",
        description: "View task of your project here."
    }
}

const defaultMap = {
    title: "Home",
    description: "Monitor of all your project and tasks"
}

const Navbar = () => {
    const pathname = usePathname();
    const pathnameParts = pathname.split("/");
    const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

    const {title, description} = pathnameMap[pathnameKey] || defaultMap;
    return (
        <nav className='pt-4 px-6 flex items-center justify-between'>
            <div className="flex-col hidden lg:flex">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <p className='text-muted-foreground'>{description}</p>
            </div>
            <MobileSidebar />
            <UserButton />
        </nav>
    )
}

export default Navbar