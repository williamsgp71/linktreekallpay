import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "rgb(var(--color-bg) / <alpha-value>)",
        darkCard: "rgb(var(--color-card) / <alpha-value>)",
        emeraldAccent: "rgb(var(--color-accent) / <alpha-value>)",
        neonAccent: "rgb(var(--color-accent) / <alpha-value>)",
        brand: {
          accent: "rgb(var(--color-accent) / <alpha-value>)",
          text: "rgb(var(--color-text) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
export default config;

