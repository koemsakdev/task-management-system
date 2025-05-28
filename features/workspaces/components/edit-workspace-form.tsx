"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateWorkspaceSchema } from "../schemas";
import { z } from "zod";

import {
    Card,
    CardTitle,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

import {
    Form,
    FormControl,
    FormLabel,
    FormItem,
    FormMessage,
    FormField,
} from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftToLine, CheckCheck, Copy, ImageIcon, Loader, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Workspace } from "../type";
import { useUpdateWorkspaces } from "../api/use-update-workspace";
import UseConfirmHook from "@/hooks/use-confirm";
import { useDeleteWorkspaces } from "../api/use-delete-workspace";
import { showSuccessToast } from "@/components/custom-toast";
import { useResetInviteCode } from "../api/use-reset-invite-code";

interface EditWorkspaceFormProps {
    onCancel?: () => void;
    initialValues: Workspace;
}

export const EditWorkspaceForm = ({ onCancel, initialValues }: EditWorkspaceFormProps) => {
    const router = useRouter();
    const { mutate, isPending } = useUpdateWorkspaces();
    const { mutate: deleteWorkspace, isPending: isPendingDelete } = useDeleteWorkspaces();
    const { mutate: resetInviteCode, isPending: isResetInviteCode } = useResetInviteCode();
    const inputRef = useRef<HTMLInputElement>(null);
    const [fullInviteLink, setFullInviteLink] = useState("");
    const [copied, setCopied] = useState(false);

    const [ConfirmDialog, DeleteDialog] = UseConfirmHook(
        "Delete workspace",
        "Are you sure you want to delete this workspace? This action cannot be undone.",
        "destructive"
    );

    const [ConfirmReset, ResetDialog] = UseConfirmHook(
        "Reset invite link",
        "This action will reset the invite link for this workspace. All existing invite links will be invalidated. This action cannot be undone.",
        "destructive"
    );

    const handleDelete = async () => {
        const ok = await ConfirmDialog();
        if (!ok) return;
        deleteWorkspace({
            param: { workspaceId: initialValues?.$id }
        }, {
            onSuccess: () => {
                router.push("/");
            }
        })
    }

    const handleResetInviteLink = async () => {
        const ok = await ConfirmReset();
        if (!ok) return;
        resetInviteCode({
            param: { workspaceId: initialValues?.$id }
        })
    }

    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? ""
        }
    });

    const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : ""
        }
        mutate({
            form: finalValues,
            param: { workspaceId: initialValues?.$id }
        }, {
            onSuccess: ({ data }) => {
                form.reset();
                form.setValue('image', '');
                router.push(`/workspaces/${data?.$id}`); // Redirect to workspace
                // window.location.href = `/workspaces/${data?.$id}`; // Redirect to workspace
            }
        })
    }

    const onHanldeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', file)
        }
    }
    useEffect(() => {
        setFullInviteLink(`${window.location.origin}/workspaces/${initialValues?.$id}/join/${initialValues?.inviteCode}`);
    }, [initialValues?.$id, initialValues?.inviteCode]);
    const handleCopyLink = () => {
        navigator.clipboard.writeText(fullInviteLink);
        setCopied(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => {
            showSuccessToast("", { description: "The link has been copied to your clipboard." });
            setCopied(false);
        }, 500);
    }
    return (
        <div className="flex flex-col gap-y-3">
            <DeleteDialog />
            <ResetDialog />
            <Card className="w-full h-full border-none rounded-sm">
                <CardHeader className="h-5 flex flex-row items-center gap-x-4 space-y-0 px-7">
                    <Button
                        variant={"ghost"}
                        size={"sm"}
                        type="button"
                        onClick={onCancel ? onCancel : () => router.back()}
                        className="text-muted-foreground hover:text-muted-foreground rounded-sm"
                    >
                        <ArrowLeftToLine />
                        Back
                    </Button>
                    <Separator orientation="vertical" />
                    <CardTitle className="text-xl font-bold">
                        Workspace Setting
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-7 py-0">
                    <Separator className="mb-7" />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <div className="flex flex-col gap-y-2">
                                            <div className="flex items-center gap-x-5">
                                                {
                                                    field.value ? (
                                                        <div className="size-[72px] relative rounded-md overflow-hidden">
                                                            <Image
                                                                src={
                                                                    field.value instanceof File ? URL.createObjectURL(field.value) : field.value
                                                                }
                                                                alt="workspace logo"
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <Avatar className="size-[82px] rounded-md">
                                                            <AvatarFallback className="rounded-md">
                                                                <ImageIcon className="size-[38px] text-neutral-500" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )
                                                }
                                                <div className="flex flex-col">
                                                    <p className="text-sm">Workspace Icon</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        PNG, JPG, JPEG, or SVG, max 1MB
                                                    </p>
                                                    <Input
                                                        type="file"
                                                        accept=".png, .jpg, .jpeg, .svg"
                                                        className="hidden"
                                                        ref={inputRef}
                                                        disabled={isPending}
                                                        onChange={onHanldeImageChange}
                                                    />
                                                    {
                                                        !field.value ? (
                                                            <Button
                                                                variant={"secondary"}
                                                                type="button"
                                                                size={"sm"}
                                                                className="w-fit mt-2 text-blue-400 hover:text-blue-500"
                                                                disabled={isPending}
                                                                onClick={() => inputRef.current?.click()}
                                                            >
                                                                <Upload /> Upload a file
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant={"secondary"}
                                                                type="button"
                                                                size={"sm"}
                                                                className="w-fit rounded-sm mt-2 bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600"
                                                                disabled={isPending}
                                                                onClick={() => {
                                                                    field.onChange("");
                                                                    if (inputRef.current) inputRef.current.value = "";
                                                                }}
                                                            >
                                                                <X /> Remove
                                                            </Button>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="name">Workspace name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Enter workspace name"
                                                    className="w-full shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                                                    autoComplete="off"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Separator className="my-7" />
                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    variant={"destructive"}
                                    className={cn(
                                        "rounded-sm",
                                        !onCancel && "hidden"
                                    )}
                                    type="button"
                                    onClick={onCancel}
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant={"secondary"}
                                    size={"sm"}
                                    className={cn(
                                        "bg-green-100 hover:bg-green-200 text-lime-500 hover:text-lime-600 rounded-sm"
                                    )}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader className="h-4 w-4 animate-spin" />
                                            <span>Updating workspace...</span>
                                        </span>
                                    ) : (
                                        <span>Save Changes</span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Card className="w-full h-full border-none bg-green-50 p-0 rounded-sm">
                <CardContent className="px-7 py-4">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Invite Memebers</h3>
                        <p className="text-sm text-muted-foreground">
                            Use the invite link below to invite members to your workspace.
                        </p>
                        <div className="flex items-center gap-x-2 mt-2">
                            <Input
                                type="text"
                                value={fullInviteLink}
                                disabled
                                className="w-full rounded-sm"
                            />
                            <Button
                                variant={"ghost"}
                                className="w-fit rounded-sm"
                                disabled={isPending}
                                size={"sm"}
                                onClick={handleCopyLink}
                            >
                                {
                                    copied ? (
                                        <CheckCheck />
                                    ) : (
                                        <Copy />
                                    )
                                }
                            </Button>
                        </div>
                        <Separator className="my-4" />
                        <Button
                            variant={"secondary"}
                            className="w-fit ml-auto rounded-sm bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600"
                            disabled={isPending || isResetInviteCode}
                            size={"sm"}
                            onClick={handleResetInviteLink}
                        >
                            Reset invite code
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full h-full border-none bg-red-50 p-0 rounded-sm">
                <CardContent className="px-7 py-4">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground">
                            Deleting a workspace is permanent and will remove all associated data.
                        </p>
                        <Separator className="my-4" />
                        <Button
                            variant={"destructive"}
                            className="w-fit ml-auto rounded-sm bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600"
                            disabled={isPending || isPendingDelete}
                            size={"sm"}
                            onClick={handleDelete}
                        >
                            Delete workspace
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}