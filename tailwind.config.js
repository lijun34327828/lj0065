/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        wine: {
          50: "#FBF2F3",
          100: "#F7E6E7",
          200: "#E8C5C9",
          300: "#D9A3A9",
          400: "#BC6873",
          500: "#9E3E4D",
          600: "#722F37",
          700: "#5A252C",
          800: "#431C21",
          900: "#2D1216",
        },
        gold: {
          50: "#FEFDF6",
          100: "#FDF8E0",
          200: "#FAEEBE",
          300: "#F5E39D",
          400: "#E8CC5A",
          500: "#D4AF37",
          600: "#B8922E",
          700: "#936E25",
          800: "#6E501C",
          900: "#4A3413",
        },
        ivory: {
          50: "#FFFFFE",
          100: "#FFFFF0",
          200: "#FFFFE1",
          300: "#FFFCE0",
          400: "#FFF0B8",
          500: "#FFE38F",
        },
        ink: {
          50: "#F5F5F5",
          100: "#E6E6E6",
          200: "#CCCCCC",
          300: "#A6A6A6",
          400: "#666666",
          500: "#333333",
          600: "#1A1A1A",
          700: "#0D0D0D",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Lato'", "sans-serif"],
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(212, 175, 55, 0.3)",
        card: "0 8px 32px -8px rgba(114, 47, 55, 0.15)",
        "card-hover": "0 12px 40px -8px rgba(114, 47, 55, 0.25)",
      },
      animation: {
        "shimmer": "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(212, 175, 55, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
