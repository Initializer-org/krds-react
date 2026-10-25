import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { classNames } from '@/utils'
import React, { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import Button from '../Button'
import { Portal } from '../Portal/Portal'
import {
  ModalBodyProps,
  ModalCloseProps,
  ModalContentProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalOverlayProps,
  ModalRootProps,
  ModalTriggerProps
} from './Modal.types'
import { ModalContext, useModalContext } from './ModalContext'

const Slot = React.forwardRef<any, { children?: React.ReactNode } & any>(({ children, ...props }, ref) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ...(children as any)?.props,
      ref
    })
  }
  return null
})
Slot.displayName = 'Slot'

/**
 * KRDS Modal Component
 * @param variant 모달 유형 ('default' | 'bottom-sheet')
 * @param size 모달 크기 ('sm' | 'md' | 'lg')
 * @param open 열림 상태 (제어)
 * @param defaultOpen 초기 열림 상태 (비제어)
 * @param onOpenChange 열림 상태 변경 핸들러
 */
const ModalRoot = ({
  children,
  size = 'lg',
  variant = 'default',
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnEsc = false,
  closeOnOverlayClick = false,
  usePortal = false,
  portalContainer
}: ModalRootProps) => {
  const [_open, setOpen] = useUncontrolled({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange
  })

  const contextValue = useMemo(
    () => ({
      open: _open,
      setOpen,
      size,
      variant,
      closeOnEsc,
      closeOnOverlayClick,
      usePortal,
      portalContainer
    }),
    [_open, setOpen, size, variant, closeOnEsc, closeOnOverlayClick, usePortal, portalContainer]
  )

  return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>
}

ModalRoot.displayName = 'ModalRoot'

const ModalTrigger = forwardRef<HTMLButtonElement, ModalTriggerProps>(({ onClick, asChild = false, children, ...props }, ref) => {
  const { setOpen } = useModalContext()
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      setOpen(true)
    },
    [onClick, setOpen]
  )

  if (asChild) {
    return (
      <Slot onClick={handleClick} {...props} ref={ref}>
        {children}
      </Slot>
    )
  }

  return (
    <button type="button" onClick={handleClick} {...props} ref={ref}>
      {children}
    </button>
  )
})
ModalTrigger.displayName = 'ModalTrigger'

const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>(({ className = '', ...props }, ref) => {
  const { open } = useModalContext()

  return <div className={classNames('modal-back', open && 'in', className)} {...props} ref={ref} />
})
ModalOverlay.displayName = 'ModalOverlay'
const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(({ className = '', children, id, role = 'dialog', ...props }, ref) => {
  const { open, setOpen, size, variant, closeOnEsc, closeOnOverlayClick, usePortal, portalContainer } = useModalContext()

  const generatedId = useId()
  const sectionId = id || `krds-modal-${generatedId}`

  const contentRef = useRef<HTMLDivElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previousFocused = useRef<HTMLElement | null>(null)
  const focusableElements = useRef<HTMLElement[]>([])
  const isInitialized = useRef(false)
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const getFocusableElements = useCallback(() => {
    if (!contentRef.current) return []

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'iframe',
      'object',
      'embed',
      'area[href]',
      'audio[controls]',
      'video[controls]'
    ].join(', ')

    return Array.from(contentRef.current.querySelectorAll<HTMLElement>(focusableSelector)).filter(el => {
      const ariaHidden = el.getAttribute('aria-hidden')
      const hiddenByAttr = el.hasAttribute('disabled') || ariaHidden === 'true'
      return !hiddenByAttr
    })
  }, [])

  const setInitialFocus = useCallback(() => {
    if (isInitialized.current) return

    const focusable = getFocusableElements()
    focusableElements.current = focusable
    isInitialized.current = true

    focusTimeoutRef.current = setTimeout(() => {
      const firstFocusable = focusable[0]
      if (firstFocusable) {
        firstFocusable.focus()
      }
    }, 200)
  }, [getFocusableElements])

  const handleContentMount = useCallback(
    (node: HTMLDivElement | null) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(node)
        } else {
          ref.current = node
        }
      }
      contentRef.current = node

      if (node && open) {
        const observer = new MutationObserver(() => {
          setInitialFocus()
          observer.disconnect()
        })

        observer.observe(node, {
          attributes: true,
          attributeFilter: ['tabindex'],
          subtree: true,
          childList: true
        })

        requestAnimationFrame(() => {
          setInitialFocus()
        })

        return () => observer.disconnect()
      }
    },
    [ref, open, setInitialFocus]
  )

  const handleDialogMount = useCallback((node: HTMLDivElement | null) => {
    dialogRef.current = node
  }, [])

  useEffect(() => {
    return () => {
      focusableElements.current = []
      isInitialized.current = false
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current)
      }
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!open) {
      focusableElements.current = []
      isInitialized.current = false
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current)
      }
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current)
      }
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Escape' || e.key === 'Esc') && closeOnEsc) {
        setOpen(false)
        return
      }

      if (e.key === 'Tab') {
        const focusable = focusableElements.current

        if (focusable.length === 0) {
          e.preventDefault()
          return
        }

        const firstFocusable = focusable[0]
        const lastFocusable = focusable[focusable.length - 1]
        const activeElement = document.activeElement as HTMLElement

        if (e.shiftKey && activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable.focus()
        } else if (!e.shiftKey && activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [open, closeOnEsc, setOpen])

  useEffect(() => {
    if (open) {
      document.body.classList.add('scroll-no')
      previousFocused.current = document.activeElement as HTMLElement | null

      const wrapElement = document.getElementById('wrap')
      if (wrapElement) {
        wrapElement.setAttribute('inert', '')
      }

      openTimeoutRef.current = setTimeout(() => {
        dialogRef.current?.classList.add('in')
      }, 150)
    } else {
      document.body.classList.remove('scroll-no')
      previousFocused.current?.focus()

      const wrapElement = document.getElementById('wrap')
      if (wrapElement) {
        wrapElement.removeAttribute('inert')
      }
    }
  }, [open])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      const clickedElement = e.target as HTMLElement
      if (contentRef.current?.contains(clickedElement)) {
        return
      }

      if (closeOnOverlayClick) {
        setOpen(false)
      } else {
        focusableElements.current[0]?.focus()
      }
    },
    [setOpen, closeOnOverlayClick]
  )

  const rootClasses = classNames('krds-modal shown', open && 'in', className)

  return (
    <Portal enabled={usePortal} container={portalContainer}>
      <section
        id={sectionId}
        aria-modal="true"
        role={role}
        className={rootClasses}
        data-type={variant === 'default' ? undefined : variant}
        onClick={handleOverlayClick}
        {...props}
      >
        <div
          className={classNames('modal-dialog', size === 'sm' && 'modal-sm', size === 'md' && 'modal-md', size === 'lg' && 'modal-lg')}
          ref={handleDialogMount}
        >
          <div className="modal-content" ref={handleContentMount}>
            {children}
            <ModalCloseIconButton />
          </div>
        </div>
        <ModalOverlay />
      </section>
    </Portal>
  )
})

ModalContent.displayName = 'ModalContent'

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(({ children, title, titleId, className = '', ...props }, ref) => {
  const id = titleId
  return (
    <div className={classNames('modal-header', className)} {...props} ref={ref}>
      {title ? (
        <h2 id={id} className="modal-title">
          {title}
        </h2>
      ) : (
        children
      )}
    </div>
  )
})
ModalHeader.displayName = 'ModalHeader'

const ModalTitle = forwardRef<HTMLHeadingElement, React.ComponentProps<'h2'>>(({ className = '', ...props }, ref) => {
  return <h2 className={classNames('modal-title', className)} {...props} ref={ref} />
})
ModalTitle.displayName = 'ModalTitle'

const ModalDescription = forwardRef<HTMLParagraphElement, React.ComponentProps<'p'>>(({ className = '', ...props }, ref) => {
  return <p className={classNames('text-sm text-muted-foreground', className)} {...props} ref={ref} />
})
ModalDescription.displayName = 'ModalDescription'

const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(({ children, className = '', descriptionId, ...props }, ref) => {
  const [hasScroll, setHasScroll] = useState(false)

  const bodyRef = useRef<HTMLDivElement | null>(null)

  const handleBodyMount = useCallback(
    (node: HTMLDivElement | null) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(node)
        } else {
          ref.current = node
        }
      }
      bodyRef.current = node

      if (node) {
        const isScrollable = node.scrollHeight > node.clientHeight
        setHasScroll(isScrollable)
      }
    },
    [ref]
  )

  return (
    <div
      className={classNames('modal-conts', className)}
      id={descriptionId}
      ref={handleBodyMount}
      {...(hasScroll && { tabIndex: 0 })}
      {...props}
    >
      <div className="conts-area">{children}</div>
    </div>
  )
})
ModalBody.displayName = 'ModalBody'

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(({ children, className = '', ...props }, ref) => {
  return (
    <div className={classNames('modal-btn', 'btn-wrap', className)} {...props} ref={ref}>
      {children}
    </div>
  )
})
ModalFooter.displayName = 'ModalFooter'

const ModalCloseIconButton = () => {
  const { setOpen } = useModalContext()

  return (
    <Button variant="icon" type="button" size="medium" className={classNames('btn-close')} onClick={() => setOpen(false)}>
      <span className="sr-only">모달 닫기</span>
      <i className="svg-icon ico-popup-close" />
    </Button>
  )
}

const ModalClose = forwardRef<HTMLButtonElement, ModalCloseProps>(({ onClick, className, children, asChild = false, ...props }, ref) => {
  const { setOpen } = useModalContext()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      setOpen(false)
    },
    [onClick, setOpen]
  )

  const Component = asChild ? Slot : 'button'

  return (
    <Component ref={asChild ? (ref as any) : ref} className={className} onClick={handleClick} {...props}>
      {children}
    </Component>
  )
})

const Modal = Object.assign(ModalRoot, {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  Body: ModalBody,
  Footer: ModalFooter,
  Close: ModalClose
})

Modal.displayName = 'Modal'

export default Modal
