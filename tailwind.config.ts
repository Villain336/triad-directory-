import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#dc2626",
          600: "#b91c1c",
          700: "#991b1b",
          800: "#7f1d1d",
          900: "#611414",
        },
        accent: {
          50: "#fefdf6",
          100: "#fdf8e8",
          200: "#faf0cc",
          300: "#f5e3a3",
          400: "#edd57a",
          500: "#d4b94e",
          600: "#b89b38",
          700: "#96792c",
          800: "#7a6225",
          900: "#5e4b1e",
        },
        beige: {
          50: "#fdfcfa",
          100: "#faf7f2",
          200: "#f5efe4",
          300: "#ede4d3",
          400: "#dfd2b8",
          500: "#c9b896",
          600: "#ad9a74",
          700: "#8f7d5a",
          800: "#736548",
          900: "#5a4f3a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
