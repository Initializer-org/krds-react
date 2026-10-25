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
