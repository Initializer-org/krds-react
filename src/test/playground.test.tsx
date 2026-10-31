import { expect, test } from 'vitest'
import { page } from 'vitest/browser'
import Playground from '../../docs/components/demos/Playground'
import '../../docs/.vitepress/theme/playground.css'
import { expectNoA11yViolations, render, screen } from './utils'

test('플레이그라운드 신청 오류, 확인 모달과 초기화', async () => {
  render(<Playground />)
  await page.getByRole('button', { name: '예시 신청하기' }).click()
  expect(screen.getByLabelText('이름 (필수)')).toHaveFocus()
  expect(screen.getByText('이름을 입력해 주세요.')).toBeVisible()
  await expectNoA11yViolations([{ id: 'region', enabled: true }])
  await page.getByRole('textbox', { name: '이름 (필수)', exact: true }).fill('체험 사용자')
  await page.getByRole('combobox', { name: '신청 유형 (필수)', exact: true }).selectOptions('certificate')
  await page.getByText('개인정보 수집·이용 동의 (필수)', { exact: true }).click()
  await page.getByRole('button', { name: '예시 신청하기' }).click()
  expect(await screen.findByRole('dialog')).toHaveTextContent('체험 사용자님의 입력을 확인했습니다.')
  await expectNoA11yViolations()
  await page.getByRole('button', { name: '닫기', exact: true }).click()
  await page.getByRole('button', { name: '초기화', exact: true }).click()
  expect(screen.getByLabelText('이름 (필수)')).toHaveValue('')
  expect(screen.getByLabelText('개인정보 수집·이용 동의 (필수)')).not.toBeChecked()
  expect(screen.queryByText('이름을 입력해 주세요.')).not.toBeInTheDocument()
})

test('단계와 페이지를 바꾸면 표시 내용도 갱신된다', async () => {
  render(<Playground />)
  await page.getByRole('button', { name: '다음 단계', exact: true }).click()
  expect(screen.getByText('현재 단계: 2 / 4')).toBeVisible()
  await page.getByRole('link', { name: '2', exact: true }).click()
  expect(screen.getByText('현재 페이지: 2 / 3')).toBeVisible()
  expect(screen.queryByText('주민등록표 등본 발급')).not.toBeInTheDocument()
})

test('모바일 전체메뉴를 열고 닫을 수 있다', async () => {
  await page.viewport(390, 844)
  render(<Playground />)
  await page.getByRole('button', { name: '전체메뉴', exact: true }).click()
  await page.getByRole('button', { name: '전체메뉴 닫기', exact: true }).click()
  await expect.poll(() => screen.queryByRole('button', { name: '전체메뉴 닫기' })).toBeNull()
})

test.each([1920, 1440, 1024, 390])('화면 너비 %ipx에서 로고 이름과 본문이 잘리지 않는다', async width => {
  await page.viewport(width, 1080)
  const { container } = render(<Playground />)
  const brand = screen.getByRole('link', { name: /^KRDS React$/ })
  expect(brand).toHaveTextContent('KRDS React')
  const name = brand.querySelector('span')!
  expect(name.getBoundingClientRect().width).toBeGreaterThan(50)
  const content = container.querySelector('.contents')!.getBoundingClientRect()
  const nav = container.querySelector('.krds-side-navigation')!
  if (width >= 1024) expect(nav.getBoundingClientRect().right).toBeLessThanOrEqual(content.left)
  else expect(nav).not.toBeVisible()
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width)
})
