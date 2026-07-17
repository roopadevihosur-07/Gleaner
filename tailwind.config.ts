import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'void-black': '#0e1012',
        'deep-charcoal': '#15171b',
        'gunmetal': '#1c1f24',
        'graphite': '#23262d',
        'steel': '#333943',
        'pewter': '#444d5a',
        'slate': '#566171',
        'ash': '#8b96aa',
        'fog': '#a0aaba',
        'silver': '#bbc2ce',
        'cloud': '#d5dae2',
        'signal-blue': '#007afc',
        'deep-signal': '#0062ca',
        'map-green': '#228a56',
      },
      fontFamily: {
        'cera-pro': ['Cera Pro', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'badge': '4px',
        'input': '6px',
        'chip': '12px',
        'card': '24px',
        'button': '100px',
      },
    },
  },
  plugins: [],
};

export default config;
