/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        n8n: {
          bg: '#0E0918',
          surface: '#1A1A2E',
          'surface-elevated': '#252540',
          'surface-accent': '#1A1725',
          border: '#2E2B4A',
          separator: '#3A3352',
          grid: '#1F1D38',
          zebra: '#151228',
          text: '#F1F0F5',
          'text-secondary': '#9490AD',
          'text-body': '#C8C5D6',
          'text-faint': '#706E8A',
          pink: '#EA4B71',
          flame: '#EE4F27',
          'flame-light': '#FF9B26',
          purple: '#7C3AED',
          dark: '#040506',
          green: '#16A34A',
          red: '#DC2626',
        },
        chart: {
          slate: '#94A3B8',
          blue: '#3B82F6',
          pink: '#EA4B71',
          purple: '#7C3AED',
          coral: '#FF6D5A',
          amber: '#F59E0B',
          grey: '#4A4865',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 1px rgba(124, 58, 237, 0.08)',
      },
      borderRadius: {
        card: '8px',
      },
    },
  },
  plugins: [],
}
