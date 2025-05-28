import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { showSuccessToast, showErrorToast } from "@/components/custom-toast";

type ResponseType = InferResponseType<(typeof client.api.workspaces)[":workspaceId"]["join"]["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["join"]["$post"]({ json, param });
      if (!response.ok) {
        throw new Error("Failed to join workspace.");
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: ({ data }) => {
      showSuccessToast("", {
        description: "Successfully joined workspace.",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
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
