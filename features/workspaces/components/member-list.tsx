"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useWorkspacesId } from '@/features/workspaces/hooks/use-workspaces-id'
import { ArrowLeftToLine, Loader, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { useGetMembers } from '../../members/api/use-get-members';
import { MemberAvatar } from '../../members/components/member-avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteMember } from '@/features/members/api/use-delete-member';
import { useUpdateMember } from '@/features/members/api/use-update-member';
import { MemberRole } from '@/features/members/type';
import UseConfirmHook from '@/hooks/use-confirm';
import PageLoader from '@/components/page-loader';

const MemberList = () => {
  const workspaceId = useWorkspacesId();
  const { data, isPending } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();
  const { mutate: udpateMember, isPending: isUpdatingMember } = useUpdateMember();

  const [Confirm, ConfirmDialog] = UseConfirmHook(
    "Remove member",
    "This member will be removed from the workspace",
    "destructive"
  );

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    udpateMember({
      json: { role },
      param: { memberId }
    });
  }

  const handleDeleteMember = async (memberId: string) => {
    const ok = await Confirm();
    if (!ok) return;

    deleteMember({ param: { memberId } }, {
      onSuccess: () => {
        window.location.reload();
      }
    });
  }

  return (
    <div className='w-full lg:max-w-2xl'>
      <Card className="w-full h-full border-none rounded-sm">
        <ConfirmDialog />
        <CardHeader className="h-5 flex flex-row items-center gap-x-4 space-y-0 px-7">
          <Button
            variant={"ghost"}
            size={"sm"}
            type="button"
            className="text-muted-foreground hover:text-muted-foreground rounded-sm"
            asChild
          >
            <Link href={`/workspaces/${workspaceId}`}>
              <ArrowLeftToLine />
              Back
            </Link>
          </Button>
          <Separator orientation="vertical" />
          <CardTitle className="text-xl font-bold">
            Member lists
          </CardTitle>
        </CardHeader>
        <CardContent className='px-7'>
          <Separator className='mb-5' />
          {
            data?.documents.map((member, index: any) => (
              <Fragment key={member.$id}>
                <div className="flex items-center gap-2">
                  <MemberAvatar name={member.name} className='size-10' fallbackClassName='text-lg' />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size={"sm"}
                        variant={"secondary"}
                        className='ml-auto'
                      >
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='bottom' align='end'>
                      <DropdownMenuItem
                        className='font-medium cursor-pointer'
                        onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}
                        disabled={isUpdatingMember}
                      >
                        Set as Administrator
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='font-medium cursor-pointer'
                        onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}
                        disabled={isUpdatingMember}
                      >
                        Set as Member
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='font-medium cursor-pointer'
                        variant='destructive'
                        onClick={() => handleDeleteMember(member.$id)}
                        disabled={isDeletingMember}
                      >
                        Remove {member.name}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                </div>

                {index < data.documents.length - 1 && (
                  <Separator className='my-2' />
                )}
              </Fragment>
            ))
          }
          {isPending && (
            <PageLoader />
          )}

        </CardContent>
      </Card>
    </div>
  )
}

export default MemberList