import react from '@vitejs/plugin-react-swc'
import * as Path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
// @ts-ignore
import { dependencies, peerDependencies } from './package.json'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    minify: false,
    sourcemap: true,
    lib: {
      entry: {
        comps: Path.resolve(__dirname, 'src/index.ts'),
        plugin: Path.resolve(__dirname, 'src/lib/vite.plugins.ts'),
      },
      name: 'mfe-ui',
    },
    rollupOptions: {
      external: [
        ...Object.keys(peerDependencies),
        ...Object.keys(dependencies),
        /^node:.*$/,
        'react/jsx-runtime',
      ],
      output: [
        {
          esModule: true,
          exports: 'named',
          format: 'es',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'react/jsx-runtime',
          },
        },
        {
          exports: 'named',
          format: 'cjs',
          // inlineDynamicImports: true,
          interop: 'auto',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'react/jsx-runtime',
          },
        },
      ],
    },
  },
  resolve: {
    alias: {
      '@': Path.resolve(__dirname, './src'),
      '@tailwind': Path.resolve(__dirname, './tailwind.config.cjs'),
    },
  },
})
