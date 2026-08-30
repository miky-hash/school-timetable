import { requireEditAccess } from "./auth";
import { isSupabaseConfigured } from "./supabase";

/**
 * 쓰기 API 공통 가드.
 * DB 가 아직 연결되지 않았거나 편집 잠금이 풀리지 않았으면 응답을 돌려주고,
 * 문제가 없으면 null 을 돌려줍니다.
 */
export async function requireWritable(): Promise<Response | null> {
  if (!isSupabaseConfigured()) {
    return Response.json(
      { error: "데이터베이스가 아직 연결되지 않았습니다. README 의 설정 방법을 확인하세요." },
      { status: 503 },
    );
  }
  return requireEditAccess();
}
