/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lib-dark': '#0f0f14',
        'lib-secondary': '#1a1a24',
        'lib-card': '#16161e',
        'lib-border': '#2a2a35',
        'lib-primary': '#8b5cf6',
      },
    },
  },
  plugins: [],
}