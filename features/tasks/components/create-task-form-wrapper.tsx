import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";
import { Loader } from "lucide-react";
import { CreateTaskForm } from "./create-task-form";

interface CreateTaskFormWrapperProps {
    onCancel: () => void;
}

export const CreateTaskFormWrapper = ({ onCancel }: CreateTaskFormWrapperProps) => {
    const workspaceId = useWorkspacesId();
    const { data: projects, isLoading: isLoadingProject } = useGetProjects({ workspaceId: workspaceId });
    const { data: members, isLoading: isLoadingMember } = useGetMembers({ workspaceId: workspaceId });
    const projectOptions = projects?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl,
    }));

    const memberOptions = members?.documents.map((member) => ({
        id: member.$id,
        name: member.name,
    }));    

    const isLoading = isLoadingProject || isLoadingMember;
    if (isLoading) {
        return (
            <Card className="w-full h-[714px] border-none shadow-none">
                <CardContent className="flex items-center justify-center h-full">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    return (
        <CreateTaskForm 
            projectOptions={projectOptions || []}
            memberOptions={memberOptions || []}
            onCancel={onCancel}
        />
    )
}