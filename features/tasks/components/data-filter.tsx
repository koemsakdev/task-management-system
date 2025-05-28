import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "../type";
import { Member } from "@/features/members/type";
import DatePicker from "@/components/data-picker";
import { useTaskFilter } from "../hooks/use-task-filter";
import { Folder, ListCheck, Loader, User } from "lucide-react";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";

interface DataFilterProps {
  hideProjectFilter?: boolean;
}

const DataFilter = ({ hideProjectFilter }: DataFilterProps) => {
  const workspaceId = useWorkspacesId();
  const { data: projects, isLoading: isLoadingProject } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMember } = useGetMembers({
    workspaceId,
  });

  const isLoading = isLoadingProject || isLoadingMember;

  const projectsOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
  }));

  const membersOptions = members?.documents.map((member: Member) => ({
    value: member.$id,
    label: member.name,
  }));

  const [{ projectId, status, assigneeId, dueDate }, setFilters] =
    useTaskFilter();

  const onStatusChange = (value: string) => {
    if (value === "all") {
      setFilters({ status: null });
    } else {
      setFilters({ status: value as TaskStatus });
    }
  };

  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : (value as string) });
  };

  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : (value as string) });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground mr-2" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 cursor-pointer">
          <div className="flex items-center gap-x-2">
            <ListCheck className="size-4 text-muted-foreground mr-2" />
            <SelectValue
              className="text-muted-foreground"
              placeholder="All statuses"
            />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="cursor-pointer" value={"all"}>
            All statuses
          </SelectItem>
          <SelectSeparator />
          <SelectItem className="cursor-pointer" value={TaskStatus.BACKLOG}>
            Backlog
          </SelectItem>
          <SelectItem className="cursor-pointer" value={TaskStatus.TODO}>
            Todo
          </SelectItem>
          <SelectItem className="cursor-pointer" value={TaskStatus.IN_PROGRESS}>
            In Progress
          </SelectItem>
          <SelectItem className="cursor-pointer" value={TaskStatus.IN_REVIEW}>
            In Review
          </SelectItem>
          <SelectItem className="cursor-pointer" value={TaskStatus.DONE}>
            Done
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 cursor-pointer">
          <div className="flex items-center gap-x-2">
            <User className="size-4 text-muted-foreground mr-2" />
            <SelectValue
              className="text-muted-foreground"
              placeholder="All assignee"
            />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="cursor-pointer" value={"all"}>
            All assignee
          </SelectItem>
          <SelectSeparator />
          {membersOptions?.map((member) => (
            <SelectItem
              key={member.value}
              className="cursor-pointer"
              value={member.value}
            >
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => onProjectChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 cursor-pointer">
            <div className="flex items-center gap-x-2">
              <Folder className="size-4 text-muted-foreground mr-2" />
              <SelectValue
                className="text-muted-foreground"
                placeholder="All Project"
              />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value={"all"}>
              All projects
            </SelectItem>
            <SelectSeparator />
            {projectsOptions?.map((project) => (
              <SelectItem
                key={project.value}
                className="cursor-pointer"
                value={project.value}
              >
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <DatePicker
        placeholder="Due Date"
        className="w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};

export default DataFilter;
