/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#F8DDE3',
        rose: '#EFA7B2',
        berry: '#D96F82',
        cream: '#FFF8F5',
        sand: '#F7EAD8',
        cocoa: '#4E3B3A',
        muter: '#796A6A',
        line: '#F4E3E7'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(141, 96, 106, 0.12)',
        card: '0 18px 45px rgba(157, 108, 118, 0.12)'
      },
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif']
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
};
