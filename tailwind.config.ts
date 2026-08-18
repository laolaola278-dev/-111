import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FAF4E6",
          deep: "#F2E7D2",
          dark: "#E7D9BE",
        },
        cinnabar: {
          DEFAULT: "#C03A2B",
          deep: "#96281B",
          light: "#DD5A43",
          soft: "#F5D8CF",
        },
        ink: {
          DEFAULT: "#221A15",
          soft: "#4A3D34",
          faint: "#8A7A6C",
        },
        gold: {
          DEFAULT: "#C89B3C",
          light: "#E4C574",
          deep: "#A67A24",
        },
        jade: {
          DEFAULT: "#2E6E5E",
          light: "#4E8F7E",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', "STSong", "SimSun", "serif"],
        sans: ['"Noto Sans SC"', "system-ui", "-apple-system", "PingFang SC", "sans-serif"],
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(circle at 20% 20%, rgba(192,58,43,0.05) 0, transparent 45%), radial-gradient(circle at 80% 10%, rgba(200,155,60,0.07) 0, transparent 40%)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(1.5deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "float-slow": "float-slow 7s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
