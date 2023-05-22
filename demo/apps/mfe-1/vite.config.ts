import react from '@vitejs/plugin-react'
// @ts-ignore
import { assetsMapPlugin } from 'mfe-ui/plugin'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['mfe-ui'],
  },
  build: {
    // minify: true,
    commonjsOptions: {
      include: [/mfe-ui/, /node_modules/],
    },
  },
  // @ts-ignore
  plugins: [react(), assetsMapPlugin({ prefix: 'mfe-1' })],
  base: '/mfe-1/',
  ssr: {
    // external: ['react', 'react-dom', 'react-router-dom', 'react/jsx-runtime'],
    target: 'webworker',
    format: 'esm',
    noExternal: true,
  },
})
