import { Models } from "node-appwrite";

export enum MemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    VIEWER = "VIEWER"
}
export type Member = Models.Document & {
    userId: string;
    workspaceId: string;
    role: MemberRole;
}