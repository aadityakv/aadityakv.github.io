import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        ink: {
          50: "#f7f7f8",
          100: "#ededf0",
          200: "#d6d6dc",
          300: "#b1b1bb",
          400: "#84848f",
          500: "#5a5a64",
          600: "#41414a",
          700: "#2e2e35",
          800: "#1c1c21",
          900: "#0e0e12",
          950: "#06060a",
        },
        accent: {
          DEFAULT: "#7c5cff",
          glow: "#a48bff",
        },
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(124,92,255,0.45)",
      },
      animation: {
        "gradient-pan": "gradientPan 12s ease infinite",
      },
      keyframes: {
        gradientPan: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
