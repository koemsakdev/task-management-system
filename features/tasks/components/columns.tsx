"use client";
import React from 'react'
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react"
import { Task } from '../type';
import { Button } from '@/components/ui/button';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import TaskDate from './task-date';
import { Badge } from '@/components/ui/badge';
import { snackCaseToTitleCase } from '@/lib/utils';
import TaskAction from './task-action';


const Columns: ColumnDef<Task>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Task Name
                    <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const name = row.original.name;
            return <p className="line-clamp-1">{name}</p>
        }
    },
    {
        accessorKey: "Project",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Project
                    <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const project = row.original.project;
            return (
                <div className='flex items-center gap-x-2 text-sm font-medium'>
                    <ProjectAvatar
                        className='size-6 rounded-full'
                        name={project.name}
                        image={project.imageUrl}
                    />
                    <p className="line-clamp-1">{project.name}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "Assignee",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Assignee
                    <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const assignee = row.original.assignee;
            return (
                <div className='flex items-center gap-x-2 text-sm font-medium'>
                    <MemberAvatar
                        className='size-6 rounded-full'
                        name={assignee.name}
                        fallbackClassName='text-sm'
                    />
                    <p className="line-clamp-1">{assignee.name}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "Due Date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Assignee
                    <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const dueDate = row.original.dueDate;
            return <TaskDate value={dueDate} />
        }
    },
    {
        accessorKey: "Status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.original.status;
            return <Badge variant={status} className='rounded-sm text-white'>{snackCaseToTitleCase(status)}</Badge>
        }
    },
    {
        id: "actions",
        cell: ({row}) => {
            const id = row.original.$id;
            const projectId = row.original.projectId;
            return (
                <TaskAction
                    id={id}
                    projectId={projectId}
                >
                    <Button
                        className='size-8 p-0'
                        variant={"ghost"}
                    >
                        <MoreVertical className='size-4' />
                    </Button>
                </TaskAction>
            )
        }
    },

]

export default Columns