import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/features/auth/constanst";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  if (!userId || !secret) {
    throw new NextResponse("Missing userId or secret", { status: 400 });
  }

  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  (await cookies()).set(AUTH_COOKIE, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/`);
}
