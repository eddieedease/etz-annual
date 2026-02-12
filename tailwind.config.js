/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'etz-blue': '#01273E',       // Daintree
        'etz-light-blue': '#41B8EE', // Picton Blue
        'etz-red': '#E30613',        // Passie (Red)
        'etz-green': '#95C11F',      // Flexibel (Green)
      },
      fontFamily: {
        'sans': ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}