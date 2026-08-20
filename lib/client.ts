"use client";

/** API 호출 헬퍼. 실패하면 서버가 준 메시지로 에러를 던집니다. */
export async function api<T = unknown>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const res = await fetch(path, {
    method: init.method ?? "GET",
    headers: init.body ? { "content-type": "application/json" } : undefined,
    body: init.body ? JSON.stringify(init.body) : undefined,
  });

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    /* 본문이 없을 수 있습니다 */
  }

  if (!res.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error: unknown }).error)
        : `요청에 실패했습니다 (${res.status})`;
    throw new Error(message);
  }
  return payload as T;
}
