"use client";
import React, {useRef} from "react";
import Image from "next/image";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {updateProjectSchema} from "../schema";
import {z} from "zod";
import {useRouter} from "next/navigation";

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
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ArrowLeftToLine, ImageIcon, Loader, Upload, X} from "lucide-react";
import {cn} from "@/lib/utils";
import {Project} from "../type";
import {useUpdateProject} from "../api/use-update-project";
import UseConfirmHook from "@/hooks/use-confirm";
import {useDeleteProject} from "../api/use-delete-project";

interface EditProjectFormProps {
    onCancel?: () => void;
    initialValues: Project;
}

export const EditProjectForm = ({onCancel, initialValues}: EditProjectFormProps) => {
    const router = useRouter();
    const {mutate, isPending} = useUpdateProject();
    const {mutate: deleteProject, isPending: isPendingDeleteProject} = useDeleteProject();
    const inputRef = useRef<HTMLInputElement>(null);

    const [ConfirmDialog, DeleteDialog] = UseConfirmHook(
        "Delete project",
        "Are you sure you want to delete this project? This action cannot be undone.",
        "destructive"
    );

    const handleDelete = async () => {
        const ok = await ConfirmDialog();
        if (!ok) return;
        deleteProject({
            param: {projectId: initialValues?.$id}
        }, {
            onSuccess: () => {
                router.push(`/workspaces/${initialValues.workspaceId}`);
            }
        })
    }


    const form = useForm<z.infer<typeof updateProjectSchema>>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? ""
        }
    });

    const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : ""
        }
        mutate({
            form: finalValues,
            param: {projectId: initialValues?.$id}
        }, {
            onSuccess: ({data}) => {
                form.reset();
                router.push(`/workspaces/${initialValues.workspaceId}/projects/${data.$id}`);
            }
        })
    }

    const onHandleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', file)
        }
    }

    return (
        <div className="flex flex-col gap-y-3">
            <DeleteDialog/>
            <div className="grid grid-cols-1 gap-3">
                <Card className="w-full h-full border-none rounded-sm">
                    <CardHeader className="h-5 flex flex-row items-center gap-x-4 space-y-0 px-7">
                        <Button
                            variant={"ghost"}
                            size={"sm"}
                            type="button"
                            onClick={onCancel ? onCancel : () => router.back()}
                            className="text-muted-foreground hover:text-muted-foreground rounded-sm"
                        >
                            <ArrowLeftToLine/>
                            Back
                        </Button>
                        <Separator orientation="vertical"/>
                        <CardTitle className="text-xl font-bold">
                            Project Setting
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-7 py-0">
                        <Separator className="mb-7"/>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-y-4">
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({field}) => (
                                            <div className="flex flex-col gap-y-2">
                                                <div className="flex items-center gap-x-5">
                                                    {
                                                        field.value ? (
                                                            <div
                                                                className="size-[72px] relative rounded-md overflow-hidden">
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
                                                                    <ImageIcon
                                                                        className="size-[38px] text-neutral-500"/>
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        )
                                                    }
                                                    <div className="flex flex-col">
                                                        <p className="text-sm">Project Icon</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            PNG, JPG, JPEG, or SVG, max 1MB
                                                        </p>
                                                        <Input
                                                            type="file"
                                                            accept=".png, .jpg, .jpeg, .svg"
                                                            className="hidden"
                                                            ref={inputRef}
                                                            disabled={isPending}
                                                            onChange={onHandleImageChange}
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
                                                                    <Upload/> Upload a file
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
                                                                    <X/> Remove
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
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel htmlFor="name">Project name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="Enter project name"
                                                        className="w-full shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                                                        autoComplete="off"
                                                        disabled={isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Separator className="my-7"/>
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
                                            <Loader className="h-4 w-4 animate-spin"/>
                                            <span>Updating project...</span>
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
                <Card className="w-full h-auto border-none bg-red-50 p-0 rounded-sm shadow-none">
                    <CardContent className="px-7 py-4">
                        <div className="flex flex-col">
                            <h3 className="font-bold">Danger Zone</h3>
                            <p className="text-sm text-muted-foreground">
                                Deleting a project is permanent and will remove all associated data.
                            </p>
                            <Separator className="my-4"/>
                            <Button
                                variant={"destructive"}
                                className="w-fit ml-auto rounded-sm bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600"
                                disabled={isPending || isPendingDeleteProject}
                                size={"sm"}
                                onClick={handleDelete}
                            >
                                Delete project
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}