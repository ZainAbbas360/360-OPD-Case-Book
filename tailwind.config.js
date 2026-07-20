/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#1a1a2e', soft: '#2d2d44', muted: '#5a5a6e' },
        paper: { DEFAULT: '#FBF8F2', dim: '#F3EEE3', card: '#FFFFFF' },
        line: '#E8E2D4',
        med: {
          DEFAULT: '#0E7C86', 50: '#EAF7F7', 100: '#D2EFEF', 200: '#A6DFE0',
          300: '#6FC9CB', 400: '#3FAAB0', 500: '#1A8C92', 600: '#0E7C86',
          700: '#0B5D63', 800: '#0A4A4E', 900: '#083A3D', tint: '#DCF3F2',
        },
        surg: {
          DEFAULT: '#C1121F', 50: '#FCEDED', 100: '#F9D9DA', 200: '#F2B0B2',
          300: '#E98083', 400: '#DC5256', 500: '#C1121F', 600: '#9B0E19',
          700: '#7A0B14', 800: '#5E0810', 900: '#420509', tint: '#FBE2E1',
        },
        peds: {
          DEFAULT: '#E68A00', 50: '#FEF5E6', 100: '#FDE9C6', 200: '#FBD291',
          300: '#F8B855', 400: '#F0A02B', 500: '#E68A00', 600: '#BD7000',
          700: '#965600', 800: '#704000', 900: '#4D2B00', tint: '#FCEBD0',
        },
        gynae: {
          DEFAULT: '#8E2A82', 50: '#F8EBF6', 100: '#F0D2EC', 200: '#E1A5D9',
          300: '#D074C6', 400: '#B84AAE', 500: '#8E2A82', 600: '#7A246E',
          700: '#601C58', 800: '#481542', 900: '#330E30', tint: '#F3DFF1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(26, 26, 46, 0.08)',
        card: '0 4px 24px -6px rgba(26, 26, 46, 0.12)',
        glow: '0 8px 40px -8px rgba(14, 124, 134, 0.25)',
      },
      backgroundImage: {
        'hero-mesh': 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12) 0, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0, transparent 40%)',
      },
    },
  },
  plugins: [],
};
