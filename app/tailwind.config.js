/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF7A00',
          'orange-light': '#FFF1E6',
          'orange-mid': '#FFD4A8',
        },
        pwa: { bg: '#FAF6F0' },
        ink: {
          primary: '#1A1A1A',
          secondary: '#4A4A4A',
          placeholder: '#9CA3AF',
        },
        line: { base: '#EEEEEE' },
        surface: { card: '#F8F8F8' },
      },
      fontSize: {
        'h1': ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        'h2': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'card-title': ['15px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'micro': ['11px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      borderRadius: {
        card: '12px',
        'card-lg': '16px',
        'card-xl': '20px',
        btn: '10px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 4px 16px rgba(0,0,0,0.06)',
        float: '0 -8px 24px rgba(0,0,0,0.10)',
        sheet: '0 -4px 20px rgba(0,0,0,0.08)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
