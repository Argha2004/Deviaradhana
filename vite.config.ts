import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const r2Target = env.VITE_R2_PUBLIC_URL || 'https://pub-3ec651b4d390400ebaeed267d6f69722.r2.dev'

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/r2-proxy': {
          target: r2Target,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/r2-proxy/, ''),
        },
      },
    },
  }
})
