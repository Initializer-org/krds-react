import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      outDirs: 'dist/types',
      bundleTypes: true
    })
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      // 모든 컴포넌트가 훅을 쓰는 클라이언트 컴포넌트라 Next.js App Router(서버 컴포넌트)에서 바로 import되게 한다
      output: { banner: "'use client'" }
    }
  }
})
