import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#16294B",
          navy: "#16294B",
          navyDark: "#132542",
          navyDeep: "#132542",
          navyLight: "#294368",
          red: "#9A3722",
          redDark: "#762817",
          redLight: "#F4E2DC",
          cyan: "#2A8C8C",
          sky: "#2A8C8C",
          ice: "#F5F3EE",
          sand: "#EFEDE6",
          ivory: "#F5F3EE",
          warm: "#EFEDE6",
          gold: "#E7C67C",
          teal: "#2A8C8C",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-libre-franklin)",
          "'Libre Franklin'",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        serif: [
          "var(--font-cormorant)",
          "'Cormorant Garamond'",
          "Georgia",
          "'Times New Roman'",
          "serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px -2px rgba(14, 77, 130, 0.08)",
        "card-hover": "0 8px 30px -4px rgba(14, 77, 130, 0.18), 0 2px 8px -2px rgba(0,0,0,0.06)",
        "card-featured": "0 12px 40px -8px rgba(14, 77, 130, 0.22), 0 4px 12px -4px rgba(0,0,0,0.07)",
        elevate: "0 10px 30px -5px rgba(14, 77, 130, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.06)",
        "elevate-red": "0 10px 30px -5px rgba(229, 25, 36, 0.22), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        glow: "0 0 30px rgba(0, 196, 255, 0.4)",
        "glow-red": "0 0 30px rgba(229, 25, 36, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
