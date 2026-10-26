/**
 * 문서 예제(docs/components/demos)를 모두 렌더해 axe 접근성 검사. 문서에 보이는 예제가 곧 검사 대상이다
 */
import type { ComponentType } from 'react'
import { describe, test } from 'vitest'
import { page } from 'vitest/browser'
import { expectNoA11yViolations, render } from './utils'

const demos = import.meta.glob<{ default: ComponentType }>('../../docs/components/demos/*.tsx', { eager: true })

/** 닫힌 상태로 렌더되는 예제는 열고 나서 검사 */
const open: Record<string, () => Promise<void>> = {
  Modal: () => page.getByRole('button', { name: '신청 확인' }).click()
}

describe('접근성 (axe)', () => {
  for (const [file, { default: Demo }] of Object.entries(demos)) {
    const name = file.match(/([^/]+)\.tsx$/)![1]
    test(name, async () => {
      render(<Demo />)
      await open[name]?.()
      await expectNoA11yViolations()
    })
  }
})
