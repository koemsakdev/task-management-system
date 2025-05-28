import { createSessionClient } from "@/lib/appwrite";

export const getCurrent = async () => {
    try {
        const { account } = await createSessionClient();
        // account.client.setSession(session.value);
        return await account.get();
    } catch (error) {
        return null;
    }
}