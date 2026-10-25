import React, { forwardRef, useRef, useEffect, HTMLAttributes, ButtonHTMLAttributes } from 'react'
import { classNames } from '@/utils'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { DropdownItemProps, DropdownProps } from './Dropdown.types'

/**
 * KRDS Dropdown Component
 * @param isOpen 드롭다운 열림 상태 (controlled)
 * @param defaultOpen 기본 드롭다운 열림 상태 (uncontrolled)
 * @param onOpenChange 드롭다운 상태 변경 시 호출되는 콜백 함수
 * @param buttonText 드롭다운 버튼 텍스트 또는 콘텐츠
 * @param buttonClassName 드롭다운 버튼 클래스명
 * @param children 드롭다운 메뉴 콘텐츠
 * @param showBottomSection 드롭다운 하단 영역 표시 여부
 * @param bottomContent 드롭다운 하단 영역 콘텐츠
 * @param className 사용자 정의 클래스명
 */
const DropdownRoot = forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      isOpen,
      defaultOpen = false,
      onOpenChange,
      buttonText,
      buttonClassName = 'krds-btn small text drop-btn',
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const [open, setOpen] = useUncontrolled({
      value: isOpen,
      defaultValue: defaultOpen,
      finalValue: false,
      onChange: onOpenChange
    })

    const dropdownRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setOpen(!open)
    }

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setOpen(false)
        }
      }

      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [open, setOpen])

    return (
      <div ref={containerRef} className={classNames('krds-drop-wrap', open && 'active', className)}>
        <button
          type="button"
          className={buttonClassName}
          onClick={handleToggle}
          aria-expanded={open}
          ref={ref}
          {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {buttonText}
        </button>

        <div className="drop-menu" style={{ display: open ? 'block' : 'none' }} ref={dropdownRef}>
          <div className="drop-in">{children}</div>
        </div>
      </div>
    )
  }
)

DropdownRoot.displayName = 'Dropdown'

const DropdownTopSection = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={classNames('drop-top', className)} {...props}>
      {children}
    </div>
  )
})

DropdownTopSection.displayName = 'DropdownTopSection'

const DropdownList = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(({ children, className, ...props }, ref) => {
  return (
    <ul ref={ref} className={classNames('drop-list', className)} {...props}>
      {children}
    </ul>
  )
})

DropdownList.displayName = 'DropdownList'

const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(({ children, className, isActive, ...props }, ref) => {
  return (
    <li>
      <button ref={ref} type="button" className={classNames('item-link', className)} {...props}>
        {children}

        {isActive && <span className="sr-only">선택됨</span>}
      </button>
    </li>
  )
})

DropdownItem.displayName = 'DropdownItem'

const DropdownBottomSection = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={classNames('drop-bottom', className)} {...props}>
      {children}
    </div>
  )
})

DropdownBottomSection.displayName = 'DropdownBottomSection'

const Dropdown = Object.assign(DropdownRoot, {
  Item: DropdownItem,
  List: DropdownList,
  TopSection: DropdownTopSection,
  BottomSection: DropdownBottomSection
})

export { Dropdown }
