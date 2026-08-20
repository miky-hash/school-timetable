"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { colorOf, taskTypeEmoji } from "@/lib/constants";
import { dueInfo, todayISO, type DueTone } from "@/lib/date";
import type { Subject, Task } from "@/lib/types";

const TONE: Record<DueTone, string> = {
  overdue: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  today: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  soon: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  later: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export default function UpcomingStrip({
  tasks,
  subjects,
}: {
  tasks: Task[];
  subjects: Subject[];
}) {
  // 남은 날짜는 브라우저 시간 기준으로 계산합니다.
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(todayISO()), []);

  const upcoming = tasks
    .filter((task) => !task.done && task.due_date)
    .sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""))
    .slice(0, 4);

  if (upcoming.length === 0) return null;

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {upcoming.map((task) => {
        const subject = subjects.find((s) => s.id === task.subject_id);
        const info = today && task.due_date ? dueInfo(task.due_date, today) : null;
        return (
          <Link
            key={task.id}
            href="/tasks"
            className="card flex shrink-0 items-center gap-2 px-3 py-2 text-sm transition hover:brightness-95"
          >
            <span>{taskTypeEmoji(task.type)}</span>
            {subject && (
              <span className={`rounded px-1.5 py-0.5 text-[11px] ${colorOf(subject.color).chip}`}>
                {subject.name}
              </span>
            )}
            <span className="max-w-40 truncate font-medium">{task.title}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                info ? TONE[info.tone] : "bg-slate-100 dark:bg-slate-800"
              }`}
            >
              {info?.text ?? "…"}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
