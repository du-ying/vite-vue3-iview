import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

function resolve (dirname) {
  return path.join(__dirname, dirname)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve('src'),
      '@views': resolve('src/views'),
      '@components': resolve('src/components'),
    }
  },
  css: {
    devSourcemap: true
  }
})
