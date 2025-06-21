import { z } from "zod";
import { Hono } from "hono";
import { Workspace } from "../type";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { generateInviteCode } from "@/lib/utils";
import { TaskStatus } from "@/features/tasks/type";
import { getMember } from "@/features/members/utils";
import { MemberRole } from "@/features/members/type";
import { sessionMiddleware } from "@/lib/session-middleware";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { updateWorkspaceSchema, workspaceSchema } from "../schemas";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBER_ID,
  PROJECT_ID,
  TASK_ID,
  WORKSPACE_ID,
} from "@/config";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const members = await databases.listDocuments(DATABASE_ID, MEMBER_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({
        data: { documents: [], total: 0 },
      });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_ID,
      [Query.orderDesc("$createdAt"), Query.equal("$id", workspaceIds)]
    );
    return c.json({
      data: workspaces,
    });
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId
    );

    return c.json({
      data: workspace,
    });
  })
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId
    );

    return c.json({
      data: {
        $id: workspaceId,
        name: workspace.name,
        imageUrl: workspace.imageUrl
      },
    });
  })
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();


    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: workspaceId,
    });

    if (!member) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(DATABASE_ID, TASK_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]);
    const lastMonthTasks = await databases.listDocuments(DATABASE_ID, TASK_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]);

    const taskCount = thisMonthTasks.total;
    const taskDiff = taskCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASK_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASK_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const assignedTaskCount = thisMonthAssignedTasks.total;
    const assignedTaskDiff = assignedTaskCount - lastMonthAssignedTasks.total;

    const thisMonthIncompleteTask = await databases.listDocuments(
      DATABASE_ID,
      TASK_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthIncompletTask = await databases.listDocuments(
      DATABASE_ID,
      TASK_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const incompleteTaskCount = thisMonthIncompleteTask.total;
    const incompleteTaskDiff =
      incompleteTaskCount - lastMonthIncompletTask.total;

    const thisMonthCompletedTask = await databases.listDocuments(
      DATABASE_ID,
      TASK_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTask = await databases.listDocuments(
      DATABASE_ID,
      TASK_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const completedTaskCount = thisMonthCompletedTask.total;
    const completedTaskDiff = completedTaskCount - lastMonthCompletedTask.total;

    const thisMonthOverdueTask = await databases.listDocuments(
      DATABASE_ID,
      TASK_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthOverdueTask = await databases.listDocuments(
      DATABASE_ID,
      TASK_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const overdueTaskCount = thisMonthOverdueTask.total;
    const overdueTaskDiff = overdueTaskCount - lastMonthOverdueTask.total;

    return c.json({
      data: {
        taskCount,
        taskDiff,
        assignedTaskCount,
        assignedTaskDiff,
        incompleteTaskCount,
        incompleteTaskDiff,
        completedTaskCount,
        completedTaskDiff,
        overdueTaskCount,
        overdueTaskDiff,
      },
    });
  })
  .post(
    "/",
    zValidator("form", workspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image } = c.req.valid("form");

      let uploadImageUlr: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFileView(
          IMAGES_BUCKET_ID,
          file.$id
        );
        uploadImageUlr = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadImageUlr,
          inviteCode: generateInviteCode(8),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBER_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({
        data: workspace,
      });
    }
  )
  .patch(
    "/:workspaceId",
    zValidator("form", updateWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      let uploadImageUlr: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFileView(
          IMAGES_BUCKET_ID,
          file.$id
        );
        uploadImageUlr = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadImageUlr = image;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadImageUlr,
        }
      );

      return c.json({
        data: workspace,
      });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    // Delete workspace
    await databases.deleteDocument(DATABASE_ID, WORKSPACE_ID, workspaceId);

    // Delete all projects in the workspace
    const projects = await databases.listDocuments(
      DATABASE_ID,
      PROJECT_ID,
      [Query.equal("workspaceId", workspaceId)]
    );
    for (const project of projects.documents) {
      await databases.deleteDocument(DATABASE_ID, PROJECT_ID, project.$id);
    }

    // Delete all tasks in the workspace
    const tasks = await databases.listDocuments(
      DATABASE_ID,
      TASK_ID,
      [Query.equal("workspaceId", workspaceId)]
    );
    for (const task of tasks.documents) {
      await databases.deleteDocument(DATABASE_ID, TASK_ID, task.$id);
    }

    // Delete all members in the workspace
    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBER_ID,
      [Query.equal("workspaceId", workspaceId)]
    );
    for (const member of members.documents) {
      await databases.deleteDocument(DATABASE_ID, MEMBER_ID, member.$id);
    }

    return c.json({
      data: { $id: workspaceId },
    });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(8),
      }
    );

    return c.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (member) {
        return c.json(
          {
            error: "Already joined",
          },
          400
        );
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId
      );

      if (workspace.inviteCode !== code) {
        return c.json(
          {
            error: "Invalid invite code",
          },
          400
        );
      }

      await databases.createDocument(DATABASE_ID, MEMBER_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.MEMBER,
      });

      return c.json({
        data: workspace,
      });
    }
  );

export default app;
