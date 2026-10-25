import React, { useRef, useState, useEffect, forwardRef, cloneElement, isValidElement, useId } from 'react'
import { classNames } from '@/utils'
import { TooltipProps } from './Tooltip.types'

/**
 * KRDS Tooltip Component
 * @param text 툴팁에 표시될 텍스트
 * @param variant 툴팁 방향 ('vertical' | 'horizontal' | 'box')
 * @param className 추가 클래스명
 */
const Tooltip = forwardRef<HTMLElement, TooltipProps>(({ children, text, variant = 'vertical', className }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    isTop: false,
    isBottom: false,
    isLeft: false,
    isRight: false,
    isMobileSmall: false
  })
  const triggerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const contentId = `tooltip-popover-${useId()}`

  const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return

    const tooltipGap = 12
    const { clientHeight: tooltipHeight, clientWidth: tooltipWidth } = contentRef.current
    const {
      top: itemTop,
      left: itemLeft,
      right: itemRight,
      height: itemHeight,
      width: itemWidth
    } = triggerRef.current.getBoundingClientRect()
    const halfWindowWidth = window.innerWidth / 2
    const halfWindowHeight = window.innerHeight / 2

    let tooltipTop: number
    let tooltipLeft: number
    let isTop = false
    let isBottom = false
    let isLeft = false
    let isRight = false

    const isMobile = window.innerWidth <= 768
    const isVertical = isMobile || variant === 'box' || variant === 'vertical'

    if (isVertical) {
      if (itemTop + itemHeight > halfWindowHeight) {
        tooltipTop = itemTop - tooltipHeight - tooltipGap
        isTop = true
      } else {
        tooltipTop = itemTop + itemHeight + tooltipGap
        isBottom = true
      }
      if (itemLeft + itemWidth > halfWindowWidth) {
        tooltipLeft = itemRight - tooltipWidth
        isRight = true
        if (window.innerWidth - (itemLeft + itemWidth) > tooltipWidth / 2) {
          tooltipLeft = itemLeft + (itemWidth - tooltipWidth) / 2
          isRight = false
        }
      } else {
        tooltipLeft = itemLeft + (itemWidth - tooltipWidth) / 2
        if (tooltipLeft < 0) {
          tooltipLeft = itemLeft
          isLeft = true
        }
      }
    } else {
      tooltipTop = itemTop + (itemHeight - tooltipHeight) / 2
      if (itemLeft + itemWidth > halfWindowWidth) {
        tooltipLeft = itemLeft - tooltipWidth - tooltipGap
        isRight = true
      } else {
        tooltipLeft = itemRight + tooltipGap
      }
    }

    const mobileSmall = window.innerWidth <= 420
    if (mobileSmall) {
      tooltipLeft = window.innerWidth / 2
    }

    setPosition({
      top: tooltipTop,
      left: tooltipLeft,
      isTop,
      isBottom,
      isLeft,
      isRight,
      isMobileSmall: mobileSmall
    })
  }, [variant])

  const showTooltip = () => {
    setIsOpen(true)
  }

  const hideTooltip = () => {
    setIsOpen(false)
    setPosition({
      top: 0,
      left: 0,
      isTop: false,
      isBottom: false,
      isLeft: false,
      isRight: false,
      isMobileSmall: false
    })
  }

  useEffect(() => {
    if (isOpen) {
      calculatePosition()
    }
  }, [isOpen, calculatePosition])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        hideTooltip()
      }
    }

    const handleScroll = () => {
      hideTooltip()
    }

    const handleResize = () => {
      hideTooltip()
    }

    document.addEventListener('keydown', handleEscape)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    showTooltip()
    if (isValidElement(children)) {
      const childElement = children as React.ReactElement<{
        onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void
      }>
      if (childElement.props.onMouseEnter) {
        childElement.props.onMouseEnter(event)
      }
    }
  }

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    hideTooltip()
    if (isValidElement(children)) {
      const childElement = children as React.ReactElement<{
        onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void
      }>
      if (childElement.props.onMouseLeave) {
        childElement.props.onMouseLeave(event)
      }
    }
  }

  const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
    showTooltip()
    if (isValidElement(children)) {
      const childElement = children as React.ReactElement<{
        onFocus?: (event: React.FocusEvent<HTMLElement>) => void
      }>
      if (childElement.props.onFocus) {
        childElement.props.onFocus(event)
      }
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    hideTooltip()
    if (isValidElement(children)) {
      const childElement = children as React.ReactElement<{
        onBlur?: (event: React.FocusEvent<HTMLElement>) => void
      }>
      if (childElement.props.onBlur) {
        childElement.props.onBlur(event)
      }
    }
  }

  const mergedRef = (node: HTMLElement | null) => {
    if (triggerRef) {
      ;(triggerRef as React.MutableRefObject<HTMLElement | null>).current = node
    }
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }

  if (isValidElement(children)) {
    const childElement = children as React.ReactElement<{
      className?: string
      onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void
      onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void
      onFocus?: (event: React.FocusEvent<HTMLElement>) => void
      onBlur?: (event: React.FocusEvent<HTMLElement>) => void
    }>

    return (
      <>
        {cloneElement(childElement, {
          // @ts-expect-error - valid ref
          ref: mergedRef,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          onFocus: handleFocus,
          onBlur: handleBlur,
          className: classNames('krds-tooltip', className, childElement.props.className),
          'data-tooltip': text,
          'aria-labelledby': contentId
        })}
        <div
          ref={contentRef}
          id={contentId}
          className={classNames(
            'krds-tooltip-popover',
            variant === 'box' && 'tooltip-box',
            variant === 'vertical' && 'tooltip-vertical',
            isOpen && 'active',
            position.isTop && 'top',
            position.isBottom && 'bottom',
            position.isLeft && 'left',
            position.isRight && 'right'
          )}
          style={{
            ...(isOpen && {
              top: `${position.top}px`,
              left: position.isMobileSmall ? '50%' : `${position.left}px`,
              transform: position.isMobileSmall ? 'translateX(-50%)' : undefined
            })
          }}
          aria-hidden={!isOpen}
        >
          {text}
        </div>
      </>
    )
  }

  return (
    <>
      <button
        ref={mergedRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={classNames('krds-tooltip', className)}
        data-tooltip={text}
        aria-labelledby={contentId}
      >
        {children}
      </button>
      <div
        ref={contentRef}
        id={contentId}
        className={classNames(
          'krds-tooltip-popover',
          variant === 'box' && 'tooltip-box',
          variant === 'vertical' && 'tooltip-vertical',
          isOpen && 'active',
          position.isTop && 'top',
          position.isBottom && 'bottom',
          position.isLeft && 'left',
          position.isRight && 'right'
        )}
        style={{
          ...(isOpen && {
            top: `${position.top}px`,
            left: position.isMobileSmall ? '50%' : `${position.left}px`,
            transform: position.isMobileSmall ? 'translateX(-50%)' : undefined
          })
        }}
        aria-hidden={!isOpen}
      >
        {text}
      </div>
    </>
  )
})

Tooltip.displayName = 'Tooltip'

export default Tooltip
