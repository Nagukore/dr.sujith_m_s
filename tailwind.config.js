/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep, refined teal — the clinical anchor
        primary: {
          50: '#f0fdf9',
          100: '#cbfaec',
          200: '#97f2d9',
          300: '#5ce3c2',
          400: '#2bc9a6',
          500: '#13ad8c',
          600: '#0a8b72',
          700: '#0c6e5c',
          800: '#0e574a',
          900: '#0f483f',
          950: '#062a26',
        },
        // Champagne gold — the premium accent, used sparingly
        accent: {
          50: '#fbf8f1',
          100: '#f5edd8',
          200: '#ead8ab',
          300: '#debd77',
          400: '#d3a653',
          500: '#c08f3c',
          600: '#a37130',
          700: '#83552a',
          800: '#6d4527',
          900: '#5d3b24',
        },
        // Warm ink neutrals for a more crafted, less sterile feel
        ink: {
          50: '#f7f7f5',
          100: '#eeede9',
          200: '#dcdbd3',
          300: '#c2c0b4',
          400: '#a09d8d',
          500: '#827f6f',
          600: '#67645a',
          700: '#54514a',
          800: '#403e39',
          900: '#2a2925',
          950: '#1a1916',
        },
      },
      fontFamily: {
        heading: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(8,40,36,0.06)',
        'glass-lg': '0 24px 60px -16px rgba(8,40,36,0.12)',
        soft: '0 2px 8px rgba(8,40,36,0.04), 0 12px 32px -12px rgba(8,40,36,0.10)',
        lift: '0 32px 64px -24px rgba(8,40,36,0.22)',
        glow: '0 0 50px rgba(19,173,140,0.20)',
        'glow-sm': '0 0 24px rgba(19,173,140,0.14)',
        'glow-gold': '0 0 40px rgba(211,166,83,0.22)',
      },
      animation: {
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
