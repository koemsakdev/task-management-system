import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { showSuccessToast, showErrorToast } from "@/components/custom-toast";
type ResponseType = InferResponseType<(typeof client.api.projects)[":projectId"]["$delete"], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)[":projectId"]["$delete"]>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[":projectId"]["$delete"]({ param });
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: ({ data }) => {
      showSuccessToast("", {
        description: "Project deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: (error) => {
      showErrorToast("", {
        description: error instanceof Error ? error.message : "An error occurred",
        duration: 3000,
      });
    }
  });

  return mutation;
};
