import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const EDIT_COOKIE = "stt_edit";
export const EDIT_COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90일

function editPassword() {
  return process.env.CLASS_EDIT_PASSWORD ?? "";
}

function secret() {
  return process.env.AUTH_SECRET || "school-timetable-default-secret";
}

export function isEditPasswordConfigured() {
  return editPassword().length > 0;
}

/** 쿠키에 저장할 토큰. 비밀번호가 바뀌면 기존 토큰은 자동으로 무효가 됩니다. */
export function editToken() {
  return createHmac("sha256", secret()).update(editPassword()).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkPassword(input: string) {
  const expected = editPassword();
  if (!expected) return false;
  return safeEqual(input, expected);
}

/** 현재 요청이 편집 권한을 가지고 있는지 */
export async function hasEditAccess() {
  if (!isEditPasswordConfigured()) return false;
  const token = (await cookies()).get(EDIT_COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, editToken());
}

/** 쓰기 API 가드. 권한이 없으면 401 응답을 돌려줍니다. */
export async function requireEditAccess(): Promise<Response | null> {
  if (await hasEditAccess()) return null;
  return Response.json(
    { error: "편집하려면 먼저 비밀번호를 입력해 잠금을 풀어주세요." },
    { status: 401 },
  );
}
