/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--bg)',
          soft: 'var(--bg-soft)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
          hover: 'var(--bg-hover)',
          inset: 'var(--bg-inset)',
        },
        border: {
          DEFAULT: 'var(--border)',
          soft: 'var(--border-soft)',
          strong: 'var(--border-strong)',
          faint: 'var(--border-faint)',
        },
        fg: {
          DEFAULT: 'var(--fg)',
          muted: 'var(--fg-muted)',
          subtle: 'var(--fg-subtle)',
          faint: 'var(--fg-faint)',
        },
        brand: {
          50: '#eefaf8',
          100: '#d8f2ee',
          200: '#b2e5de',
          300: '#7acfc4',
          400: '#4bb8aa',
          500: '#2a9d8f',
          600: '#238579',
          700: '#1d6d63',
          800: '#18564f',
          900: '#123f3b',
          950: '#0b2926',
        },
        accent: {
          300: '#f5dda0',
          400: '#efd184',
          500: '#e9c46a',
          600: '#d5aa45',
        },
        success: {
          400: '#65c5b8',
          500: '#2a9d8f',
          600: '#238579',
        },
        warning: {
          400: '#f5dda0',
          500: '#e9c46a',
          600: '#d5aa45',
        },
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        info: {
          400: '#7696a9',
          500: '#1e3a5f',
          600: '#17304f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        glow: 'var(--shadow-glow)',
        'glow-sm': 'var(--shadow-glow-sm)',
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        pop: 'var(--shadow-pop)',
        'pop-sm': 'var(--shadow-pop-sm)',
        inset: 'var(--shadow-inset)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pulse-soft': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.18s ease-out',
        'slide-down': 'slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
