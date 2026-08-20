"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { api } from "@/lib/client";
import { DAYS, PERIODS, PERIOD_TIMES, colorOf, taskTypeEmoji } from "@/lib/constants";
import { formatDate } from "@/lib/date";
import type { Subject, Task, TimetableSlot } from "@/lib/types";
import Modal from "./Modal";

type Cell = { day: number; period: number };

export default function TimetableBoard({
  subjects,
  slots,
  tasks,
  canEdit,
}: {
  subjects: Subject[];
  slots: TimetableSlot[];
  tasks: Task[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [cell, setCell] = useState<Cell | null>(null);
  const [today, setToday] = useState<number | null>(null);

  // 서버와 브라우저의 시간대가 다를 수 있어 오늘 요일은 마운트 후에 계산합니다.
  useEffect(() => {
    const d = new Date().getDay();
    setToday(d === 0 ? 7 : d);
  }, []);

  const slotMap = useMemo(() => {
    const map = new Map<string, TimetableSlot>();
    for (const slot of slots) map.set(`${slot.day}-${slot.period}`, slot);
    return map;
  }, [slots]);

  const subjectMap = useMemo(() => {
    const map = new Map<string, Subject>();
    for (const subject of subjects) map.set(subject.id, subject);
    return map;
  }, [subjects]);

  const current = cell ? slotMap.get(`${cell.day}-${cell.period}`) : undefined;

  return (
    <section>
      <div className="card overflow-hidden">
        <div className="grid grid-cols-[2.5rem_repeat(5,minmax(0,1fr))] sm:grid-cols-[3.5rem_repeat(5,minmax(0,1fr))]">
          <div className="border-b border-white/25 dark:border-white/10" />
          {DAYS.map((day) => (
            <div
              key={day.value}
              className={`border-b border-white/25 py-2.5 text-center text-sm font-semibold dark:border-white/10 ${
                today === day.value
                  ? "bg-white/35 text-indigo-700 dark:bg-white/10 dark:text-indigo-200"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {day.label}
            </div>
          ))}

          {PERIODS.map((period) => (
            <PeriodRow
              key={period}
              period={period}
              today={today}
              slotMap={slotMap}
              subjectMap={subjectMap}
              onPick={setCell}
            />
          ))}
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
        {canEdit
          ? "칸을 눌러 과목을 넣거나 바꿀 수 있어요."
          : "칸을 누르면 그 과목의 남은 할 일을 볼 수 있어요."}
      </p>

      <Modal
        open={cell !== null}
        title={
          cell ? `${DAYS.find((d) => d.value === cell.day)?.label}요일 ${cell.period}교시` : ""
        }
        onClose={() => setCell(null)}
      >
        {cell && (
          <SlotEditor
            key={`${cell.day}-${cell.period}`}
            cell={cell}
            slot={current}
            subjects={subjects}
            tasks={tasks}
            canEdit={canEdit}
            onDone={() => {
              setCell(null);
              router.refresh();
            }}
          />
        )}
      </Modal>
    </section>
  );
}

function PeriodRow({
  period,
  today,
  slotMap,
  subjectMap,
  onPick,
}: {
  period: number;
  today: number | null;
  slotMap: Map<string, TimetableSlot>;
  subjectMap: Map<string, Subject>;
  onPick: (cell: Cell) => void;
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center border-t border-white/20 py-1 text-slate-500 dark:border-white/[0.07] dark:text-slate-400">
        <span className="text-sm font-semibold">{period}</span>
        <span className="hidden text-[10px] sm:block">{PERIOD_TIMES[period]}</span>
      </div>

      {DAYS.map((day) => {
        const slot = slotMap.get(`${day.value}-${period}`);
        const subject = slot?.subject_id ? subjectMap.get(slot.subject_id) : undefined;
        const palette = colorOf(subject?.color);

        return (
          <button
            key={day.value}
            type="button"
            onClick={() => onPick({ day: day.value, period })}
            className={`min-h-14 border-t border-l border-white/20 p-1 text-center transition duration-200 hover:bg-white/40 sm:min-h-16 dark:border-white/[0.07] dark:hover:bg-white/10 ${
              subject
                ? palette.cell
                : today === day.value
                  ? "bg-white/20"
                  : "bg-transparent"
            }`}
          >
            {subject ? (
              <span className="block truncate text-xs font-semibold sm:text-sm">{subject.name}</span>
            ) : (
              <span className="block text-xs text-slate-400/60 dark:text-slate-500/60">·</span>
            )}
            {slot?.note && (
              <span className="mt-0.5 block truncate text-[10px] opacity-70">{slot.note}</span>
            )}
          </button>
        );
      })}
    </>
  );
}

function SlotEditor({
  cell,
  slot,
  subjects,
  tasks,
  canEdit,
  onDone,
}: {
  cell: Cell;
  slot: TimetableSlot | undefined;
  subjects: Subject[];
  tasks: Task[];
  canEdit: boolean;
  onDone: () => void;
}) {
  const [subjectId, setSubjectId] = useState(slot?.subject_id ?? "");
  const [note, setNote] = useState(slot?.note ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const relatedTasks = tasks.filter((t) => !t.done && t.subject_id === (slot?.subject_id ?? null));

  async function save(clear = false) {
    setBusy(true);
    setError(null);
    try {
      await api("/api/timetable", {
        method: "PUT",
        body: {
          day: cell.day,
          period: cell.period,
          subject_id: clear ? null : subjectId || null,
          note: clear ? null : note,
        },
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장하지 못했습니다.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {canEdit ? (
        <>
          <div>
            <label className="label" htmlFor="slot-subject">
              과목
            </label>
            <select
              id="slot-subject"
              className="input"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="">— 비어 있음 —</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {subjects.length === 0 && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                먼저{" "}
                <Link href="/subjects" className="underline">
                  과목
                </Link>
                을 추가해주세요.
              </p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="slot-note">
              메모 (선택)
            </label>
            <input
              id="slot-note"
              className="input"
              placeholder="예) 3반 교실 / 이동 수업"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={40}
            />
          </div>

          {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-primary flex-1"
              onClick={() => save()}
              disabled={busy}
            >
              {busy ? "저장 중…" : "저장"}
            </button>
            {slot && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => save(true)}
                disabled={busy}
              >
                비우기
              </button>
            )}
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {slot?.subject_id
            ? subjects.find((s) => s.id === slot.subject_id)?.name
            : "아직 과목이 정해지지 않은 시간이에요."}
          {slot?.note ? ` · ${slot.note}` : ""}
        </p>
      )}

      {slot?.subject_id && (
        <div className="mt-1 border-t border-white/30 pt-4 dark:border-white/10">
          <h3 className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            이 과목의 남은 할 일
          </h3>
          {relatedTasks.length === 0 ? (
            <p className="text-sm text-slate-400">없어요 🎉</p>
          ) : (
            <ul className="space-y-1.5">
              {relatedTasks.slice(0, 5).map((task) => (
                <li key={task.id} className="text-sm">
                  <span className="mr-1">{taskTypeEmoji(task.type)}</span>
                  {task.title}
                  {task.due_date && (
                    <span className="ml-1.5 text-xs text-slate-400">
                      {formatDate(task.due_date)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/tasks"
            className="mt-3 inline-block text-xs text-indigo-600 underline dark:text-indigo-400"
          >
            할 일 전체 보기 →
          </Link>
        </div>
      )}
    </div>
  );
}
