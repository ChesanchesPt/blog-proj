/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#FFF4F4',
        'accent': '#FF6B6B',
      },
      width: {
        81: '324px',
      },
      maxWidth: {
        175: '700px',
        185: '740px',
      },
      maxHeight: {
        135: '540px',
      },
    },
  },
  plugins: [],
}