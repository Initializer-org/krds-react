import { classNames } from '@/utils'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { forwardRef, useEffect, useRef } from 'react'

import { ContextualHelpProps } from './ContextualHelp.types'
import Button from '../Button'

/**
 * KRDS ContextualHelp Component
 * @param label 도움말 라벨 텍스트
 * @param title 팝오버 제목
 * @param children 팝오버 내용
 * @param position 팝오버 위치 ('top' | 'bottom')
 * @param alignment 팝오버 정렬 ('left' | 'center' | 'right')
 * @param open 팝오버 열림/닫힘 상태
 * @param defaultOpen 기본 팝오버 열림/닫힘 상태
 * @param onOpenChange 팝오버 상태 변경 핸들러
 * @param className 사용자 정의 클래스명
 */
export const ContextualHelp = forwardRef<HTMLDivElement, ContextualHelpProps>(
  ({ label, title, children, position = 'top', alignment = 'left', open, defaultOpen = false, onOpenChange, className, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const popoverRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const contentsRef = useRef<HTMLDivElement>(null)

    const [isOpen, setIsOpen] = useUncontrolled({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange
    })

    const containerClasses = classNames('krds-contextual-help', position, alignment, className)

    const handleToggle = () => {
      setIsOpen(!isOpen)
    }

    const handleClose = () => {
      setIsOpen(false)
      buttonRef.current?.focus()
    }

    const adjustPopoverPosition = () => {
      if (!isOpen || !popoverRef.current || !containerRef.current) return

      const isMobile = window.innerWidth <= 768
      const tooltipAction = containerRef.current.querySelector('.tooltip-action') as HTMLElement

      if (isMobile && tooltipAction) {
        const rootStyles = getComputedStyle(document.querySelector(':root')!)
        const contentsPaddingX = parseInt(rootStyles.getPropertyValue('--krds-contents-padding-x')?.replace('px', '') || '20')
        const tooltipActionRect = tooltipAction.getBoundingClientRect()
        const offsetLeft = tooltipActionRect.left - contentsPaddingX
        const width = document.body.clientWidth - contentsPaddingX * 2

        popoverRef.current.style.left = `-${offsetLeft}px`
        popoverRef.current.style.width = `${width}px`
      } else {
        popoverRef.current.style.left = ''
        popoverRef.current.style.right = ''
        popoverRef.current.style.width = ''
      }
    }

    const focusFirstFocusableElement = (container: HTMLElement) => {
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]:not([tabindex="-1"])',
        '[tabindex]:not([tabindex="-1"]):not([disabled])',
        '[contenteditable="true"]'
      ].join(', ')

      const focusableElements = container.querySelectorAll(focusableSelectors)

      const visibleFocusables = Array.from(focusableElements).filter((el: Element) => {
        const htmlElement = el as HTMLElement
        return htmlElement.offsetParent !== null && getComputedStyle(htmlElement).visibility !== 'hidden'
      })

      if (visibleFocusables.length > 0) {
        ;(visibleFocusables[0] as HTMLElement).focus()
      } else {
        const closeButton = popoverRef.current?.querySelector('.tooltip-close') as HTMLButtonElement
        closeButton?.focus()
      }
    }

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          handleClose()
        }
      }

      const handleResize = () => {
        adjustPopoverPosition()
      }

      if (isOpen) {
        adjustPopoverPosition()

        requestAnimationFrame(() => {
          if (contentsRef.current) {
            focusFirstFocusableElement(contentsRef.current)
          }
        })

        document.addEventListener('click', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)
        window.addEventListener('resize', handleResize)
        return () => {
          document.removeEventListener('keydown', handleKeyDown)
          document.removeEventListener('click', handleClickOutside)
          window.removeEventListener('resize', handleResize)
        }
      }
    }, [isOpen])

    return (
      <div ref={ref || containerRef} className={containerClasses} {...props}>
        {label && <p className="tooltip-txt">{label}</p>}
        <div className="tooltip-action">
          <Button ref={buttonRef} variant="icon" size="medium" className="tooltip-btn" onClick={handleToggle} aria-expanded={isOpen}>
            <span className="sr-only">도움말</span>
            <i className="svg-icon ico-tooltip" />
          </Button>
          <div ref={popoverRef} className={classNames('tooltip-popover', isOpen && 'show')} role="tooltip">
            <h4 className="tooltip-title">{title}</h4>
            <div ref={contentsRef} className="tooltip-contents">
              {children}
            </div>
            <Button variant="icon" size="xsmall" className="tooltip-close" onClick={handleClose} aria-label="닫기">
              <span className="sr-only">닫기</span>
              <i className="svg-icon ico-modal-close" />
            </Button>
          </div>
        </div>
      </div>
    )
  }
)

ContextualHelp.displayName = 'ContextualHelp'
