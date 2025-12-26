
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 如果你的仓库名不是根路径，请将 base 设置为 '/仓库名/'
  // 例如：base: '/laozhong-game/', 
  base: './', 
})
