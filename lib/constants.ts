/**
 * 우리 반에 맞게 고치고 싶으면 이 파일만 수정하면 됩니다.
 */

/** 요일 (1 = 월요일) */
export const DAYS = [
  { value: 1, label: "월" },
  { value: 2, label: "화" },
  { value: 3, label: "수" },
  { value: 4, label: "목" },
  { value: 5, label: "금" },
] as const;

/** 하루 교시 수 */
export const PERIOD_COUNT = 7;

export const PERIODS = Array.from({ length: PERIOD_COUNT }, (_, i) => i + 1);

/** 교시별 시작 시간 (표에 작게 표시됩니다. 학교 시간에 맞게 고치세요.) */
export const PERIOD_TIMES: Record<number, string> = {
  1: "09:00",
  2: "10:00",
  3: "11:00",
  4: "12:00",
  5: "13:50",
  6: "14:50",
  7: "15:50",
};

export const TASK_TYPES = [
  { value: "homework", label: "숙제", emoji: "📝" },
  { value: "performance", label: "수행평가", emoji: "🎯" },
  { value: "todo", label: "할 일", emoji: "📌" },
] as const;

export type TaskType = (typeof TASK_TYPES)[number]["value"];

export function taskTypeLabel(type: string) {
  return TASK_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function taskTypeEmoji(type: string) {
  return TASK_TYPES.find((t) => t.value === type)?.emoji ?? "•";
}

/**
 * 과목 색상.
 * Tailwind 는 소스에 그대로 적힌 클래스만 만들어내기 때문에
 * 문자열을 조합하지 않고 아래처럼 전부 적어둡니다.
 */
export const SUBJECT_COLORS = {
  slate: {
    label: "회색",
    dot: "bg-slate-400",
    chip: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    cell: "bg-slate-50 text-slate-800 ring-slate-200 dark:bg-slate-800/60 dark:text-slate-100 dark:ring-slate-700",
  },
  rose: {
    label: "빨강",
    dot: "bg-rose-400",
    chip: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
    cell: "bg-rose-50 text-rose-900 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-100 dark:ring-rose-900",
  },
  orange: {
    label: "주황",
    dot: "bg-orange-400",
    chip: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-200",
    cell: "bg-orange-50 text-orange-900 ring-orange-200 dark:bg-orange-950/60 dark:text-orange-100 dark:ring-orange-900",
  },
  amber: {
    label: "노랑",
    dot: "bg-amber-400",
    chip: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    cell: "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-100 dark:ring-amber-900",
  },
  emerald: {
    label: "초록",
    dot: "bg-emerald-400",
    chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
    cell: "bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-100 dark:ring-emerald-900",
  },
  teal: {
    label: "청록",
    dot: "bg-teal-400",
    chip: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-200",
    cell: "bg-teal-50 text-teal-900 ring-teal-200 dark:bg-teal-950/60 dark:text-teal-100 dark:ring-teal-900",
  },
  sky: {
    label: "하늘",
    dot: "bg-sky-400",
    chip: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200",
    cell: "bg-sky-50 text-sky-900 ring-sky-200 dark:bg-sky-950/60 dark:text-sky-100 dark:ring-sky-900",
  },
  indigo: {
    label: "남색",
    dot: "bg-indigo-400",
    chip: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200",
    cell: "bg-indigo-50 text-indigo-900 ring-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-100 dark:ring-indigo-900",
  },
  violet: {
    label: "보라",
    dot: "bg-violet-400",
    chip: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-200",
    cell: "bg-violet-50 text-violet-900 ring-violet-200 dark:bg-violet-950/60 dark:text-violet-100 dark:ring-violet-900",
  },
  pink: {
    label: "분홍",
    dot: "bg-pink-400",
    chip: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-200",
    cell: "bg-pink-50 text-pink-900 ring-pink-200 dark:bg-pink-950/60 dark:text-pink-100 dark:ring-pink-900",
  },
} as const;

export type SubjectColor = keyof typeof SUBJECT_COLORS;

export const SUBJECT_COLOR_KEYS = Object.keys(SUBJECT_COLORS) as SubjectColor[];

export function colorOf(color: string | null | undefined) {
  return SUBJECT_COLORS[(color ?? "slate") as SubjectColor] ?? SUBJECT_COLORS.slate;
}
