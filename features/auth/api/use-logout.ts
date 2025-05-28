import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "@/components/custom-toast";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const mutation = useMutation<ResponseType, unknown>({
        mutationFn: async () => {
            const response = await client.api.auth.logout["$post"]();
            if (!response.ok) {
                throw new Error("Logout failed");
            }
            return (await response.json()) as ResponseType;
        },
        onSuccess: () => {
            showSuccessToast("", {
                description: "Logout successful",
                duration: 3000,
            })
            queryClient.clear();
            queryClient.invalidateQueries();

            router.push('/sign-in');
        },
        onError: (error) => {
            showErrorToast("", {
                description: error instanceof Error ? error.message : "An error occurred during logout",
                duration: 3000,
            })
        }
    });

    return mutation;
};
