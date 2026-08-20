"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { api } from "@/lib/client";
import { TASK_TYPES, colorOf, taskTypeEmoji, taskTypeLabel } from "@/lib/constants";
import { dueInfo, formatDate, todayISO, type DueTone } from "@/lib/date";
import type { Subject, Task } from "@/lib/types";
import Modal from "./Modal";
import TaskForm from "./TaskForm";

const TONE: Record<DueTone, string> = {
  overdue: "bg-rose-400/25 text-rose-700 dark:bg-rose-400/25 dark:text-rose-100",
  today: "bg-amber-400/30 text-amber-800 dark:bg-amber-400/25 dark:text-amber-100",
  soon: "bg-indigo-400/25 text-indigo-700 dark:bg-indigo-400/25 dark:text-indigo-100",
  later: "bg-slate-400/20 text-slate-600 dark:bg-slate-400/20 dark:text-slate-200",
};

export default function TaskListView({
  tasks,
  subjects,
  canEdit,
}: {
  tasks: Task[];
  subjects: Subject[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [showDone, setShowDone] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [today, setToday] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => setToday(todayISO()), []);

  const visible = useMemo(() => {
    return tasks
      .filter((task) => (showDone ? true : !task.done))
      .filter((task) => (typeFilter === "all" ? true : task.type === typeFilter))
      .filter((task) =>
        subjectFilter === "all"
          ? true
          : subjectFilter === "none"
            ? task.subject_id === null
            : task.subject_id === subjectFilter,
      )
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
        if (a.due_date) return -1;
        if (b.due_date) return 1;
        return b.created_at.localeCompare(a.created_at);
      });
  }, [tasks, showDone, typeFilter, subjectFilter]);

  const remaining = tasks.filter((t) => !t.done).length;

  async function toggleDone(task: Task) {
    if (pendingId) return; // 서버에 저장하는 동안 두 번 눌리는 것을 막습니다.
    setPendingId(task.id);
    try {
      await api(`/api/tasks/${task.id}`, { method: "PATCH", body: { done: !task.done } });
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "바꾸지 못했습니다.");
    } finally {
      setPendingId(null);
    }
  }

  async function remove(task: Task) {
    if (!confirm(`"${task.title}" 을(를) 지울까요?`)) return;
    try {
      await api(`/api/tasks/${task.id}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "지우지 못했습니다.");
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          남은 할 일 <span className="font-semibold text-slate-900 dark:text-slate-100">{remaining}</span>개
        </p>
        {canEdit && (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>
            + 추가하기
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="segmented">
          <FilterChip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
            전체
          </FilterChip>
          {TASK_TYPES.map((option) => (
            <FilterChip
              key={option.value}
              active={typeFilter === option.value}
              onClick={() => setTypeFilter(option.value)}
            >
              {option.emoji} {option.label}
            </FilterChip>
          ))}
        </div>

        <select
          className="input w-auto !py-1.5 !text-xs"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          aria-label="과목으로 거르기"
        >
          <option value="all">모든 과목</option>
          <option value="none">과목 없음</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>

        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <input
            type="checkbox"
            className="size-3.5 accent-indigo-600"
            checked={showDone}
            onChange={(e) => setShowDone(e.target.checked)}
          />
          다 한 것도 보기
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="card p-10 text-center text-sm text-slate-500 dark:text-slate-400">
          {tasks.length === 0 ? "아직 등록된 할 일이 없어요." : "조건에 맞는 할 일이 없어요."}
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((task) => {
            const subject = subjects.find((s) => s.id === task.subject_id);
            const info = today && task.due_date ? dueInfo(task.due_date, today) : null;

            return (
              <li key={task.id} className={`card rounded-2xl p-3 transition duration-200 ${task.done ? "opacity-50" : ""}`}>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 shrink-0 accent-indigo-600 disabled:cursor-not-allowed"
                    checked={task.done}
                    disabled={!canEdit || pendingId !== null}
                    onChange={() => toggleDone(task)}
                    aria-label="다 했어요"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {taskTypeEmoji(task.type)} {taskTypeLabel(task.type)}
                      </span>
                      {subject && (
                        <span
                          className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${colorOf(subject.color).chip}`}
                        >
                          {subject.name}
                        </span>
                      )}
                      {task.due_date && (
                        <span
                          className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                            info && !task.done ? TONE[info.tone] : TONE.later
                          }`}
                        >
                          {formatDate(task.due_date)}
                          {info && !task.done ? ` · ${info.text}` : ""}
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-1 font-medium break-words ${task.done ? "line-through" : ""}`}
                    >
                      {task.title}
                    </p>

                    {task.description && (
                      <p className="mt-1 text-sm whitespace-pre-wrap text-slate-500 dark:text-slate-400">
                        {task.description}
                      </p>
                    )}

                    {task.created_by && (
                      <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">— {task.created_by}</p>
                    )}
                  </div>

                  {canEdit && (
                    <div className="flex shrink-0 flex-col gap-1">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setEditing(task)}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => remove(task)}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {!canEdit && (
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          할 일을 추가하거나 체크하려면 위에서 <strong>🔒 편집하기</strong> 를 눌러 잠금을 풀어주세요.
        </p>
      )}

      <Modal open={adding} title="할 일 추가" onClose={() => setAdding(false)}>
        <TaskForm
          subjects={subjects}
          onDone={() => {
            setAdding(false);
            router.refresh();
          }}
        />
      </Modal>

      <Modal open={editing !== null} title="할 일 수정" onClose={() => setEditing(null)}>
        {editing && (
          <TaskForm
            key={editing.id}
            subjects={subjects}
            task={editing}
            onDone={() => {
              setEditing(null);
              router.refresh();
            }}
          />
        )}
      </Modal>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`segmented-item !px-3 !py-1 !text-xs ${active ? "segmented-item-active" : ""}`}
    >
      {children}
    </button>
  );
}
