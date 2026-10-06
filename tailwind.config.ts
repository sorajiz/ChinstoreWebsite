import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#08090E", // Nền Obsidian sâu thẳm, không đen kịt
        foreground: "#f8fafc",
        surface: {
          50: "rgba(255, 255, 255, 0.02)",
          100: "rgba(255, 255, 255, 0.05)",
          200: "rgba(255, 255, 255, 0.08)",
        },
        brand: {
          primary: "#6366F1",   // Electric Indigo (Màu chủ đạo Webflow/Linear)
          secondary: "#8B5CF6", // Soft Violet
          accent: "#06B6D4",    // Soft Cyan (chỉ dùng điểm xuyết, không lạm dụng)
          emerald: "#10B981",   // Status Online/Success
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.08)",
          glow: "rgba(99, 102, 241, 0.3)",
        },
        card: {
          DEFAULT: "rgba(12, 14, 23, 0.8)",
          border: "rgba(255, 255, 255, 0.06)",
        },
        cyber: {
          dark: "#08090E",
          darker: "#05060A",
          surface: "#0c0e17",
          card: "rgba(12, 14, 23, 0.75)",
          neonCyan: "#06b6d4",
          neonPurple: "#8b5cf6",
          neonPink: "#ec4899",
          neonEmerald: "#10b981",
          gold: "#eab308",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        display: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 5s ease-in-out infinite",
        "glow-border": "borderGlow 4s linear infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "spin-slow": "spin 20s linear infinite",
        "marquee": "marquee 25s linear infinite",
        "marquee-fast": "marquee 18s linear infinite",
        "radar-sweep": "radarSweep 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(99, 102, 241, 0.3)", boxShadow: "0 0 15px rgba(99, 102, 241, 0.2)" },
          "50%": { borderColor: "rgba(139, 92, 246, 0.4)", boxShadow: "0 0 25px rgba(139, 92, 246, 0.3)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
