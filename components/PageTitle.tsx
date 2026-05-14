"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function PageTitle({
  eyebrow,
  title,
  emphasis,
  subtitle,
}: {
  eyebrow?: string;
  title: ReactNode;
  emphasis?: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="mb-14">
      {eyebrow && (
        <motion.p
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h1
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="text-[2.5rem] leading-[1.05] tracking-tighter2 text-ink sm:text-[3.25rem]"
      >
        <span className="font-sans">{title}</span>
        {emphasis && (
          <>
            {" "}
            <span className="font-serif italic text-accent-soft">{emphasis}</span>
          </>
        )}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 max-w-xl text-ink-dim"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
