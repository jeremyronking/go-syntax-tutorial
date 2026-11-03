import type { Config } from 'tailwindcss';

const token = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: token('--color-app'),
        elevated: token('--color-elevated'),
        card: token('--color-card'),
        fg: token('--color-fg'),
        muted: token('--color-muted'),
        subtle: token('--color-subtle'),
        divider: token('--color-divider'),
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
