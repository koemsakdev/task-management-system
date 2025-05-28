import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "@/components/custom-toast";

type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;
type RequestType = InferRequestType<
  (typeof client.api.auth.login)["$post"]
>["json"];

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.login["$post"]({ json });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      showSuccessToast("", {
        description: "Login successful",
        duration: 3000,
      })
      queryClient.invalidateQueries({ queryKey: ["current"] });
      router.refresh();
    },
    onError: (error) => {
      showErrorToast("", {
        description: error instanceof Error ? error.message : "An error occurred during login",
        duration: 3000,
      })
    }
  });

  return mutation;
};
