import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/fire-doc/',
  server: {
    proxy: {
      '/prefix/fire-doc/api': {
        target: 'http://localhost:8080/fire-doc/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prefix\/fire-doc\/api/, '') 
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    },
  }
})
