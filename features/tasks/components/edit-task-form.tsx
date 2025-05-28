"use client";
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
import { Task, TaskStatus } from "../type";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskSchema } from "../schemas";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";
import DatePicker from "@/components/data-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useUpdateTask } from "../api/use-update-task";

interface EditTaskFormProps {
    onCancel?: () => void;
    projectOptions: { id: string, name: string, imageUrl: string }[];
    memberOptions: { id: string, name: string }[];
    initailValues: Task;
}

export const EditTaskForm = ({ onCancel, projectOptions, memberOptions, initailValues }: EditTaskFormProps) => {
    const workspaceId = useWorkspacesId();
    const router = useRouter();
    const { mutate, isPending } = useUpdateTask();
    const form = useForm<z.infer<typeof TaskSchema>>({
        resolver: zodResolver(TaskSchema),
        defaultValues: {
            workspaceId: workspaceId,
            status: initailValues.status,
            assigneeId: initailValues.assigneeId,
            projectId: initailValues.projectId,
            name: initailValues.name,
            dueDate: initailValues.dueDate ? new Date(initailValues.dueDate) : undefined,
        }
    });

    const onSubmit = (values: z.infer<typeof TaskSchema>) => {
        mutate({ json: values, param: { taskId: initailValues.$id } }, {
            onSuccess: () => {
                form.reset();
                onCancel?.();
            }
        })
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex px-7">
                <CardTitle className="text-xl font-bold">Edit a new task</CardTitle>
            </CardHeader>
            <CardContent className="px-7 py-0">
                <Separator className="mb-7" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Task name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="Enter task name"
                                                className="w-full shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                                                autoComplete="off"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Due Date</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                {...field}
                                                value={field.value}
                                                onChange={(date) => field.onChange(date)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="assigneeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Assignee</FormLabel>
                                        <FormControl>
                                            <Select
                                                defaultValue={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 cursor-pointer">
                                                        <SelectValue
                                                            placeholder="Select assignee"
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <FormMessage />
                                                <SelectContent>
                                                    {memberOptions.map((member) => (
                                                        <SelectItem key={member.id} value={member.id}>
                                                            <div className="flex items-center gap-x-2">
                                                                <MemberAvatar
                                                                    className="size-6"
                                                                    name={member.name}
                                                                />
                                                                <span className="text-sm font-medium truncate">{member.name}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Status</FormLabel>
                                        <FormControl>
                                            <Select
                                                defaultValue={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 cursor-pointer">
                                                        <SelectValue
                                                            placeholder="Select assignee"
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <FormMessage />
                                                <SelectContent>
                                                    <SelectItem className="cursor-pointer" value={TaskStatus.BACKLOG}>
                                                        <span className="text-sm font-medium truncate">Backlog</span>
                                                    </SelectItem>
                                                    <SelectItem className="cursor-pointer" value={TaskStatus.TODO}>
                                                        <span className="text-sm font-medium truncate">Todo</span>
                                                    </SelectItem>
                                                    <SelectItem className="cursor-pointer" value={TaskStatus.IN_PROGRESS}>
                                                        <span className="text-sm font-medium truncate">In Progress</span>
                                                    </SelectItem>
                                                    <SelectItem className="cursor-pointer" value={TaskStatus.IN_REVIEW}>
                                                        <span className="text-sm font-medium truncate">In Review</span>
                                                    </SelectItem>
                                                    <SelectItem className="cursor-pointer" value={TaskStatus.DONE}>
                                                        <span className="text-sm font-medium truncate">Done</span>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="projectId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Project</FormLabel>
                                        <FormControl>
                                            <Select
                                                defaultValue={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 cursor-pointer">
                                                        <SelectValue
                                                            placeholder="Select project"
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <FormMessage />
                                                <SelectContent>
                                                    {projectOptions.map((project) => (
                                                        <SelectItem key={project.id} value={project.id}>
                                                            <div className="flex items-center gap-x-2">
                                                                <ProjectAvatar
                                                                    className="size-6"
                                                                    name={project.name}
                                                                    image={project.imageUrl}
                                                                />
                                                                <span className="text-sm font-medium truncate">{project.name}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                        <span>Saving changes...</span>
                                    </span>
                                ) : (
                                    <span>Save changes</span>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}