import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        serif: [
          "var(--font-serif)",
          "Iowan Old Style",
          "Apple Garamond",
          "Baskerville",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Helvetica Neue",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        paper: "#0a0a0b",
        card: "#121214",
        ink: {
          DEFAULT: "#ece8df",
          dim: "#9a9690",
          faint: "#5a5853",
        },
        rule: "#23232a",
        accent: {
          DEFAULT: "#e89a4a",
          soft: "#f1bf85",
        },
      },
      letterSpacing: {
        tightish: "-0.012em",
        tighter2: "-0.025em",
      },
    },
  },
  plugins: [],
};

export default config;
