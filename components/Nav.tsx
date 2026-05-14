"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "About" },
  { href: "/portfolio", label: "Work" },
  { href: "/blog", label: "Writing" },
  { href: "/resume", label: "Resume" },
  { href: "/pacman", label: "Play" },
];

export default function Nav() {
  const pathname = usePathname() || "/";
  const normalize = (p: string) => (p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p);
  const active = normalize(pathname);

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 pt-6">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim hover:text-ink"
        >
          aaditya.kv
        </Link>
        <ul className="flex items-center gap-5 text-sm">
          {links.map((link) => {
            const isActive = active === normalize(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group relative inline-block py-1 transition-colors ${
                    isActive ? "text-ink" : "text-ink-dim hover:text-ink"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
