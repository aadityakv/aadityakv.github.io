"use client";

import { motion } from "framer-motion";

export default function Avatar({ size = 160 }: { size?: number }) {
  return (
    <motion.div
      initial={{ y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative inline-block"
    >
      {/* corner marks (architectural framing, not uniform rounding) */}
      <span aria-hidden className="absolute -left-1.5 -top-1.5 h-3 w-3 border-l border-t border-accent" />
      <span aria-hidden className="absolute -right-1.5 -top-1.5 h-3 w-3 border-r border-t border-accent" />
      <span aria-hidden className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border-b border-l border-accent" />
      <span aria-hidden className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border-b border-r border-accent" />
      <div
        className="relative overflow-hidden bg-card"
        style={{ width: size, height: size }}
      >
        <img
          src="/avatar.svg"
          alt="8-bit pixel-art avatar of Aaditya"
          width={size}
          height={size}
          className="pixel h-full w-full select-none"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
