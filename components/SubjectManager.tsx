"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/lib/client";
import { SUBJECT_COLOR_KEYS, SUBJECT_COLORS, colorOf } from "@/lib/constants";
import type { Subject } from "@/lib/types";
import Modal from "./Modal";

export default function SubjectManager({
  subjects,
  canEdit,
}: {
  subjects: Subject[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);

  async function remove(subject: Subject) {
    if (
      !confirm(
        `"${subject.name}" 과목을 지울까요?\n시간표에서도 사라지고, 이 과목으로 적어둔 할 일은 과목 없음으로 바뀌어요.`,
      )
    ) {
      return;
    }
    try {
      await api(`/api/subjects/${subject.id}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "지우지 못했습니다.");
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          과목 <span className="font-semibold text-slate-900 dark:text-slate-100">{subjects.length}</span>개
        </p>
        {canEdit && (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>
            + 과목 추가
          </button>
        )}
      </div>

      {subjects.length === 0 ? (
        <div className="card p-10 text-center text-sm text-slate-400">
          아직 과목이 없어요. {canEdit ? "먼저 과목을 만들어주세요." : ""}
        </div>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {subjects.map((subject) => (
            <li key={subject.id} className="card flex items-center gap-3 p-3">
              <span className={`size-3 shrink-0 rounded-full ${colorOf(subject.color).dot}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{subject.name}</p>
                {subject.teacher && (
                  <p className="truncate text-xs text-slate-400">{subject.teacher}</p>
                )}
              </div>
              {canEdit && (
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditing(subject)}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => remove(subject)}
                  >
                    삭제
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {!canEdit && (
        <p className="text-center text-xs text-slate-400">
          과목을 고치려면 위에서 <strong>🔒 편집하기</strong> 를 눌러 잠금을 풀어주세요.
        </p>
      )}

      <Modal open={adding} title="과목 추가" onClose={() => setAdding(false)}>
        <SubjectForm
          onDone={() => {
            setAdding(false);
            router.refresh();
          }}
        />
      </Modal>

      <Modal open={editing !== null} title="과목 수정" onClose={() => setEditing(null)}>
        {editing && (
          <SubjectForm
            key={editing.id}
            subject={editing}
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

function SubjectForm({ subject, onDone }: { subject?: Subject; onDone: () => void }) {
  const [name, setName] = useState(subject?.name ?? "");
  const [teacher, setTeacher] = useState(subject?.teacher ?? "");
  const [color, setColor] = useState(subject?.color ?? "slate");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const body = { name, teacher, color };
      if (subject) {
        await api(`/api/subjects/${subject.id}`, { method: "PATCH", body });
      } else {
        await api("/api/subjects", { method: "POST", body });
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장하지 못했습니다.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label" htmlFor="subject-name">
          과목 이름
        </label>
        <input
          id="subject-name"
          className="input"
          placeholder="예) 수학"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          maxLength={20}
        />
      </div>

      <div>
        <label className="label" htmlFor="subject-teacher">
          선생님 (선택)
        </label>
        <input
          id="subject-teacher"
          className="input"
          placeholder="예) 김OO 선생님"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          maxLength={20}
        />
      </div>

      <div>
        <span className="label">색깔</span>
        <div className="flex flex-wrap gap-2">
          {SUBJECT_COLOR_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setColor(key)}
              aria-label={SUBJECT_COLORS[key].label}
              className={`size-8 rounded-full ${SUBJECT_COLORS[key].dot} transition ${
                color === key
                  ? "ring-2 ring-slate-900 ring-offset-2 dark:ring-white dark:ring-offset-slate-900"
                  : "opacity-70 hover:opacity-100"
              }`}
            />
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      <button type="submit" className="btn btn-primary w-full" disabled={busy || !name.trim()}>
        {busy ? "저장 중…" : subject ? "수정하기" : "추가하기"}
      </button>
    </form>
  );
}
