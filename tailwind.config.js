/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        volt: {
          DEFAULT: '#e4ff1a',
          light: '#f1ff66',
          dark: '#b8d600',
        },
        matrix: {
          DEFAULT: '#00ff88',
          dark: '#00b35f',
        },
        cyber: {
          purple: '#a855f7',
          neon: '#c084fc',
        },
        obsidian: {
          900: '#090a0f',
          800: '#0f1118',
          700: '#171a24',
          600: '#222736',
        }
      },
      animation: {
        'marquee': 'marquee 22s linear infinite',
        'marquee-slow': 'marquee 35s linear infinite',
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'laser-sweep': 'laserSweep 2.4s ease-in-out infinite alternate',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        laserSweep: {
          '0%': { transform: 'translateY(0%)', opacity: '0.9' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
}
