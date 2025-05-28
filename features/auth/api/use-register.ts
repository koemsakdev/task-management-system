import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "@/components/custom-toast";

type ResponseType = InferResponseType<(typeof client.api.auth.register)["$post"]>;
type RequestType = InferRequestType<
  (typeof client.api.auth.register)["$post"]
>["json"];

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.register["$post"]({ json });
      if (!response.ok) {
        throw new Error("Register failed");
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current"] });
      showSuccessToast("", {
        description: "Register successful",
        duration: 3000,
      })
      router.refresh();
    },
    onError: (error) => {
      showErrorToast("", {
        description: error instanceof Error ? error.message : "An error occurred during register",
        duration: 3000,
      })
    }
  });

  return mutation;
};
