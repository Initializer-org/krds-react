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

export const useModalContext = () => {
  const ctx = React.useContext(ModalContext)
  if (!ctx) throw new Error('Modal compound components must be used within <Modal.Root>')
  return ctx
}
