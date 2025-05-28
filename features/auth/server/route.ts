import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signInSchema, signUpSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE } from "../constanst";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");
    return c.json({ success: true, data: user });
  })
  .post("/login", zValidator("json", signInSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return c.json({ success: true, data: session });
  })
  .post("/register", zValidator("json", signUpSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");
    const { account } = await createAdminClient();
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    );
    const session = await account.createEmailPasswordSession(email, password);
    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return c.json({ success: true, data: user });
  })
  .post("/logout", sessionMiddleware, async (c) => {
      const account = c.get("account");
      deleteCookie(c, AUTH_COOKIE);
      await account.deleteSession("current");
      return c.json({ success: true });
  })

export default app;
