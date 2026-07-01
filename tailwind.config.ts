import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "green-kiwi": "#7DC832",
        "green-bright": "#A3E635",
        "green-dim": "#5A9424",
        "green-muted": "#1A2E0A",
        "green-subtle": "#0F1A07",
        "bg-primary": "#0A0A0A",
        "bg-card": "#111111",
        "bg-elevated": "#1A1A1A",
        "bg-hover": "#222222",
        "border-subtle": "#1E1E1E",
        "border-hover": "#2E2E2E",
        "text-primary": "#F0F0F0",
        "text-secondary": "#AAAAAA",
        "text-muted": "#555555",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease forwards",
        "slide-in": "slideIn 0.3s ease forwards",
        "pulse-green": "pulseGreen 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGreen: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(125, 200, 50, 0.3)" },
          "50%": { boxShadow: "0 0 0 6px rgba(125, 200, 50, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
