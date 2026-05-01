/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonGreen: "#39ff14",
        neonRed: "#ff073a",
        darkBg: "#111827",
        panelBg: "#1f2937",
      },
    },
  },
  plugins: [],
}
