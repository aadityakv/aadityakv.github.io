"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
];

export default function Nav() {
  const pathname = usePathname();
  const normalize = (p: string) => (p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p);
  const active = normalize(pathname || "/");

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto mt-4 max-w-3xl px-4">
        <nav className="glass flex items-center justify-between rounded-full px-4 py-2 sm:px-6">
          <Link href="/" className="font-mono text-sm tracking-tight text-ink-100 hover:text-white">
            <span className="text-accent-glow">~</span>/aaditya
          </Link>
          <ul className="flex items-center gap-1 text-sm">
            {links.map((link) => {
              const isActive = active === normalize(link.href);
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={`relative inline-block rounded-full px-3 py-1.5 transition-colors ${
                      isActive ? "text-white" : "text-ink-300 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/10"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
