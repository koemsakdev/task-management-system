import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGeTaskProps {
    taskId: string;
}
export const useGetTask = ({ taskId }: UseGeTaskProps) => {
    const query = useQuery({
        queryKey: ["task", taskId],
        queryFn: async () => {
            const response = await client.api.tasks[":taskId"].$get({ param: { taskId } });

            if (!response.ok) {
                throw new Error("Fail to get task");
            }
            const { data } = await response.json();
            return data;
        }
    });
    return query;
};