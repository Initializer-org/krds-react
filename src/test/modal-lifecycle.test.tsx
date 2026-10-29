import { act, createRef, StrictMode } from 'react'
import { fireEvent } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Modal } from '@/index'
import { render, screen } from './utils'

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function Dialog({ open = true, portal = false }: { open?: boolean; portal?: boolean }) {
  return (
    <Modal open={open} usePortal={portal}>
      <Modal.Content>
        <Modal.Header title="신청 확인" />
        <Modal.Body>
          <button type="button">확인</button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

test.each([false, true])('Modal: StrictMode에서 포커스 이동·닫기·다시 열기 (portal=%s)', async portal => {
  vi.useFakeTimers()
  const error = vi.spyOn(console, 'error')
  const { rerender, unmount } = render(
    <StrictMode>
      <Dialog portal={portal} />
    </StrictMode>
  )
  await act(() => vi.advanceTimersByTimeAsync(300))
  expect(screen.getByRole('button', { name: '확인' })).toHaveFocus()
  const close = screen.getByRole('button', { name: '모달 닫기' })
  close.focus()
  fireEvent.keyDown(close, { key: 'Tab' })
  expect(screen.getByRole('button', { name: '확인' })).toHaveFocus()
  rerender(
    <StrictMode>
      <Dialog open={false} portal={portal} />
    </StrictMode>
  )
  rerender(
    <StrictMode>
      <Dialog portal={portal} />
    </StrictMode>
  )
  await act(() => vi.advanceTimersByTimeAsync(300))
  expect(screen.getByRole('button', { name: '확인' })).toHaveFocus()
  unmount()
  expect(error).not.toHaveBeenCalled()
})

test.each(['close', 'unmount'] as const)('Modal: 초기 포커스 예약 전 %s 시 observer와 animation frame 정리', action => {
  const observe = vi.spyOn(MutationObserver.prototype, 'observe')
  const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect')
  const frame = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(12345)
  const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame')
  const { rerender, unmount } = render(<Dialog />)
  const index = observe.mock.calls.findIndex(([node]) => node instanceof Element && node.classList.contains('modal-content'))
  expect(index).toBeGreaterThanOrEqual(0)
  const observer = observe.mock.contexts[index]
  expect(frame).toHaveBeenCalled()
  if (action === 'close') rerender(<Dialog open={false} />)
  else unmount()
  expect(disconnect.mock.contexts).toContain(observer)
  expect(cancelFrame).toHaveBeenCalledWith(12345)
})

test('Modal: 포커스 타이머가 예약된 뒤 닫으면 숨겨진 내용으로 포커스를 옮기지 않는다', async () => {
  vi.useFakeTimers()
  const { rerender } = render(<Dialog />)
  await act(() => vi.advanceTimersByTimeAsync(50))
  const button = screen.getByRole('button', { name: '확인' })
  const focus = vi.spyOn(button, 'focus')
  rerender(<Dialog open={false} />)
  await act(() => vi.advanceTimersByTimeAsync(300))
  expect(focus).not.toHaveBeenCalled()
})

test('Modal: 열린 채 unmount해도 배경의 inert·스크롤 잠금과 포커스가 복원된다', async () => {
  vi.useFakeTimers()
  const wrap = document.createElement('div')
  wrap.id = 'wrap'
  const trigger = document.createElement('button')
  trigger.textContent = '열기'
  wrap.append(trigger)
  document.body.append(wrap)
  trigger.focus()
  try {
    const { unmount } = render(<Dialog portal />)
    await act(() => vi.advanceTimersByTimeAsync(300))
    expect(wrap).toHaveAttribute('inert')
    expect(document.body).toHaveClass('scroll-no')
    unmount()
    expect(wrap).not.toHaveAttribute('inert')
    expect(document.body).not.toHaveClass('scroll-no')
    expect(trigger).toHaveFocus()
  } finally {
    wrap.remove()
    document.body.classList.remove('scroll-no')
  }
})

test('Modal: 전달받은 ref에 내용 요소를 연결하고 unmount 시 해제한다', () => {
  const ref = createRef<HTMLDivElement>()
  const { unmount } = render(
    <Modal>
      <Modal.Content ref={ref}>
        <Modal.Title>제목</Modal.Title>
      </Modal.Content>
    </Modal>
  )
  expect(ref.current).toHaveClass('modal-content')
  unmount()
  expect(ref.current).toBeNull()
})
