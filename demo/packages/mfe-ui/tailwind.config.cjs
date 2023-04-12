/** @type {import('tailwindcss').Config} */
const { spacing, fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{ts,tsx,js,jsx}',
  ],
  darkMode: ['class', '[data-mode="dark"]'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'blue-opaque': 'rgb(13 42 148 / 18%)',
        gray: {
          0: '#fff',
          100: '#fafafa',
          200: '#eaeaea',
          300: '#999999',
          400: '#888888',
          500: '#666666',
          600: '#444444',
          700: '#333333',
          800: '#222222',
          900: '#111111',
        },
        primary: {
          0: '#eeedf8',
          100: '#cdc8e9',
          200: '#aba3db',
          300: '#897fcd',
          400: '#685abe',
          500: '#4e41a5',
          600: '#3d3280',
          700: '#2b245c',
          800: '#1a1637',
          900: '#090712',
          DEFAULT: '#2b245c'
        },
        secondary: {
          0: '#f6edf8',
          100: '#e3c8e9',
          200: '#d1a4db',
          300: '#be7fcc',
          400: '#ac5bbe',
          500: '#9241a4',
          600: '#723380',
          700: '#51245b',
          800: '#311637',
          900: '#100712',
          DEFAULT: '#51245b'
        },
        brandPink: {
          0: '#fbe9f8',
          100: '#f4beea',
          200: '#ed92dc',
          300: '#e566ce',
          400: '#de3bc0',
          500: '#c421a6',
          600: '#991a81',
          700: '#6d125c',
          800: '#410b37',
          900: '#160412',
          DEFAULT: '#6d125c',
        },
        brandViolet: {
          0: '#efeef6',
          100: '#d0cde5',
          200: '#b1abd3',
          300: '#928ac2',
          400: '#7268b0',
          500: '#594f97',
          600: '#453d75',
          700: '#312c54',
          800: '#1e1a32',
          900: '#0a0911',
          DEFAULT: '#453d75',
        }
      },
      fontFamily: {
        sans: ['IBM Plex Sans', ...fontFamily.sans],
      },
    },
  },
  variants: {
    typography: ['dark'],
  },
  plugins: [],
}
