/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'ping-it': 'ping 0.35s',
      },
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
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
