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
        darkBg: "#0B0F17",
        darkCard: "#161E2E",
        emeraldAccent: "#10B981",
        neonAccent: "#34D399",
        brand: {
          bg: "#0B0F17",
          card: "#161E2E",
          emerald: "#10B981",
          neon: "#34D399",
        },
      },
    },
  },
  plugins: [],
};
export default config;

