import React, { createContext, useCallback, useContext, useEffect, useRef, forwardRef, useMemo } from 'react'
import { classNames } from '@/utils'
import Button from '../Button/Button'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import type {
  LanguageSwitcherProps,
  LanguageSwitcherMenuProps,
  LanguageSwitcherCurrentProps,
  LanguageSwitcherOptionListProps,
  LanguageSwitcherOptionItemProps,
  LanguageSwitcherContextValue
} from './LanguageSwitcher.types'
import { useMergeRefs } from '@/hooks/use-merge-refs'

const LanguageSwitcherContext = createContext<LanguageSwitcherContextValue | null>(null)

function useLanguageSwitcherContext() {
  const ctx = useContext(LanguageSwitcherContext)
  if (!ctx) throw new Error('LanguageSwitcher.* must be used within <LanguageSwitcher>')
  return ctx
}

export const LanguageSwitcherRoot = forwardRef<HTMLDivElement, LanguageSwitcherProps>(
  (
    {
      value,
      defaultValue,
      options = [],
      onChange,
      open,
      defaultOpen,
      onOpenChange,
      closeOnClickOutside = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [currentValue, setCurrentValue] = useUncontrolled({
      value,
      defaultValue,
      onChange,
      finalValue: ''
    })

    const [isOpen, setIsOpen] = useUncontrolled({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange
    })

    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const _ref = useMergeRefs(ref, dropdownRef)
    const itemRefs = useRef<Map<string, HTMLAnchorElement | null>>(new Map())

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          setIsOpen(false)
          console.log(buttonRef.current)
          buttonRef.current?.focus()
        }
      },
      [isOpen, setIsOpen]
    )

    useEffect(() => {
      if (!closeOnClickOutside) return
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen) {
          setIsOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, setIsOpen, closeOnClickOutside])

    const containerClasses = classNames('krds-drop-wrap', 'krds-language', className)

    const contextValue = useMemo(
      () => ({
        value: currentValue,
        onChange: setCurrentValue,
        options,
        open: isOpen,
        setOpen: setIsOpen,
        buttonRef,
        itemRefs
      }),
      [currentValue, setCurrentValue, options, isOpen, setIsOpen, buttonRef]
    )

    return (
      <LanguageSwitcherContext.Provider value={contextValue}>
        <div ref={_ref} className={containerClasses} onKeyDown={handleKeyDown} {...props}>
          {children}
        </div>
      </LanguageSwitcherContext.Provider>
    )
  }
)

const Trigger = forwardRef<HTMLButtonElement, { label?: string; className?: string }>(({ label = 'Language', className }, ref) => {
  const { open, setOpen, value, options, buttonRef } = useLanguageSwitcherContext()
  const currentLabel = options.find(opt => opt.value === value)?.label || value || label
  const _ref = useMergeRefs(ref, buttonRef)

  return (
    <Button
      ref={_ref}
      variant="text"
      size="small"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-controls="language-dropdown"
      aria-haspopup="listbox"
      className={classNames('drop-btn', open && 'active', className)}
    >
      <i className="svg-icon ico-global"></i>
      {/* 원본은 aria-label={label}('Language')로 보이는 현재 언어를 이름에서 뺐다. 화면 글자가 이름에 들어가도록 숨긴 글자로 앞에 붙인다 */}
      <span className="sr-only">{label} </span>
      {' ' + currentLabel + ' '}
      <i className="svg-icon ico-angle"></i>
    </Button>
  )
})

const Menu = forwardRef<HTMLDivElement, LanguageSwitcherMenuProps>(({ className, children }, ref) => {
  const { open } = useLanguageSwitcherContext()
  const menuRef = useRef<HTMLDivElement>(null)
  const _ref = useMergeRefs(ref, menuRef)

  useEffect(() => {
    if (open && menuRef.current) {
      // 위치 조정 로직 (원본 JavaScript와 동일)
      const menu = menuRef.current
      const wrapper = menu.closest('.krds-drop-wrap') as HTMLElement
      if (wrapper) {
        // 기존 위치 클래스 제거
        wrapper.classList.remove('drop-left', 'drop-right')

        // 메뉴 위치 계산
        const menuRect = menu.getBoundingClientRect()
        const windowWidth = window.innerWidth

        if (menuRect.left < 0) {
          wrapper.classList.add('drop-left')
        } else if (windowWidth < menuRect.left + menuRect.width) {
          wrapper.classList.add('drop-right')
        }
      }
    }
  }, [open])

  return (
    <div
      ref={_ref}
      className={classNames('drop-menu', className)}
      style={{ display: open ? 'block' : 'none' }}
      role="listbox"
      id="language-dropdown"
    >
      <div className="drop-in">{children}</div>
    </div>
  )
})

const Current = ({ label, className }: LanguageSwitcherCurrentProps) => {
  const { value, options } = useLanguageSwitcherContext()
  const currentLabel = options.find(opt => opt.value === value)?.label || value

  return (
    <div className="drop-top">
      <p className={classNames('current-laguage', className)}>
        <span>{label}</span>
        <strong>{currentLabel}</strong>
      </p>
    </div>
  )
}

const OptionList = ({ className, ...props }: LanguageSwitcherOptionListProps) => {
  const { options } = useLanguageSwitcherContext()
  return (
    <ul className={classNames('drop-list', className)} role="list" {...props}>
      {options.map(opt => (
        <LanguageSwitcher.OptionItem key={opt.value} {...opt} />
      ))}
    </ul>
  )
}

const OptionItem = ({ value, label, href, external, className, ...props }: LanguageSwitcherOptionItemProps) => {
  const { value: currentValue, onChange, setOpen, itemRefs } = useLanguageSwitcherContext()
  const isActive = currentValue === value

  const handleSelect = (e: React.MouseEvent) => {
    if (!href && !external) {
      e.preventDefault()
    }
    onChange(value, { value, label, href, external })
    setOpen(false)
  }

  const handleFocus = (e: React.FocusEvent) => {
    e.preventDefault()
    itemRefs.current?.forEach(el => {
      el?.style.removeProperty('position')
      el?.style.removeProperty('z-index')
    })
    itemRefs.current?.get(value)?.style.setProperty('position', 'relative')
    itemRefs.current?.get(value)?.style.setProperty('z-index', '1')
  }

  return (
    <li role="listitem" {...props}>
      <a
        ref={el => {
          if (el) {
            itemRefs.current?.set(value, el)
          } else {
            itemRefs.current?.delete(value)
          }
        }}
        href={href || '#'}
        className={classNames('item-link', isActive && 'active', className)}
        onClick={handleSelect}
        onFocus={handleFocus}
        role="option"
        aria-selected={isActive}
        lang={value}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {label}
        {external && <i className="svg-icon ico-go"></i>}
      </a>
    </li>
  )
}

const LanguageSwitcher = Object.assign(LanguageSwitcherRoot, {
  Root: LanguageSwitcherRoot,
  Trigger,
  Menu,
  Current,
  OptionList,
  OptionItem
})

LanguageSwitcher.displayName = 'LanguageSwitcher'

export { LanguageSwitcher }
