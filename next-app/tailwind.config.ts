import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e6f2ff",
          100: "#cce5ff",
          200: "#99caff",
          300: "#66b0ff",
          400: "#3387ff",
          500: "#0056d2",
          600: "#0043a6",
          700: "#00347d",
          800: "#002453",
          900: "#00122a"
        }
      },
      backgroundImage: {
        "blue-gradient": "linear-gradient(135deg, #0ea5e9, #2563eb, #1d4ed8)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
