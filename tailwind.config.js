/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#0a0c14',
          900: '#10131f',
          850: '#151927',
          800: '#1b2030',
          700: '#272d40',
          600: '#3a4256',
          500: '#5b6479',
        },
        coral: {
          50: '#fff1f1',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        ember: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        mint: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
      },
      boxShadow: {
        glow: '0 0 40px -12px rgba(244, 63, 94, 0.45)',
        card: '0 10px 40px -12px rgba(0,0,0,0.55)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'bar-grow': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--w)' },
        },
        'sheen': {
          '0%': { transform: 'translateX(-120%)' },
          '60%,100%': { transform: 'translateX(220%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'pop-in': 'pop-in 0.25s ease-out both',
        'bar-grow': 'bar-grow 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'sheen': 'sheen 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
