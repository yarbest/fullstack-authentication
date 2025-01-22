import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import sassDts from 'vite-plugin-sass-dts'

import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react(), sassDts()],
  resolve: {
    alias: {
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      'src': path.resolve(__dirname, './src'),
    },
  },
  base: mode === 'production' ? '/fullstack-authentication' : '/',
}))
