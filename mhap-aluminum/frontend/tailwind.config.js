/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens — see README "Design system" section.
        navy: {
          DEFAULT: '#0B1F3A',
          deep: '#071527',
          light: '#15315A',
        },
        steel: {
          DEFAULT: '#8B9299',
          light: '#C8CDD3',
          dark: '#5B6268',
        },
        accent: {
          DEFAULT: '#2D6CDF',
          light: '#5C8CE8',
          dark: '#1E4FAD',
        },
        ink: '#0A0E14',
        paper: '#F7F8FA',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'extrusion-grid':
          'linear-gradient(rgba(139,146,153,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,146,153,0.08) 1px, transparent 1px)',
      },
      boxShadow: {
        panel: '0 20px 60px -20px rgba(11,31,58,0.35)',
      },
    },
  },
  plugins: [],
};
