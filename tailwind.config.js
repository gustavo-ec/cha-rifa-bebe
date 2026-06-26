/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FBF5EE',
        blush: '#E8B4BC',
        'blush-deep': '#D998A3',
        terracotta: '#C97C5D',
        sage: '#9CAF88',
        'sage-deep': '#7E9670',
        charcoal: '#3A3530',
        'charcoal-soft': '#6B6258',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
