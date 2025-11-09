module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          50: "#f0f6ff",
          100: "#dbe9ff",
          200: "#b7d6ff",
          300: "#8bbdff",
          400: "#5fa4ff",
          500: "#2563eb",
        },
        dark: {
          DEFAULT: "#071029",
          100: "#0b1220",
          200: "#0f1724",
        },
        muted: "#94a3b8",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: ['@tailwindcss/typography'],
};
