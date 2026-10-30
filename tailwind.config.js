/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        entreo: {
          // Primary — Tomato Red
          red: '#E8372A',
          'red-hover': '#D02E22',
          'red-light': '#FFF1F0',
          // Backgrounds — pure white palette
          cream: '#FFFFFF',
          surface: '#FFFFFF',
          // Text
          ink: '#141414',
          muted: '#6B6B6B',
          // Borders & chips — very light neutral grey
          border: '#E8E8E8',
          'border-dark': '#D0D0D0',
          chip: '#F5F5F5',
          'chip-hover': '#EBEBEB',
        }
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        script: ['"Covered By Your Grace"', 'cursive'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.028em',
        tight: '-0.018em',
        snug: '-0.01em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.065em',
        widest: '0.12em',
        caps: '0.18em',
      },
      lineHeight: {
        'heading-tight': '1.08',
        'heading': '1.18',
        'body-snug': '1.45',
        'body': '1.62',
        'body-relaxed': '1.72',
      },
      boxShadow: {
        'soft-card': '0 8px 30px rgba(0, 0, 0, 0.07)',
        'search-pill': '0 12px 35px rgba(0, 0, 0, 0.10)',
        'polaroid': '0 16px 36px rgba(0, 0, 0, 0.16)',
        'float': '0 10px 25px -5px rgba(232, 55, 42, 0.28)',
      },
      borderRadius: {
        'pill': '9999px',
        'card': '16px',
        'badge': '10px',
      }
    },
  },
  plugins: [],
}

