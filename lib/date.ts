/** 브라우저 로컬 시간 기준 오늘 날짜 (YYYY-MM-DD) */
export function todayISO(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 1 = 월 ... 7 = 일 */
export function todayDayOfWeek(d = new Date()) {
  return d.getDay() === 0 ? 7 : d.getDay();
}

function toUTCDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, (m ?? 1) - 1, d ?? 1);
}

/** 오늘부터 마감일까지 남은 날 수 (오늘이면 0, 지났으면 음수) */
export function daysUntil(due: string, today: string) {
  return Math.round((toUTCDate(due) - toUTCDate(today)) / 86_400_000);
}

export type DueTone = "overdue" | "today" | "soon" | "later";

export function dueInfo(due: string, today: string): { text: string; tone: DueTone } {
  const diff = daysUntil(due, today);
  if (diff < 0) return { text: `${-diff}일 지남`, tone: "overdue" };
  if (diff === 0) return { text: "오늘까지", tone: "today" };
  if (diff === 1) return { text: "내일까지", tone: "today" };
  if (diff <= 3) return { text: `D-${diff}`, tone: "soon" };
  return { text: `D-${diff}`, tone: "later" };
}

/** "2026-08-25" → "8월 25일 (화)" */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const names = ["일", "월", "화", "수", "목", "금", "토"];
  const dow = names[new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)).getUTCDay()];
  return `${m}월 ${d}일 (${dow})`;
}
