"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/lib/client";
import Modal from "./Modal";

export default function EditLockButton({ unlocked }: { unlocked: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function lock() {
    setBusy(true);
    try {
      await api("/api/auth", { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/auth", { method: "POST", body: { password } });
      setOpen(false);
      setPassword("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "잠금을 풀지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  if (unlocked) {
    return (
      <button type="button" className="btn btn-soft btn-sm" onClick={lock} disabled={busy}>
        🔓 편집 중 · 잠그기
      </button>
    );
  }

  return (
    <>
      <button type="button" className="btn btn-soft btn-sm" onClick={() => setOpen(true)}>
        🔒 편집하기
      </button>

      <Modal open={open} title="편집 잠금 풀기" onClose={() => setOpen(false)}>
        <form onSubmit={unlock} className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            반 친구들과 공유하는 비밀번호를 입력하면 시간표와 할 일을 고칠 수 있어요.
          </p>
          <div>
            <label className="label" htmlFor="edit-password">
              비밀번호
            </label>
            <input
              id="edit-password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={busy || !password}>
            {busy ? "확인 중…" : "잠금 풀기"}
          </button>
        </form>
      </Modal>
    </>
  );
}
