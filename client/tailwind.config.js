/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#2D5A27',
          light: '#4B8B3B',
          dark: '#1B3617',
        },
        'secondary': {
          DEFAULT: '#5D4037',
          light: '#8D6E63',
          dark: '#3E2B25',
        },
        'nature': {
          beige: '#F5F5DC',
          cream: '#FFF9E3',
          bg: '#F9FAFB',
          border: '#E5E7EB',
        },
      },
      fontFamily: {
        'display': ['Outfit', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
