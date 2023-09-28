/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        darken: 
        {
          100: '#232830',
          200 : '#1B1F28',
          300 : '#353D49',
        },
        whiteSmoke : "#E8EAEB",
        blueStrong : "#2978F2",
      },
      animation: {
        'ping-it': 'ping 0.4s linear',
        'notify': 'ping 2s linear',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
        'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily:{
        Shantell: ['Shantell Sans'],
        Cairo: ['Cairo']
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
