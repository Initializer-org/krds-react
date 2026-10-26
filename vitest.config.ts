import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 문서 데모(docs/components/demos)가 패키지 이름으로 import하므로 소스로 연결
      '@krds.ui/react': fileURLToPath(new URL('./src/index.ts', import.meta.url))
    }
  },
  // 테스트 도중 새 의존성을 발견해 다시 묶으면 React가 두 벌 로드되므로(Invalid hook call) 처음부터 함께 묶는다
  optimizeDeps: {
    include: ['react', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client', 'react-dom/server']
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      viewport: { width: 1200, height: 900 }
    }
  }
})
