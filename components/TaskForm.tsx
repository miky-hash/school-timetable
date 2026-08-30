"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/client";
import { TASK_TYPES } from "@/lib/constants";
import type { Subject, Task } from "@/lib/types";

const NAME_KEY = "stt_name";

export default function TaskForm({
  subjects,
  task,
  onDone,
}: {
  subjects: Subject[];
  task?: Task;
  onDone: () => void;
}) {
  const [type, setType] = useState<string>(task?.type ?? "homework");
  const [subjectId, setSubjectId] = useState(task?.subject_id ?? "");
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [dueDate, setDueDate] = useState(task?.due_date ?? "");
  const [name, setName] = useState(task?.created_by ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 새로 만들 때는 마지막에 쓴 이름을 기억해둡니다.
  useEffect(() => {
    if (task) return;
    const saved = window.localStorage.getItem(NAME_KEY);
    if (saved) setName(saved);
  }, [task]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const body = {
        type,
        subject_id: subjectId || null,
        title,
        description,
        due_date: dueDate || null,
        created_by: name,
      };
      if (task) {
        await api(`/api/tasks/${task.id}`, { method: "PATCH", body });
      } else {
        await api("/api/tasks", { method: "POST", body });
        if (name.trim()) window.localStorage.setItem(NAME_KEY, name.trim());
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
        <span className="label">종류</span>
        <div className="flex gap-1.5">
          {TASK_TYPES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value)}
              className={`btn btn-sm flex-1 ${
                type === option.value ? "btn-primary" : "btn-soft"
              }`}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="task-title">
          내용
        </label>
        <input
          id="task-title"
          className="input"
          placeholder="예) 수학 익힘책 32~35쪽"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
          maxLength={120}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="task-subject">
            과목
          </label>
          <select
            id="task-subject"
            className="input"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">— 없음 —</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="task-due">
            마감일
          </label>
          <input
            id="task-due"
            type="date"
            className="input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="task-desc">
          자세한 설명 (선택)
        </label>
        <textarea
          id="task-desc"
          className="input min-h-20 resize-y"
          placeholder="준비물, 조건, 분량 같은 걸 적어두면 좋아요."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
      </div>

      <div>
        <label className="label" htmlFor="task-name">
          적은 사람 (선택)
        </label>
        <input
          id="task-name"
          className="input"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
        />
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      <button type="submit" className="btn btn-primary w-full" disabled={busy || !title.trim()}>
        {busy ? "저장 중…" : task ? "수정하기" : "추가하기"}
      </button>
    </form>
  );
}
