import type { Metadata, Viewport } from "next";
import Link from "next/link";

import EditLockButton from "@/components/EditLockButton";
import NavLinks from "@/components/NavLinks";
import { hasEditAccess } from "@/lib/auth";

import "./globals.css";

export const metadata: Metadata = {
  title: "우리 반 시간표",
  description: "우리 반 시간표와 숙제·수행평가·할 일을 한곳에서 봅니다.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const canEdit = await hasEditAccess();

  return (
    <html lang="ko">
      <body>
        <div className="mx-auto flex min-h-dvh max-w-4xl flex-col px-4 pb-16">
          <header className="flex flex-wrap items-center justify-between gap-3 py-5">
            <Link href="/" className="text-lg font-bold tracking-tight">
              🗓️ 우리 반 시간표
            </Link>
            <div className="flex items-center gap-2">
              <NavLinks />
              <EditLockButton unlocked={canEdit} />
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="pt-10 text-center text-xs text-slate-400 dark:text-slate-600">
            링크를 아는 친구는 누구나 볼 수 있고, 고치려면 비밀번호가 필요해요.
          </footer>
        </div>
      </body>
    </html>
  );
}
