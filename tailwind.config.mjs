/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#fdfcf9',
          100: '#fbf9f5',
          200: '#f5f1e9',
          300: '#eee8dc',
          400: '#e2d8c7',
          500: '#cbbda5',
          600: '#a8987e',
          700: '#7d6e56',
          800: '#524737',
          900: '#2b241a'
        },
        ink: {
          900: '#1a1816',
          800: '#2c2925',
          700: '#423d38',
          600: '#5e5750',
          500: '#7d746c',
          400: '#a1978d',
          300: '#c7bfb6',
          200: '#e4dfd9',
          100: '#f2eee9'
        },
        burgundy: {
          DEFAULT: '#883025',
          dark: '#6a2219',
          light: '#a9463a',
          tint: '#fcf3f2'
        },
        terracotta: '#b85d43',
        olive: '#4a5b3a',
        parchment: '#f7f4ee',
        darkParchment: {
          bg: '#141311',
          card: '#1c1b18',
          border: '#2c2a26',
          text: '#eae6df',
          subtext: '#9c968d'
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Lora', 'Playfair Display', 'Georgia', 'serif'],
        poetry: ['Newsreader', 'Lora', 'Noto Serif Devanagari', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      lineHeight: {
        poetry: '1.9',
        editorial: '1.75'
      }
    },
  },
  plugins: [],
}
