import { ExternalLink, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import UseConfirmHook from "@/hooks/use-confirm";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useDeleteTask } from "../api/use-delete-task";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

interface TaskActionProps {
    id: string;
    projectId: string;
    children: React.ReactNode
}

const TaskAction = ({ id, projectId, children }: TaskActionProps) => {
    const workspaceId = useWorkspacesId();
    const { open } = useEditTaskModal();
    const router = useRouter();
    const [Confirm, ConfirmDialog] = UseConfirmHook(
        "Delete Task",
        "Are you sure you want to delete this task? This action cannot be undone.",
        "destructive"
    );
    const { mutate, isPending } = useDeleteTask();

    const handleDelete = async () => {
        const confirmed = await Confirm();
        if (!confirmed) return;
        mutate({ param: { taskId: id } });
    };

    const onOpenTask = () => {
        router.push(`/workspaces/${workspaceId}/tasks/${id}`);
    };

    const onOpenProject = () => {
        router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
    };

    return (
        <div className="flex justify-end">
            <ConfirmDialog />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                        onClick={onOpenTask}
                        disabled={false}
                        className="font-medium p-[10px] cursor-pointer"
                    >
                        <ExternalLink className="size-4 mr-2 stroke-2" />
                        Task Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => open(id)}
                        disabled={false}
                        className="font-medium p-[10px] cursor-pointer"
                    >
                        <Pencil className="size-4 mr-2 stroke-2" />
                        Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={onOpenProject}
                        disabled={false}
                        className="font-medium p-[10px] cursor-pointer"
                    >
                        <ExternalLink className="size-4 mr-2 stroke-2" />
                        Open Project
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleDelete}
                        disabled={isPending}
                        className="font-medium p-[10px] cursor-pointer"
                        variant="destructive"
                    >
                        <Trash className="size-4 mr-2 stroke-2" />
                        Delete Task
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default TaskAction