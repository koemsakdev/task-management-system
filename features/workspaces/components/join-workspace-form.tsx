"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { useJoinWorkspace } from '../api/use-join-workspace'
import { useInviteCode } from '../hooks/use-invite-code'
import { useWorkspacesId } from '../hooks/use-workspaces-id'
import { useRouter } from 'next/navigation'

interface JoinWorkspaceFormProps {
    initialValues: {
        name: string
    }
}

const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceFormProps) => {
    const router = useRouter();
    const inviteCode = useInviteCode();
    const workspaceId = useWorkspacesId();
    const { mutate, isPending } = useJoinWorkspace();

    const onSubmit = () => {
        mutate({
            param: {
                workspaceId
            },
            json: { code: inviteCode }
        }, {
            onSuccess: ({ data }) => {
                router.push(`/workspaces/${data.$id}`);
            }
        })
    }
    return (
        <Card className='w-full h-full border-none'>
            <CardHeader className='px-7'>
                <CardTitle className='text-xl font-bold'>Join Workspace</CardTitle>
                <CardDescription>
                    You&apos;ve been invited to join a <strong className='text-black'>{initialValues.name}</strong> workspace.
                </CardDescription>
            </CardHeader>
            <CardContent className='px-7'>
                <Separator className='my-4' />
                <div className="flex items-center justify-end gap-x-2">
                    <Button
                        variant={"destructive"}
                        size={"sm"}
                        className={cn(
                            "rounded-sm bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700"
                        )}
                        type="button"
                        disabled={isPending}
                        asChild
                    >
                        <Link href={"/"}>
                            Cancel
                        </Link>
                    </Button>
                    <Button
                        type="submit"
                        variant={"secondary"}
                        size={"sm"}
                        className={cn(
                            "bg-green-100 hover:bg-green-200 text-lime-600 hover:text-lime-700 rounded-sm"
                        )}
                        onClick={onSubmit}
                        disabled={isPending}
                    >
                        {
                            isPending ? "Joining..." : "Join Workspace"
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default JoinWorkspaceForm