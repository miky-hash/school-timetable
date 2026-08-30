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
    chip: "bg-slate-400/22 text-slate-800 dark:bg-slate-400/25 dark:text-slate-100",
    cell: "bg-slate-400/14 text-slate-950 dark:bg-slate-400/20 dark:text-slate-50",
  },
  rose: {
    label: "빨강",
    dot: "bg-rose-400",
    chip: "bg-rose-400/22 text-rose-800 dark:bg-rose-400/25 dark:text-rose-100",
    cell: "bg-rose-400/14 text-rose-950 dark:bg-rose-400/20 dark:text-rose-50",
  },
  orange: {
    label: "주황",
    dot: "bg-orange-400",
    chip: "bg-orange-400/22 text-orange-800 dark:bg-orange-400/25 dark:text-orange-100",
    cell: "bg-orange-400/14 text-orange-950 dark:bg-orange-400/20 dark:text-orange-50",
  },
  amber: {
    label: "노랑",
    dot: "bg-amber-400",
    chip: "bg-amber-400/22 text-amber-800 dark:bg-amber-400/25 dark:text-amber-100",
    cell: "bg-amber-400/14 text-amber-950 dark:bg-amber-400/20 dark:text-amber-50",
  },
  emerald: {
    label: "초록",
    dot: "bg-emerald-400",
    chip: "bg-emerald-400/22 text-emerald-800 dark:bg-emerald-400/25 dark:text-emerald-100",
    cell: "bg-emerald-400/14 text-emerald-950 dark:bg-emerald-400/20 dark:text-emerald-50",
  },
  teal: {
    label: "청록",
    dot: "bg-teal-400",
    chip: "bg-teal-400/22 text-teal-800 dark:bg-teal-400/25 dark:text-teal-100",
    cell: "bg-teal-400/14 text-teal-950 dark:bg-teal-400/20 dark:text-teal-50",
  },
  sky: {
    label: "하늘",
    dot: "bg-sky-400",
    chip: "bg-sky-400/22 text-sky-800 dark:bg-sky-400/25 dark:text-sky-100",
    cell: "bg-sky-400/14 text-sky-950 dark:bg-sky-400/20 dark:text-sky-50",
  },
  indigo: {
    label: "남색",
    dot: "bg-indigo-400",
    chip: "bg-indigo-400/22 text-indigo-800 dark:bg-indigo-400/25 dark:text-indigo-100",
    cell: "bg-indigo-400/14 text-indigo-950 dark:bg-indigo-400/20 dark:text-indigo-50",
  },
  violet: {
    label: "보라",
    dot: "bg-violet-400",
    chip: "bg-violet-400/22 text-violet-800 dark:bg-violet-400/25 dark:text-violet-100",
    cell: "bg-violet-400/14 text-violet-950 dark:bg-violet-400/20 dark:text-violet-50",
  },
  pink: {
    label: "분홍",
    dot: "bg-pink-400",
    chip: "bg-pink-400/22 text-pink-800 dark:bg-pink-400/25 dark:text-pink-100",
    cell: "bg-pink-400/14 text-pink-950 dark:bg-pink-400/20 dark:text-pink-50",
  },
} as const;

export type SubjectColor = keyof typeof SUBJECT_COLORS;

export const SUBJECT_COLOR_KEYS = Object.keys(SUBJECT_COLORS) as SubjectColor[];

export function colorOf(color: string | null | undefined) {
  return SUBJECT_COLORS[(color ?? "slate") as SubjectColor] ?? SUBJECT_COLORS.slate;
}
