import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { showSuccessToast, showErrorToast } from "@/components/custom-toast";

type ResponseType = InferResponseType<(typeof client.api.members)[":memberId"]["$delete"], 200>;
type RequestType = InferRequestType<(typeof client.api.members)[":memberId"]["$delete"]>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"]["$delete"]({ param });
      if (!response.ok) {
        throw new Error("Failed to delete member");
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      showSuccessToast("", {
        description: "Member delete successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["members"] });
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
