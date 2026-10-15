import type { Config } from "tailwindcss";

/*
 * GMAC Group design system: "The Evidence Ledger"
 *
 * Ink    #0E1A2B  text, dark sections
 * Paper  #FBFAF7  page background
 * Blue   #0B5CAD  the single working accent (from the logo globe)
 * Clay   #A84D27  data highlights only (a muted take on the logo red)
 * Stone  #F2F0EB  alternate section background
 * Rule   #E3DFD6  hairlines and borders
 *
 * Legacy token names (brand.red, brand.gold, brand.cyan, ...) are remapped so
 * older pages pick up the palette until they are rebuilt.
 */
const ink = "#0E1A2B";
const blue = "#0B5CAD";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: ink,
          900: "#08111D",
          800: ink,
          700: "#1F2C3E",
          600: "#3C4757",
          500: "#5A6372",
          400: "#5F6B7A", // 4.7:1 on stone, 5.2:1 on paper (WCAG AA)
          300: "#B9BDC4",
        },
        paper: "#FBFAF7",
        // Colour trial: taken from the logo (royal navy, teal blue, red) plus a warm sand.
        navy: { DEFAULT: "#13237A", dark: "#0D1858" },
        teal: { DEFAULT: "#0B6A92", light: "#E3EFF4" },
        signal: "#C8242B",
        sand: "#F5EEE2",
        stone: "#F2F0EB",
        rule: "#E3DFD6",
        accent: {
          DEFAULT: blue,
          dark: "#08467F",
          light: "#E7EFF8",
          soft: "#9CC0E6",
        },
        clay: {
          DEFAULT: "#C8242B", // colour trial: logo red, 4.9:1 on sand (WCAG AA)
          light: "#F5E6DE",
        },
        success: "#1F7A4D",
        warning: "#A86A06",
        danger: "#B42318",
        // v1 aliases
        mist: "#F2F0EB",
        line: "#E3DFD6",
        brand: {
          DEFAULT: ink,
          navy: ink,
          navyDark: "#08111D",
          navyDeep: "#08111D",
          navyLight: "#1F2C3E",
          red: blue,
          redDark: "#08467F",
          redLight: "#E7EFF8",
          cyan: blue,
          sky: blue,
          teal: blue,
          gold: "#9CC0E6",
          ice: "#FBFAF7",
          ivory: "#FBFAF7",
          sand: "#F2F0EB",
          warm: "#F2F0EB",
        },
      },
      fontFamily: {
        sans: ["var(--font-plex)", "'IBM Plex Sans'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        serif: ["var(--font-newsreader)", "Newsreader", "'Newsreader 16pt'", "Georgia", "serif"],
        display: ["var(--font-newsreader)", "Newsreader", "'Newsreader 16pt'", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "3px",
        xl: "3px",
        "2xl": "4px",
        "3xl": "6px",
      },
      boxShadow: {
        card: "none",
        "card-hover": "0 18px 40px -24px rgba(14,26,43,0.35)",
        "card-featured": "0 18px 40px -24px rgba(14,26,43,0.35)",
        elevate: "0 18px 40px -24px rgba(14,26,43,0.35)",
        "elevate-red": "none",
        glow: "none",
        "glow-red": "none",
      },
      maxWidth: {
        site: "1280px",
        prose: "68ch",
      },
      letterSpacing: {
        label: "0.14em",
      },
    },
  },
  plugins: [],
};

export default config;
