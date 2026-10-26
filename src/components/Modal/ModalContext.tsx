import React from 'react'

interface ModalContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  size: 'sm' | 'md' | 'lg'
  variant: 'default' | 'full' | 'bottom-sheet'
  closeOnEsc: boolean
  closeOnOverlayClick: boolean
  usePortal: boolean
  portalContainer?: string | HTMLElement
}

export const ModalContext = React.createContext<ModalContextValue | null>(null)

/** Modal.Content의 대화상자 이름: Modal.Title이 렌더되면 자기 id를 알려 aria-labelledby로 연결된다 */
interface ModalTitleContextValue {
  generatedTitleId: string
  setTitleId: (id: string | undefined) => void
}

export const ModalTitleContext = React.createContext<ModalTitleContextValue | null>(null)

export const useModalContext = () => {
  const ctx = React.useContext(ModalContext)
  if (!ctx) throw new Error('Modal compound components must be used within <Modal.Root>')
  return ctx
}
