/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'primary-light': '#3B82F6',
        accent: '#E0E7FF',
        'text-main': '#1F2937',
        'text-light': '#6B7280',
        'bg-light': '#F9FAFB',
        'card-bg': '#FFFFFF',
        border: '#E5E7EB',
      },
    },
  },
  plugins: [],
}
