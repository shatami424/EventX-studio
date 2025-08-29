/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sneat palette
        primary: {
          DEFAULT: '#696CFF',
          foreground: '#ffffff',
        },
        info: { DEFAULT: '#03C3EC' },
        success: { DEFAULT: '#71DD37' },
        warning: { DEFAULT: '#FFAB00' },
        danger: { DEFAULT: '#FF3E1D' },
        muted: {
          DEFAULT: '#8592A3',
          foreground: '#566A7F',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#2F3349',
        },
        border: '#E4E6E8',
        background: '#F5F6FA',
      },
      fontFamily: {
        sans: [
          'Public Sans',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 2px 6px 0 rgba(47, 51, 73, 0.08)',
        soft: '0 1px 2px 0 rgba(0,0,0,0.06), 0 1px 3px 0 rgba(0,0,0,0.1)',
      },
      borderRadius: {
        xl: '14px',
      },
    },
  },
  plugins: [forms(), typography()],
}
