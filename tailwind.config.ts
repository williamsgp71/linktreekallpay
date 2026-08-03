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
        darkBg: "var(--color-bg)",
        darkCard: "var(--color-card)",
        emeraldAccent: "var(--color-accent)",
        neonAccent: "var(--color-accent)",
        brand: {
          accent: "var(--color-accent)",
          text: "var(--color-text)",
        },
      },
    },
  },
  plugins: [],
};
export default config;

