import Button from '@/components/Button'
import { classNames } from '@/utils'
import { forwardRef, useEffect, useState } from 'react'
import { InPageNavigationProps } from './InPageNavigation.types'

/**
 * KRDS InPageNavigation Component
 * @param caption 페이지 구성 설명 텍스트
 * @param title 페이지 제목
 * @param items 네비게이션 아이템 목록
 * @param actionText 액션 버튼 텍스트
 * @param onActionClick 액션 버튼 클릭 핸들러
 * @param infoText 추가 정보 텍스트 (HTML 태그 지원)
 * @param scrollDown 스크롤 시 상단 위치 조정 여부
 * @param scrollContainerRef 스크롤 컨테이너 참조
 */
export const InPageNavigation = forwardRef<HTMLDivElement, InPageNavigationProps>(
  (
    {
      caption = '이 페이지의 구성',
      title,
      items = [],
      actionText,
      onActionClick,
      infoText,
      scrollDown = false,
      className,
      scrollContainerRef,
      ...props
    },
    ref
  ) => {
    const [activeSection, setActiveSection] = useState<string>('')

    const hasAction = actionText || infoText
    const hasItems = items.length > 0

    const calculateHeaderHeight = () => {
      const headerTop = document.querySelector('#krds-masthead')?.clientHeight || 0
      const headerInner = document.querySelector('#krds-header .header-in')?.clientHeight || 0
      return headerTop + headerInner
    }

    const applyScroll = (target: Element, event: React.MouseEvent | React.KeyboardEvent) => {
      event.preventDefault()
      const headerHeight = calculateHeaderHeight()

      const scrollContainer = scrollContainerRef?.current ?? window
      const isWindow = scrollContainer === window

      if (isWindow) {
        const targetRect = target.getBoundingClientRect()
        const scrollTop = targetRect.top + window.scrollY - headerHeight

        window.scrollTo({
          left: 0,
          top: scrollTop,
          behavior: 'smooth'
        })
      } else {
        const containerElement = scrollContainer as Element
        const containerRect = containerElement.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()
        const relativeTop = targetRect.top - containerRect.top
        const scrollTop = containerElement.scrollTop + relativeTop - headerHeight

        containerElement.scrollTo({
          left: 0,
          top: scrollTop,
          behavior: 'smooth'
        })
      }

      if ('key' in event && (event.key === 'Enter' || event.key === ' ')) {
        const focusable = target.querySelector('.sec-tit')
        if (focusable) {
          ;(focusable as HTMLElement).setAttribute('tabindex', '-1')
          ;(focusable as HTMLElement).focus({ preventScroll: true })
        }
      }
    }

    const handleNavigationClick = (href: string, event: React.MouseEvent | React.KeyboardEvent) => {
      const target = document.querySelector(href)
      if (target) {
        applyScroll(target, event)
      }
    }

    const handleKeyDown = (href: string, event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleNavigationClick(href, event)
      }
    }

    const updateActiveSection = () => {
      if (!hasItems) return

      const scrollContainer = scrollContainerRef?.current ?? window
      const isWindow = scrollContainer === window

      const scrollTop = isWindow ? window.scrollY : (scrollContainer as Element).scrollTop
      const containerHeight = isWindow ? window.innerHeight : (scrollContainer as Element).clientHeight
      const scrollHeight = isWindow ? document.body.scrollHeight : (scrollContainer as Element).scrollHeight

      const topHeight = Math.ceil(containerHeight / 5)
      const scrollBottom = scrollTop + containerHeight

      const sectionElements = items.map(item => document.querySelector(item.href)).filter(Boolean) as HTMLElement[]

      if (sectionElements.length === 0) return

      const firstSection = sectionElements[0]
      const firstSectionTop = firstSection.offsetTop

      let newActiveSection = ''

      if (scrollBottom >= scrollHeight) {
        newActiveSection = items[items.length - 1]?.href || ''
      } else if (scrollTop <= firstSectionTop) {
        newActiveSection = items[0]?.href || ''
      } else {
        for (let i = sectionElements.length - 1; i >= 0; i--) {
          const section = sectionElements[i]
          const sectionHeight = section.offsetHeight
          const sectionTop = section.offsetTop - topHeight

          if (scrollTop > sectionTop && scrollTop <= sectionTop + sectionHeight) {
            newActiveSection = items[i]?.href || ''
            break
          }
        }
      }

      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection)
      }
    }

    useEffect(() => {
      if (!hasItems) return

      updateActiveSection()

      const handleScroll = () => {
        updateActiveSection()
      }

      const scrollContainer = scrollContainerRef?.current ?? window

      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
    }, [hasItems, items, activeSection])

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return scrollDown ? <div className="scroll-down">{children}</div> : <>{children}</>
    }

    return (
      <Wrapper>
        <div ref={ref} className="krds-in-page-navigation-type">
          <div className={classNames('krds-in-page-navigation-area', className)} {...props}>
            <div className="in-page-navigation-header">
              <p className="quick-caption">{caption}</p>
              {title && <p className="quick-title">{title}</p>}
            </div>

            {hasItems && (
              <nav className="in-page-navigation-list">
                <ul>
                  {items.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className={classNames((item.active || activeSection === item.href) && 'active')}
                        onClick={e => handleNavigationClick(item.href, e)}
                        onKeyDown={e => handleKeyDown(item.href, e)}
                        tabIndex={0}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {hasAction && (
              <div className="in-page-navigation-action">
                {actionText && (
                  <Button className="krds-btn medium" onClick={onActionClick}>
                    {actionText}
                  </Button>
                )}
                {infoText && <p className="quick-info">{infoText}</p>}
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    )
  }
)

InPageNavigation.displayName = 'InPageNavigation'
