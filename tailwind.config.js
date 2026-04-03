/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        n8n: {
          bg: '#FAF5F0',
          surface: '#FFFFFF',
          border: '#E8E0F0',
          text: '#040506',
          'text-secondary': '#6B7280',
          pink: '#EA4B71',
          flame: '#EE4F27',
          'flame-light': '#FF9B26',
          dark: '#040506',
          green: '#16A34A',
          red: '#DC2626',
        },
        chart: {
          navy: '#1E293B',
          blue: '#3B82F6',
          pink: '#EA4B71',
          purple: '#7C3AED',
          coral: '#EE4F27',
          amber: '#F59E0B',
          grey: '#D1D5DB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        card: '8px',
      },
    },
  },
  plugins: [],
}
