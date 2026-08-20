"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "시간표" },
  { href: "/tasks", label: "할 일" },
  { href: "/subjects", label: "과목" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="segmented">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`segmented-item ${active ? "segmented-item-active" : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
