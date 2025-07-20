import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "rotate-slow": "spin 20s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite alternate",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        "slide-in-up": "slide-in-up 0.6s ease-out",
        "slide-in-down": "slide-in-down 0.6s ease-out",
        "fade-in-scale": "fade-in-scale 0.5s ease-out",
        wiggle: "wiggle 1s ease-in-out infinite",
        "particle-drift": "particle-drift 10s linear infinite",
        "cinema-glow": "cinema-glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%": {
            boxShadow: "0 0 20px rgba(244, 110, 12, 0.3)",
            transform: "scale(1)",
          },
          "100%": {
            boxShadow: "0 0 30px rgba(244, 110, 12, 0.6)",
            transform: "scale(1.05)",
          },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "slide-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in-scale": {
          "0%": {
            opacity: "0",
            transform: "scale(0.8)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "particle-drift": {
          "0%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
          "33%": {
            transform: "translateX(30px) translateY(-20px) rotate(120deg)",
          },
          "66%": {
            transform: "translateX(-20px) translateY(-40px) rotate(240deg)",
          },
          "100%": { transform: "translateX(0) translateY(0) rotate(360deg)" },
        },
        "cinema-glow": {
          "0%": {
            boxShadow:
              "0 0 30px rgba(244, 110, 12, 0.4), inset 0 0 30px rgba(244, 110, 12, 0.1)",
          },
          "100%": {
            boxShadow:
              "0 0 60px rgba(244, 110, 12, 0.8), inset 0 0 60px rgba(244, 110, 12, 0.3)",
          },
        },
      },
      colors: {
        primary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // Orange-500
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        cinema: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444", // Red-500
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
      },
      gradientColorStops: {
        "cinema-start": "#f97316", // Orange-500
        "cinema-end": "#ef4444", // Red-500
        "premium-start": "#8b5cf6", // Violet-500
        "premium-end": "#ec4899", // Pink-500
      },
      boxShadow: {
        glow: "0 0 20px rgba(244, 110, 12, 0.3)",
        "glow-lg": "0 0 40px rgba(244, 110, 12, 0.4)",
        premium:
          "0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        "3d": "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        cinema:
          "0 0 30px rgba(244, 110, 12, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
      },
      perspective: {
        "1000": "1000px",
        "1500": "1500px",
        "2000": "2000px",
      },
      transform: {
        "preserve-3d": "preserve-3d",
      },
      transformStyle: {
        "preserve-3d": "preserve-3d",
      },
    },
  },
  plugins: [
    function ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
    }) {
      addUtilities({
        ".text-gradient-premium": {
          background: "linear-gradient(135deg, #f97316, #ef4444)",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-clip": "text",
        },
        ".text-gradient-cinema": {
          background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-clip": "text",
        },
        ".bg-gradient-cinema": {
          background: "linear-gradient(135deg, #f97316, #ef4444)",
        },
        ".bg-gradient-premium": {
          background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
        },
        ".btn-cinema": {
          background: "linear-gradient(135deg, #f97316, #ef4444)",
          color: "white",
          padding: "12px 24px",
          "border-radius": "12px",
          "font-weight": "600",
          "box-shadow": "0 10px 20px rgba(244, 110, 12, 0.3)",
          transition: "all 0.3s ease",
          border: "none",
          cursor: "pointer",
        },
        ".btn-cinema:hover": {
          transform: "translateY(-2px)",
          "box-shadow": "0 15px 30px rgba(244, 110, 12, 0.4)",
        },
        ".btn-cinema-outline": {
          background: "transparent",
          color: "#f97316",
          padding: "12px 24px",
          "border-radius": "12px",
          "font-weight": "600",
          border: "2px solid #f97316",
          transition: "all 0.3s ease",
          cursor: "pointer",
        },
        ".btn-cinema-outline:hover": {
          background: "linear-gradient(135deg, #f97316, #ef4444)",
          color: "white",
          transform: "translateY(-2px)",
          "box-shadow": "0 10px 20px rgba(244, 110, 12, 0.3)",
        },
        ".card-premium": {
          background: "rgba(255, 255, 255, 0.1)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          "border-radius": "16px",
          "box-shadow": "0 10px 40px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        },
        ".card-premium:hover": {
          transform: "translateY(-5px)",
          "box-shadow": "0 20px 60px rgba(0, 0, 0, 0.15)",
        },
        ".card-cinema": {
          background: "rgba(249, 115, 22, 0.1)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(249, 115, 22, 0.2)",
          "border-radius": "16px",
          "box-shadow": "0 10px 40px rgba(249, 115, 22, 0.1)",
          transition: "all 0.3s ease",
        },
        ".card-cinema:hover": {
          transform: "translateY(-5px)",
          "box-shadow": "0 20px 60px rgba(249, 115, 22, 0.2)",
          "border-color": "rgba(249, 115, 22, 0.4)",
        },
        ".shadow-glow": {
          "box-shadow": "0 0 20px rgba(244, 110, 12, 0.3)",
        },
        ".shadow-glow-lg": {
          "box-shadow": "0 0 40px rgba(244, 110, 12, 0.4)",
        },
        ".shadow-premium": {
          "box-shadow":
            "0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        },
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".preserve-3d": {
          "transform-style": "preserve-3d",
        },
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
        ".rotateY-180": {
          transform: "rotateY(180deg)",
        },
      });
    },
  ],
};

export default config;
