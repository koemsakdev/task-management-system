import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { showSuccessToast, showErrorToast } from "@/components/custom-toast";

type ResponseType = InferResponseType<(typeof client.api.members)[":memberId"]["$patch"], 200>;
type RequestType = InferRequestType<(typeof client.api.members)[":memberId"]["$patch"]>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members[":memberId"]["$patch"]({ param, json });
      if (!response.ok) {
        throw new Error("Failed to update member");
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: ({ data }) => {
      showSuccessToast("", {
        description: "Member update successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member", data.$id] });
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
