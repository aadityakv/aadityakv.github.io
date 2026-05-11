"use client";

import { motion } from "framer-motion";

export default function Avatar({ size = 192 }: { size?: number }) {
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ rotate: [-1, 1, -1, 0], transition: { duration: 0.5 } }}
      className="relative inline-block"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-3xl bg-accent/30 blur-2xl"
      />
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60 p-3 shadow-glow"
        style={{ width: size, height: size }}
      >
        <img
          src="/avatar.svg"
          alt="8-bit pixel-art avatar of Aaditya"
          width={size - 24}
          height={size - 24}
          className="pixel h-full w-full select-none"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
