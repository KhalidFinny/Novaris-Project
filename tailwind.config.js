/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          primary: '#2563EB',
          accent: '#7C3AED',
          safe: '#059669',
          caution: '#D97706',
          risk: '#DC2626',
          bg: '#0D1117',
          surface: '#13161B',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    }
  },
  plugins: [],
}
