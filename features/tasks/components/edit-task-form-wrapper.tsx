import { Loader } from "lucide-react";
import { EditTaskForm } from "./edit-task-form";
import { useGetTask } from "../api/use-get-task";
import { Member } from "@/features/members/type";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";

interface EditFormWrapperProps {
    onCancel: () => void;
    id: string;
}

export const EditTaskFormWrapper = ({ onCancel, id }: EditFormWrapperProps) => {
    const workspaceId = useWorkspacesId();

    const { data: initailValues, isLoading: isLoadingTask } = useGetTask({ taskId: id });

    const { data: projects, isLoading: isLoadingProject } = useGetProjects({ workspaceId: workspaceId });
    const { data: members, isLoading: isLoadingMember } = useGetMembers({ workspaceId: workspaceId });
    const projectOptions = projects?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl,
    }));

    const memberOptions = members?.documents.map((member: Member) => ({
        id: member.$id,
        name: member.name,
    }));

    const isLoading = isLoadingProject || isLoadingMember || isLoadingTask;
    if (isLoading) {
        return (
            <Card className="w-full h-[714px] border-none shadow-none">
                <CardContent className="flex items-center justify-center h-full">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    if (!initailValues) {
        return null;
    }

    return (
        <EditTaskForm
            initailValues={initailValues}
            projectOptions={projectOptions || []}
            memberOptions={memberOptions || []}
            onCancel={onCancel}
        />
    )
}