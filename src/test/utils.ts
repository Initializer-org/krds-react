/**
 * 컴포넌트 테스트 헬퍼
 */
import axe from 'axe-core'
import { expect } from 'vitest'

export { render } from '@testing-library/react'

/** axe 규칙 설정 (원본 krds-react 유래 위반을 요소 단위로 제외할 때 selector 지정) */
export interface A11yRule {
  id: string
  selector?: string
  enabled?: boolean
}

/** 끝이 있는 애니메이션·전환이 끝날 때까지 대기 */
const waitForAnimations = () =>
  Promise.all(
    document
      .getAnimations()
      .filter(animation => animation.effect?.getComputedTiming().endTime !== Infinity)
      .map(animation => animation.finished.catch(() => undefined))
  )

/**
 * 문서 전체 접근성 검사. axe 기본 규칙에서 region만 끈다 (컴포넌트 단위 렌더에는 랜드마크가 없을 수 있음)
 */
export async function expectNoA11yViolations(rules: A11yRule[] = []) {
  await waitForAnimations()
  axe.reset()
  axe.configure({ rules: [{ id: 'region', enabled: false }, ...rules] })
  const { violations } = await axe.run(document.body)
  expect(violations.map(v => `${v.id}: ${v.nodes.map(node => node.target.join(' ')).join(' | ')}`)).toEqual([])
}
