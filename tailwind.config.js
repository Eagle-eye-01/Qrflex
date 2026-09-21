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
          900: '#08090d',
          850: '#0d0f15',
          800: '#131620',
          700: '#1d2230',
          600: '#2a3144',
        }
      },
      animation: {
        'marquee': 'marquee 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'scan': 'scan 3s ease-in-out infinite',
        'laser-sweep': 'laserSweep 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate',
        'sound-bar-1': 'soundBar 0.8s ease-in-out infinite alternate',
        'sound-bar-2': 'soundBar 1.1s ease-in-out 0.2s infinite alternate',
        'sound-bar-3': 'soundBar 0.9s ease-in-out 0.4s infinite alternate',
        'orb-1': 'orbFloat1 18s ease-in-out infinite alternate',
        'orb-2': 'orbFloat2 22s ease-in-out infinite alternate',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(-120px)', opacity: '0.2' },
          '50%': { transform: 'translateY(120px)', opacity: '1' },
        },
        laserSweep: {
          '0%': { transform: 'translateY(0%)', opacity: '0.7' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0.7' },
        },
        soundBar: {
          '0%': { height: '3px' },
          '100%': { height: '14px' },
        },
        orbFloat1: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(60px, 40px) scale(1.15)' },
          '100%': { transform: 'translate(-30px, 80px) scale(0.95)' },
        },
        orbFloat2: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(-80px, -50px) scale(1.2)' },
          '100%': { transform: 'translate(40px, -30px) scale(0.9)' },
        },
      }
    },
  },
  plugins: [],
}
