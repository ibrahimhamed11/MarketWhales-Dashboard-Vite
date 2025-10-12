import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'contexts': path.resolve(__dirname, './src/contexts'),
      'assets': path.resolve(__dirname, './src/assets'),
      'utils': path.resolve(__dirname, './src/utils'),
      'apis': path.resolve(__dirname, './src/apis'),
      'theme': path.resolve(__dirname, './src/theme'),
      'variables': path.resolve(__dirname, './src/variables'),
      'views': path.resolve(__dirname, './src/views'),
      'layouts': path.resolve(__dirname, './src/layouts'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'styles': path.resolve(__dirname, './src/styles'),
      'staticData': path.resolve(__dirname, './src/staticData'),
      'routes': path.resolve(__dirname, './src/routes.jsx')
    }
  },
  define: {
    global: 'globalThis',
    'process.env': {}
  }
})
