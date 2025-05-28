"use client";
import React, { useEffect, useState } from 'react'
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { CirclePlus, Check, ChevronsUpDown, Loader } from 'lucide-react';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { WorkspaceAvatar } from '@/features/workspaces/components/workspaces-avatar';
import { useRouter } from 'next/navigation';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';

const WorkspaceSwitcher = () => {
    const router = useRouter();
    const [openCombobox, setOpenCombobox] = useState(false);
    const [value, setValue] = useState("");
    const [loadingDots, setLoadingDots] = useState("");
    const { open } = useCreateWorkspaceModal();

    const { data: workspaces, isLoading } = useGetWorkspaces();
    const selectedWorkspace = workspaces?.documents.find((workspace) => workspace.name.toLowerCase() === value.toLowerCase());

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setLoadingDots(prev => {
                    if (prev === "...") return "";
                    return prev + ".";
                });
            }, 300);

            return () => clearInterval(interval);
        } else {
            setLoadingDots("");
        }
    }, [isLoading]);

    useEffect(() => {
        const path = window.location.pathname;
        const match = path.match(/\/workspaces\/([^/]+)/);

        if (match && workspaces?.documents) {
            const workspaceId = match[1];
            const workspace = workspaces.documents.find(w => w.$id === workspaceId);
            if (workspace) {
                setValue(workspace.name);
            }
        }
    }, [workspaces?.documents]);


    return (
        <div className='flex flex-col gap-y-2'>
            <div className="flex items-center justify-between">
                <p className="text-sm uppercase font-bold text-neutral-500">Workspaces</p>
                <Button
                    variant={"secondary"}
                    onClick={open}
                    disabled={isLoading}
                    size={"icon"}
                >
                    <CirclePlus className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
                </Button>
            </div>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        size={"sm"}
                        className="w-full justify-between bg-neutral-150 hover:bg-neutral-200 text-neutral-700 shadow-none outline-0 py-7"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader className="h-4 w-4 animate-spin" />
                                <span>Finding workspaces {loadingDots}</span>
                            </div>
                        ) : value ? (
                            <div className="flex items-center justify-start gap-2 min-w-0 flex-1">
                                <WorkspaceAvatar
                                    image={selectedWorkspace?.imageUrl}
                                    name={selectedWorkspace?.name}
                                    className="shrink-0"
                                />
                                <span className="truncate block">
                                    {selectedWorkspace?.name}
                                </span>
                            </div>
                        ) : (
                            <span className="truncate">Select workspace...</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0 w-[var(--radix-popover-trigger-width)]">
                    <Command className="w-full">
                        <CommandInput placeholder="Search workspace..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No workspace found.</CommandEmpty>
                            <CommandGroup>
                                {workspaces?.documents.map((workspace) => (
                                    <CommandItem
                                        key={workspace.$id}
                                        value={workspace.name}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue)
                                            setOpenCombobox(false)
                                            router.push(`/workspaces/${workspace.$id}`)
                                        }}
                                        className='cursor-pointer hover:bg-neutral-200 transition'
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <WorkspaceAvatar
                                                image={workspace.imageUrl}
                                                name={workspace.name}
                                                className="shrink-0"
                                            />
                                            <span className="truncate block">
                                                {workspace.name}
                                            </span>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4 shrink-0",
                                                value === workspace.name ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default WorkspaceSwitcher