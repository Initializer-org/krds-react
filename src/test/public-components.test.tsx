import { expect, test } from 'vitest'
import { page } from 'vitest/browser'
import { HelpPanel, HelpPanelTrigger, HelpPanelContent, HelpPanelClose, HelpSection, Tag, TagWrap } from '@/index'
import { render, screen } from './utils'

test('공개 HelpPanel 하위 컴포넌트로 패널을 구성하고 열기·닫기·포커스 복원을 할 수 있다', async () => {
  render(
    <HelpPanel>
      <HelpPanelTrigger>작성 도움말</HelpPanelTrigger>
      <HelpPanelContent>
        <HelpSection title="신청 안내">서류를 준비해 주세요.</HelpSection>
        <HelpPanelClose />
      </HelpPanelContent>
    </HelpPanel>
  )
  const trigger = screen.getByRole('button', { name: '작성 도움말' })
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await page.getByRole('button', { name: '작성 도움말' }).click()
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect.element(page.getByRole('heading', { name: /신청 안내/ })).toBeVisible()
  await page.getByRole('button', { name: /접어두기/ }).click()
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  expect(trigger).toHaveFocus()
})

test('공개 TagWrap으로 태그를 묶으면 지정한 크기와 태그 링크를 사용할 수 있다', () => {
  render(
    <TagWrap size="small">
      <Tag variant="link" href="#apply">
        민원 신청
      </Tag>
    </TagWrap>
  )
  const link = screen.getByRole('link', { name: '민원 신청' })
  expect(link).toHaveAttribute('href', '#apply')
  expect(link.parentElement).toHaveClass('krds-tag-wrap', 'small')
})
