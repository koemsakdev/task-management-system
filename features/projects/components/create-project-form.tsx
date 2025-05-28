"use client";
import { useRef } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

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
import { useCreateProject } from "../api/use-create-project";
import { ImageIcon, Loader, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { projectSchema } from "../schema";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";

interface CreateProjectFormProps {
    onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
    const workspaceId = useWorkspacesId();
    const router = useRouter();
    const { mutate, isPending } = useCreateProject();
    const inputRef = useRef<HTMLInputElement>(null);
    const form = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: '',
            workspaceId: workspaceId,
        }
    });

    const onSubmit = (values: z.infer<typeof projectSchema>) => {
        const finalValues = {
            ...values,
            workspaceId,
            image: values.image instanceof File ? values.image : ""
        }
        mutate({ form: finalValues }, {
            onSuccess: ({ data }) => {
                form.reset();
                router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
            }
        })
    }

    const onHanldeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', file)
        }
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex px-7">
                <CardTitle className="text-xl font-bold">Create a new project</CardTitle>
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
                                                            className="w-fit mt-2 text-red-400 hover:text-red-500"
                                                            disabled={isPending}
                                                            onClick={() => {
                                                                field.onChange(null);
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
                                    "rounded-sm bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600",
                                    !onCancel && "hidden"
                                )}
                                size={"sm"}
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
                                    "bg-blue-100 hover:bg-blue-200 text-blue-500 hover:text-blue-600 rounded-sm"
                                )}
                                disabled={isPending}

                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader className="h-4 w-4 animate-spin" />
                                        <span>Creating project...</span>
                                    </span>
                                ) : (
                                    <span>Create project</span>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}