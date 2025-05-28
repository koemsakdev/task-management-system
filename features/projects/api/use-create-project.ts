import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { showSuccessToast, showErrorToast } from "@/components/custom-toast";

type ResponseType = InferResponseType<(typeof client.api.projects)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects["$post"]({ form });
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      showSuccessToast("", {
        description: "Project created successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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
