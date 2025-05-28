import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { showSuccessToast, showErrorToast } from "@/components/custom-toast";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>;

export const useCreateWorkspaces = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces["$post"]({ form });
      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      showSuccessToast("", {
        description: "Workspace created successfully",
        duration: 3000,
      });
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
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
