import type { Config } from "tailwindcss";

/*
 * GMAC Group design system: "Clean corporate advisory"
 *
 * Ink      #0B1A2C  primary text, dark sections
 * Blue     #0B5CAD  single accent (drawn from the logo globe)
 * Mist     #F4F6F9  alternate section background
 * Line     #E2E6EC  hairlines and borders
 *
 * Legacy token names (red, gold, cyan, ivory...) are kept and remapped so
 * every existing page picks up the new palette without a rewrite.
 */
const ink = "#0B1A2C";
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
          900: "#07111E",
          800: ink,
          700: "#1C2B3F",
          600: "#3A4859",
          500: "#5B6676",
          400: "#8A93A0",
          300: "#B8BEC8",
        },
        accent: {
          DEFAULT: blue,
          dark: "#084785",
          light: "#E8F0FA",
          soft: "#9CC3EC",
        },
        mist: "#F4F6F9",
        line: "#E2E6EC",
        brand: {
          DEFAULT: ink,
          navy: ink,
          navyDark: "#07111E",
          navyDeep: "#07111E",
          navyLight: "#1C2B3F",
          red: blue,
          redDark: "#084785",
          redLight: "#E8F0FA",
          cyan: blue,
          sky: blue,
          teal: blue,
          gold: "#9CC3EC",
          ice: "#FFFFFF",
          ivory: "#FFFFFF",
          sand: "#F4F6F9",
          warm: "#F4F6F9",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        // "serif" is kept as the heading family name so existing markup keeps working;
        // it now resolves to a tight grotesk for a crisp corporate voice.
        serif: ["var(--font-inter-tight)", "'Inter Tight'", "var(--font-inter)", "sans-serif"],
        display: ["var(--font-inter-tight)", "'Inter Tight'", "sans-serif"],
      },
      borderRadius: {
        // Squarer corners across the whole site
        lg: "4px",
        xl: "4px",
        "2xl": "6px",
        "3xl": "8px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,26,44,0.04)",
        "card-hover": "0 12px 32px -12px rgba(11,26,44,0.18)",
        "card-featured": "0 12px 32px -12px rgba(11,26,44,0.18)",
        elevate: "0 12px 32px -12px rgba(11,26,44,0.18)",
        "elevate-red": "none",
        glow: "none",
        "glow-red": "none",
      },
      maxWidth: {
        site: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
