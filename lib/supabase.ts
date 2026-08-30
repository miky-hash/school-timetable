import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 브라우저는 Supabase 에 직접 접속하지 않습니다.
 * 이 클라이언트는 서버(서버 컴포넌트 · Route Handler)에서만 쓰이고,
 * service_role 키를 사용하므로 절대 클라이언트 컴포넌트에서 import 하지 마세요.
 */

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured() {
  return Boolean(url && serviceKey);
}

let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되지 않았습니다. README 의 설정 방법을 확인하세요.",
    );
  }
  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
