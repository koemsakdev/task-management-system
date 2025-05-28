import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { showSuccessToast, showErrorToast } from "@/components/custom-toast";

type ResponseType = InferResponseType<(typeof client.api.tasks)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["$post"]({ json });
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      showSuccessToast("", {
        description: "Task created successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
