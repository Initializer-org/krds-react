import React, { forwardRef, useCallback, useRef, createContext, useContext, useState } from 'react'
import { classNames } from '@/utils'
import { useUncontrolled } from '@/hooks/use-uncontrolled'

import { TabProps, TabListProps, TabTriggerProps, TabPanelProps, TabContextValue, TabContentProps } from './Tab.types'

const TabContext = createContext<TabContextValue | null>(null)

const useTabContext = () => {
  const context = useContext(TabContext)
  if (!context) {
    throw new Error('Tab compound components must be used within a Tab component')
  }
  return context
}

/**
 * KRDS Tab Root Component
 * @param value 활성 탭 값 (제어 모드)
 * @param defaultValue 기본 활성 탭 값 (비제어 모드)
 * @param onValueChange 탭 변경 콜백
 * @param variant 탭 변형 ('line' | 'fill')
 * @param size 탭 크기 ('normal' | 'full')
 * @param children 자식 컴포넌트
 * @param className 커스텀 클래스명
 */
export const Tab = forwardRef<HTMLDivElement, TabProps>(
  ({ value, defaultValue, onValueChange, variant = 'line', size = 'full', children, className, ...props }, ref) => {
    const triggerRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map())
    const triggerOrder = useRef<string[]>([])

    const [_activeValue, setActiveValue] = useUncontrolled({
      value,
      defaultValue,
      onChange: onValueChange,
      finalValue: ''
    })

    const registerTrigger = useCallback((element: HTMLButtonElement | null, value: string) => {
      if (element) {
        if (!triggerRefs.current.has(value)) {
          triggerOrder.current.push(value)
        }
        triggerRefs.current.set(value, element)
      } else {
        triggerRefs.current.delete(value)
        triggerOrder.current = triggerOrder.current.filter(v => v !== value)
      }

      return triggerOrder.current.indexOf(value)
    }, [])

    const contextValue: TabContextValue = {
      activeValue: _activeValue,
      onValueChange: setActiveValue,
      variant,
      size,
      registerTrigger,
      triggerOrder,
      triggerRefs
    }

    return (
      <TabContext.Provider value={contextValue}>
        <div ref={ref} className={classNames('krds-tab-area', className)} {...props}>
          {children}
        </div>
      </TabContext.Provider>
    )
  }
)

/**
 * KRDS TabList Component
 * @param children 자식 컴포넌트 (TabTrigger들)
 * @param className 커스텀 클래스명
 */
export const TabList = forwardRef<HTMLUListElement, TabListProps>(({ children, className, ...props }, ref) => {
  const { variant, size } = useTabContext()

  const tabClasses = classNames('tab', variant, size === 'full' && 'full')

  return (
    <div className={tabClasses}>
      <ul ref={ref} role="tablist" className={className} {...props}>
        {children}
      </ul>
    </div>
  )
})

/**
 * KRDS TabTrigger Component
 * @param value 탭 값
 * @param children 자식 컴포넌트
 * @param className 커스텀 클래스명
 */
export const TabTrigger = forwardRef<HTMLButtonElement, TabTriggerProps>(({ value, children, className, disabled, ...props }, ref) => {
  const { activeValue, onValueChange, registerTrigger, triggerOrder, triggerRefs } = useTabContext()

  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [triggerIndex, setTriggerIndex] = useState(-1)

  const isActive = activeValue === value

  const handleRef = useCallback(
    (element: HTMLButtonElement | null) => {
      buttonRef.current = element
      const index = registerTrigger(element, value)
      setTriggerIndex(index)

      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    },
    [value, registerTrigger, ref]
  )

  const handleClick = useCallback(() => {
    if (disabled) return
    onValueChange?.(value)
  }, [value, onValueChange, disabled])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (triggerIndex === -1) return

      const totalTriggers = triggerOrder.current?.length || 0
      let newIndex: number | null = null

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault()
          newIndex = triggerIndex + 1 >= totalTriggers ? 0 : triggerIndex + 1
          break
        case 'ArrowLeft':
          event.preventDefault()
          newIndex = triggerIndex - 1 < 0 ? totalTriggers - 1 : triggerIndex - 1
          break
        case 'Home':
          event.preventDefault()
          newIndex = 0
          break
        case 'End':
          event.preventDefault()
          newIndex = totalTriggers - 1
          break
      }

      if (newIndex !== null && newIndex !== triggerIndex) {
        const targetValue = triggerOrder.current?.[newIndex] || ''
        const targetElement = triggerRefs.current?.get(targetValue)
        targetElement?.focus()
      }
    },
    [triggerIndex, triggerOrder, triggerRefs]
  )

  const tabId = `tab_${value}`
  const panelId = `panel_${value}`

  return (
    <li role="presentation" className={classNames('tab-item', isActive && 'active')}>
      <button
        role="tab"
        id={tabId}
        ref={handleRef}
        aria-selected={isActive}
        aria-controls={panelId}
        type="button"
        className={classNames('btn-tab', className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        {...props}
      >
        {children}
        {isActive && <i className="sr-only">선택됨</i>}
      </button>
    </li>
  )
})

export const TabContent = forwardRef<HTMLDivElement, TabContentProps>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={classNames('tab-conts-wrap', className)} {...props}>
      {children}
    </div>
  )
})

/**
 * KRDS TabPanel Component
 * @param value 탭 값
 * @param children 자식 컴포넌트
 * @param className 커스텀 클래스명
 */
export const TabPanel = forwardRef<HTMLElement, TabPanelProps>(({ value, children, className, ...props }, ref) => {
  const { activeValue } = useTabContext()
  const isActive = activeValue === value

  const tabId = `tab_${value}`
  const panelId = `panel_${value}`

  const panelClassName = classNames('tab-conts', isActive && 'active', className)

  return (
    <section ref={ref} id={panelId} role="tabpanel" aria-labelledby={tabId} className={panelClassName} {...props}>
      {children}
    </section>
  )
})

Tab.displayName = 'Tab'
TabList.displayName = 'TabList'
TabTrigger.displayName = 'TabTrigger'
TabPanel.displayName = 'TabPanel'
