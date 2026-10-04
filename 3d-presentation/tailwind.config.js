/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Geist',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          'system-ui',
          'sans-serif',
        ],
        serif: [
          '"Noto Serif TC"',
          'Newsreader',
          'Charter',
          '"Songti TC"',
          'Georgia',
          'serif',
        ],
      },
      colors: {
        paper: {
          DEFAULT: '#FBF8F6',
          light: '#FFFFFF',
          card: 'rgba(255, 255, 255, 0.88)',
          tint: '#F5F2ED',
        },
        ink: {
          DEFAULT: '#1C1917',
          deep: '#141210',
          body: '#292524',
          muted: '#78716C',
          light: '#A8A29E',
        },
        curatorial: {
          olive: '#5C6E21',
          terracotta: '#C2785C',
          brass: '#B45309',
          stone: '#57534E',
        }
      },
      boxShadow: {
        'plaque': '0 4px 24px -2px rgba(28, 25, 23, 0.04), 0 1px 2px rgba(28, 25, 23, 0.02)',
        'plaque-hover': '0 12px 32px -4px rgba(28, 25, 23, 0.07), 0 2px 6px rgba(28, 25, 23, 0.02)',
      }
    },
  },
  plugins: [],
}
