"use client";
import { useRef } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { workspaceSchema } from "../schemas";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspaces } from "../api/use-create-workspace";
import { ImageIcon, Loader, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateWorkspaceFormProps {
    onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
    const router = useRouter();
    const { mutate, isPending } = useCreateWorkspaces();
    const inputRef = useRef<HTMLInputElement>(null);
    const form = useForm<z.infer<typeof workspaceSchema>>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: ''
        }
    });

    const onSubmit = (values: z.infer<typeof workspaceSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : ""
        }
        mutate({ form: finalValues }, {
            onSuccess: ({ data }) => {
                router.push(`/workspaces/${data.$id}`)
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
                <CardTitle className="text-xl font-bold">Create a new workspace</CardTitle>
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
                                className={cn(
                                    "bg-blue-500 hover:bg-blue-600 text-white rounded-sm"
                                )}
                                disabled={isPending}

                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader className="h-4 w-4 animate-spin" />
                                        <span>Creating workspace...</span>
                                    </span>
                                ) : (
                                    <span>Create workspace</span>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}