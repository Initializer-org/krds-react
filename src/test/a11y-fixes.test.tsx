/**
 * 원본 krds-react에서 고친 접근성 문제의 회귀 테스트. axe만으로는 드러나지 않는 부분(이름이 보이는 글자와 같은지, 레이블 클릭, 서버 렌더링 id)을 직접 확인한다
 */
import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { page } from 'vitest/browser'
import { Checkbox, CheckboxChip, LanguageSwitcher, Modal, Radio, RadioGroup, Select, Tooltip } from '@/index'
import { render, screen } from './utils'

afterEach(() => vi.restoreAllMocks())

describe('원본 접근성 문제 수정', () => {
  test('Checkbox: children 레이블이 이름이 되고(원본은 고정 문자열 "레이블"), id 없이도 레이블을 누르면 선택된다', async () => {
    render(<Checkbox name="agree">개인정보 수집·이용 동의</Checkbox>)
    const checkbox = screen.getByRole('checkbox', { name: '개인정보 수집·이용 동의' })
    expect(checkbox).not.toHaveAttribute('aria-label')
    await page.getByText('개인정보 수집·이용 동의').click()
    expect(checkbox).toBeChecked()
  })

  test('CheckboxChip: id 없이도 레이블이 연결된다', () => {
    render(<CheckboxChip name="chip">전체</CheckboxChip>)
    expect(screen.getByRole('checkbox', { name: '전체' })).toBeInTheDocument()
  })

  test('Select: id 없이도 레이블이 연결된다', () => {
    render(<Select label="발급 용도" options={[{ value: 'submit', label: '제출용' }]} />)
    expect(screen.getByRole('combobox', { name: '발급 용도' })).toBeInTheDocument()
  })

  test('Modal: Modal.Title이 대화상자의 이름이 된다', () => {
    render(
      <Modal defaultOpen>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>신청 확인</Modal.Title>
          </Modal.Header>
        </Modal.Content>
      </Modal>
    )
    expect(screen.getByRole('dialog', { name: '신청 확인' })).toBeInTheDocument()
  })

  test('Modal: 직접 준 aria-labelledby가 우선한다', () => {
    render(
      <Modal defaultOpen>
        <Modal.Content aria-labelledby="custom-title">
          <p id="custom-title">직접 지정한 제목</p>
          <Modal.Title>신청 확인</Modal.Title>
        </Modal.Content>
      </Modal>
    )
    expect(screen.getByRole('dialog', { name: '직접 지정한 제목' })).toBeInTheDocument()
  })

  test('Radio: 서버 렌더링 결과와 브라우저의 id가 같다 (원본은 렌더마다 Math.random)', async () => {
    const ui = (
      <RadioGroup name="auth" defaultValue="phone">
        <Radio value="phone">휴대폰 인증</Radio>
      </RadioGroup>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(ui)
    document.body.append(container)
    const serverId = container.querySelector('input')!.id
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const root = await act(async () => hydrateRoot(container, ui))
    expect(container.querySelector('input')!.id).toBe(serverId)
    expect(error).not.toHaveBeenCalled()
    act(() => root.unmount())
    container.remove()
  })

  test('Tooltip: 보이는 글자가 버튼 이름, 툴팁 내용은 설명이다 (원본은 툴팁 내용이 이름)', () => {
    render(<Tooltip text="본인 명의 휴대폰으로 인증합니다.">휴대폰 인증</Tooltip>)
    const button = screen.getByRole('button', { name: '휴대폰 인증' })
    expect(button).toHaveAccessibleDescription('본인 명의 휴대폰으로 인증합니다.')
    expect(button).toHaveAttribute('type', 'button')
  })

  test('LanguageSwitcher: 버튼 이름에 보이는 현재 언어가 들어간다 (원본은 aria-label "Language")', () => {
    render(
      <LanguageSwitcher defaultValue="ko" options={[{ value: 'ko', label: '한국어' }]}>
        <LanguageSwitcher.Trigger />
      </LanguageSwitcher>
    )
    expect(screen.getByRole('button', { name: /한국어/ })).toBeInTheDocument()
  })
})
