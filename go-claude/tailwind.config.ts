import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gopher: {
          DEFAULT: '#00ADD8',
          50: '#e6f8fc',
          100: '#bfeaf6',
          200: '#99dcef',
          300: '#66c9e7',
          400: '#33b6df',
          500: '#00ADD8',
          600: '#008bad',
          700: '#006982',
          800: '#004656',
          900: '#00232b',
        },
        ink: {
          50: '#f8fafc',
          100: '#e6e9ee',
          200: '#c5cad3',
          300: '#9aa2af',
          400: '#6e7785',
          500: '#4a5160',
          600: '#33394a',
          700: '#1f2433',
          800: '#141826',
          900: '#0b0e18',
          950: '#070912',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      maxWidth: {
        prose: '72ch',
      },
    },
  },
  plugins: [],
};

export default config;
