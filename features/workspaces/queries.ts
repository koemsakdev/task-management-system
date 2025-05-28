import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBER_ID, WORKSPACE_ID } from "@/config";
import { getMember } from "../members/utils";
import { Workspace } from "./type";
import { createSessionClient } from "@/lib/appwrite";

export const getWorkspaces = async () => {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBER_ID,
        [
            Query.equal('userId', user.$id),
        ]
    );

    if (members.total === 0) {
        return { documents: [], total: 0 };
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACE_ID,
        [
            Query.orderDesc('$createdAt'),
            Query.equal('$id', workspaceIds),
        ]
    );
    return workspaces;
}

export const getWorkspace = async ({ workspaceId }: { workspaceId: string }) => {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const members = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    });

    if (!members) {
        throw new Error("You are not a member of this workspace");
    }

    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId
    );
    return workspace;
}
