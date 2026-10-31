<script setup lang="ts">
  import { createElement, type ComponentType } from 'react'
  import { createRoot, type Root } from 'react-dom/client'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  /**
   * React 예제(docs/components/demos/<name>.tsx)를 이 자리에 마운트한다.
   * 문서 사이트는 Vue(VitePress)라 예제는 브라우저에서만 그리고, 같은 예제 파일을 라이브러리 접근성 테스트가 렌더해 검사한다
   */
  const props = defineProps<{ name: string }>()
  const demos = import.meta.glob<{ default: ComponentType }>('../../components/demos/*.tsx')

  const el = ref<HTMLElement>()
  let root: Root | undefined
  let unmounted = false
  const loaded = ref(false)

  onMounted(async () => {
    const { default: Demo } = await demos[`../../components/demos/${props.name}.tsx`]()
    if (unmounted) return
    root = createRoot(el.value!)
    root.render(createElement(Demo))
    loaded.value = true
  })
  onBeforeUnmount(() => {
    unmounted = true
    root?.unmount()
  })
</script>

<template>
  <slot v-if="!loaded" />
  <div ref="el"></div>
</template>
