import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Core game palette — swap these to re-skin the whole game
        game: {
          bg: "var(--game-bg)",
          surface: "var(--game-surface)",
          primary: "var(--game-primary)",
          secondary: "var(--game-secondary)",
          accent: "var(--game-accent)",
          danger: "var(--game-danger)",
          success: "var(--game-success)",
          text: "var(--game-text)",
          "text-dim": "var(--game-text-dim)",
          border: "var(--game-border)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shake: "shake 0.5s ease-in-out",
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px var(--game-primary), 0 0 10px transparent" },
          "100%": { boxShadow: "0 0 10px var(--game-primary), 0 0 20px var(--game-primary)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      boxShadow: {
        game: "0 0 0 1px var(--game-border), 0 4px 12px rgba(0,0,0,0.3)",
        "game-lg": "0 0 0 1px var(--game-border), 0 8px 24px rgba(0,0,0,0.4)",
        "game-glow": "0 0 15px var(--game-primary)",
      },
    },
  },
  plugins: [],
};

export default config;
