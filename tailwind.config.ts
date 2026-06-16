import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/store/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f5efe6",
        ink: "#1b1a17",
        accent: {
          DEFAULT: "#c75b39",
          soft: "#efd5cc",
          dark: "#8e3f26",
        },
        moss: "#5f6f52",
        midnight: "#111827",
        gold: "#d8a25e",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(17, 24, 39, 0.12)",
        soft: "0 10px 30px rgba(17, 24, 39, 0.08)",
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8), transparent 30%), radial-gradient(circle at 80% 10%, rgba(199,91,57,0.12), transparent 28%), radial-gradient(circle at 70% 80%, rgba(95,111,82,0.12), transparent 24%)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
