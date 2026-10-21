import type { Config } from 'tailwindcss';

const cssVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic, theme-aware tokens (driven by CSS variables).
        app: cssVar('--color-app'),
        surface: cssVar('--color-surface'),
        raised: cssVar('--color-raised'),
        fg: cssVar('--color-fg'),
        'fg-muted': cssVar('--color-fg-muted'),
        'fg-subtle': cssVar('--color-fg-subtle'),
        line: cssVar('--color-line'),

        // Brand accent — Go gopher cyan.
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

        // Neutral ink scale for chrome that must not shift with the theme.
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
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        prose: '72ch',
      },
    },
  },
  plugins: [],
};

export default config;
