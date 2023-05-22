/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('mfe-ui/tailwind.config.cjs')],
  corePlugins: {
    preflight: true
  },
}
