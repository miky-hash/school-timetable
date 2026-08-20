import { cookies } from "next/headers";

import {
  EDIT_COOKIE,
  EDIT_COOKIE_MAX_AGE,
  checkPassword,
  editToken,
  isEditPasswordConfigured,
} from "@/lib/auth";

export async function POST(request: Request) {
  if (!isEditPasswordConfigured()) {
    return Response.json(
      { error: "CLASS_EDIT_PASSWORD 환경변수가 아직 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  if (!checkPassword(password)) {
    // 무작위 대입을 조금이라도 느리게 만듭니다.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return Response.json({ error: "비밀번호가 맞지 않아요." }, { status: 401 });
  }

  (await cookies()).set(EDIT_COOKIE, editToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: EDIT_COOKIE_MAX_AGE,
    path: "/",
  });

  return Response.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).delete(EDIT_COOKIE);
  return Response.json({ ok: true });
}
