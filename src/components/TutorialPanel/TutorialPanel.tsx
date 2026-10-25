import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { classNames } from '@/utils'
import { createContext, forwardRef, HTMLAttributes, useCallback, useContext, useEffect, useRef } from 'react'
import Button from '../Button/Button'
import { Disclosure } from '../Disclosure'
import { Tab, TabContent, TabList, TabPanel, TabTrigger } from '../Tab'
import {
  TutorialPanelCloseProps,
  TutorialPanelContainerProps,
  TutorialPanelContextValue,
  TutorialPanelHelpContentProps,
  TutorialPanelRootProps,
  TutorialPanelTabContentProps,
  TutorialPanelTriggerProps,
  TutorialPanelTutorialContentProps
} from './TutorialPanel.types'

const TutorialPanelContext = createContext<TutorialPanelContextValue | null>(null)

const useTutorialPanelContext = () => {
  const context = useContext(TutorialPanelContext)
  if (!context) {
    throw new Error('TutorialPanel 컴포넌트들은 TutorialPanel.Root 내부에서 사용해야 합니다.')
  }
  return context
}

/**
 * KRDS TutorialPanel Root Component
 * @param isOpen 패널 열림/닫힘 상태
 * @param onOpenChange 패널 열림/닫힘 핸들러
 * @param activeTab 활성 탭 ('help' | 'tutorial') (controlled에서만 사용)
 * @param defaultActiveTab 활성 탭 ('help' | 'tutorial') (uncontrolled에서 사용)
 * @param onTabChange 탭 변경 핸들러
 */
const TutorialPanelRoot = forwardRef<HTMLDivElement, TutorialPanelRootProps>(
  ({ isOpen, onOpenChange, activeTab, defaultActiveTab, onTabChange, children, className, ...props }, ref) => {
    const [internalIsOpen, setInternalIsOpen] = useUncontrolled({
      value: isOpen,
      defaultValue: false,
      onChange: onOpenChange,
      finalValue: false
    })

    const [internalActiveTab, setInternalActiveTab] = useUncontrolled({
      value: activeTab,
      defaultValue: defaultActiveTab,
      onChange: onTabChange,
      finalValue: 'help' as 'help' | 'tutorial'
    })

    const helpWrapRef = useRef<HTMLDivElement>(null)
    const expandButtonRef = useRef<HTMLButtonElement>(null)
    const collapseButtonRef = useRef<HTMLButtonElement>(null)
    const lastFocusedButtonRef = useRef<HTMLElement | null>(null)
    const intersectionObserverRef = useRef<IntersectionObserver | null>(null)

    const getWindowSize = useCallback(() => {
      return window.innerWidth <= 1023 ? 'mob' : 'pc'
    }, [])

    const setupPadding = useCallback(() => {
      const topBannerHeight = document.querySelector('#krds-masthead')?.clientHeight || 0
      const headerHeight = document.querySelector('#krds-header .header-in')?.clientHeight || 0
      const defaultPadding = topBannerHeight + headerHeight
      const hiddenBannerPadding = headerHeight

      const expandButton = expandButtonRef.current
      const expandBox = helpWrapRef.current
      const collapseButton = collapseButtonRef.current

      if (!expandButton || !expandBox || !collapseButton) return

      const applyPadding = (padding: string) => {
        expandButton.style.marginTop = padding
        if (getWindowSize() === 'pc') {
          expandBox.style.paddingTop = padding
          collapseButton.style.marginTop = padding
        } else {
          expandBox.removeAttribute('style')
          collapseButton.removeAttribute('style')
        }
      }

      if (document.body.classList.contains('bn-hidden')) {
        if (document.querySelector('#wrap')?.classList.contains('scroll-down')) {
          applyPadding('0')
        } else {
          applyPadding(`${hiddenBannerPadding}px`)
        }
      } else {
        applyPadding(`${defaultPadding}px`)
      }
    }, [getWindowSize])

    const observeMastHead = useCallback(() => {
      const topBanner = document.querySelector('#krds-masthead')
      if (!topBanner) return

      const body = document.body
      intersectionObserverRef.current = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            body.classList.toggle('bn-hidden', !entry.isIntersecting)
            setupPadding()
          })
        },
        { root: null, threshold: 0 }
      )
      intersectionObserverRef.current.observe(topBanner)
    }, [setupPadding])

    const handleToggle = useCallback(
      (newIsOpen: boolean) => {
        const helpWrap = helpWrapRef.current
        const innerContainer = document.querySelector('#container > .inner')

        if (newIsOpen) {
          if (getWindowSize() === 'mob') {
            document.body.classList.add('scroll-no')
          }

          if (helpWrap) {
            helpWrap.setAttribute('tabindex', '0')
            setTimeout(() => {
              helpWrap.focus()
            }, 50)
          }

          const expandButtons = document.querySelectorAll('.btn-help-exec')
          expandButtons.forEach(btn => {
            btn.setAttribute('aria-expanded', 'true')
          })

          if (innerContainer?.classList.contains('help-panel-flexible')) {
            innerContainer.classList.add('help-panel-expanded')
          }
        } else {
          if (getWindowSize() === 'mob') {
            document.body.classList.remove('scroll-no')
          }

          if (helpWrap) {
            helpWrap.removeAttribute('tabindex')
          }

          if (lastFocusedButtonRef.current) {
            lastFocusedButtonRef.current.focus()
          } else {
            expandButtonRef.current?.focus()
          }

          const expandButtons = document.querySelectorAll('.btn-help-exec')
          expandButtons.forEach(btn => {
            btn.setAttribute('aria-expanded', 'false')
          })

          if (innerContainer?.classList.contains('help-panel-flexible')) {
            innerContainer.classList.remove('help-panel-expanded')
          }
        }

        setInternalIsOpen(newIsOpen)
      },
      [getWindowSize, setInternalIsOpen]
    )

    const contextValue: TutorialPanelContextValue = {
      isOpen: internalIsOpen,
      onOpenChange: handleToggle,
      activeTab: internalActiveTab,
      onTabChange: setInternalActiveTab
    }

    useEffect(() => {
      setupPadding()
      observeMastHead()

      const handleResize = () => {
        setupPadding()
        if (getWindowSize() === 'mob' && internalIsOpen) {
          document.body.classList.add('scroll-no')
        } else {
          document.body.classList.remove('scroll-no')
        }
      }

      window.addEventListener('resize', handleResize)

      if (expandButtonRef.current) {
        expandButtonRef.current.setAttribute('aria-expanded', internalIsOpen ? 'true' : 'false')
      }

      return () => {
        window.removeEventListener('resize', handleResize)
        if (intersectionObserverRef.current) {
          intersectionObserverRef.current.disconnect()
        }
        document.body.classList.remove('scroll-no')
      }
    }, [setupPadding, observeMastHead, internalIsOpen, getWindowSize])

    return (
      <TutorialPanelContext.Provider value={contextValue}>
        <div id="container" ref={ref} className={classNames('inner help-panel-flexible', className)} {...props}>
          {children}
        </div>
      </TutorialPanelContext.Provider>
    )
  }
)

/**
 * KRDS TutorialPanel Trigger Component
 * @param children 버튼 내용
 */
const TutorialPanelTrigger = forwardRef<HTMLButtonElement, TutorialPanelTriggerProps>(
  ({ children = '도움말', className, onClick, ...props }, ref) => {
    const { isOpen, onOpenChange } = useTutorialPanelContext()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onOpenChange(!isOpen)
      onClick?.(event)
    }

    const renderIcon = (iconName: string) => {
      return <i className={`svg-icon ${iconName}`}></i>
    }

    return (
      <Button
        ref={ref}
        size="small"
        variant="tertiary"
        className={classNames('btn-help-panel expand btn-help-exec', className)}
        onClick={handleClick}
        aria-expanded={isOpen}
        aria-label={typeof children === 'string' ? children : '도움말'}
        {...props}
      >
        {renderIcon('ico-fold')} {children}
      </Button>
    )
  }
)

/**
 * KRDS TutorialPanel Container Component
 */
const TutorialPanelContainer = forwardRef<HTMLDivElement, TutorialPanelContainerProps>(({ children, className, ...props }, ref) => {
  const { isOpen } = useTutorialPanelContext()

  return (
    <div ref={ref} className={classNames('krds-help-panel', isOpen && 'expand', className)} {...props}>
      <div className="help-panel-wrap">
        <div className="help-conts-area">{children}</div>
      </div>
    </div>
  )
})

/**
 * KRDS TutorialPanel Tabs Component
 * 탭 네비게이션과 컨텐츠를 관리합니다
 */
const TutorialPanelTabs = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ children, className, id, role }, ref) => {
  const { activeTab, onTabChange } = useTutorialPanelContext()

  return (
    <Tab
      ref={ref}
      value={activeTab}
      onValueChange={value => onTabChange(value as 'help' | 'tutorial')}
      variant="line"
      size="normal"
      className={classNames('layer', className)}
      id={id}
      role={role}
    >
      <TabList>
        <TabTrigger value="help">도움</TabTrigger>
        <TabTrigger value="tutorial">따라하기</TabTrigger>
      </TabList>

      <TabContent>{children}</TabContent>
    </Tab>
  )
})

/**
 * KRDS TutorialPanel TabPanel Component
 * @param value 탭 값 ('help' | 'tutorial')
 * @param children 탭 내용
 */
const TutorialPanelTabPanel = forwardRef<HTMLElement, TutorialPanelTabContentProps>(({ value, children, className, ...props }, ref) => {
  return (
    <TabPanel ref={ref} value={value} className={className} {...props}>
      <h3 className="sr-only">{value === 'help' ? '도움' : '따라하기'}</h3>
      {children}
    </TabPanel>
  )
})

/**
 * KRDS TutorialPanel Help Content Component
 * @param helpContent 도움말 내용
 * @param relatedServices 관련 서비스 내용
 */
const TutorialPanelHelpContent = forwardRef<HTMLDivElement, TutorialPanelHelpContentProps>(
  ({ helpContent, relatedServices = [], className, ...props }, ref) => {
    const renderIcon = (iconName: string) => {
      return <i className={`svg-icon ${iconName}`}></i>
    }

    return (
      <div ref={ref} className={classNames('help-conts-area-inner', className)} {...props}>
        {helpContent && (
          <div className="conts-area help-conts">
            <div className="conts-wrap">
              <h4 className="help-title">
                {helpContent.title}
                <span className="krds-btn medium icon">
                  <span className="sr-only">도움말</span>
                  {renderIcon('ico-help')}
                </span>
              </h4>
              {helpContent.description && <div className="conts-desc">{helpContent.description}</div>}
              {helpContent.links && helpContent.links.length > 0 && (
                <ul className="link-list">
                  {helpContent.links.map((link, index) => (
                    <li key={index}>
                      <Button
                        as="a"
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        title={link.external ? '새 창 열림' : undefined}
                        size="xsmall"
                        variant="link"
                        className="basic"
                      >
                        {link.icon && link.iconPosition === 'left' && renderIcon(link.icon)}
                        {link.label}
                        {link.icon && link.iconPosition !== 'left' && renderIcon(link.icon)}
                        {!link.icon && (link.external ? renderIcon('ico-go') : renderIcon('ico-angle right'))}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {relatedServices.length > 0 && (
          <div className="conts-area related-service">
            {relatedServices.map((service, serviceIndex) => (
              <div key={serviceIndex} className="conts-wrap">
                <h4 className="help-title">{service.title}</h4>
                {service.description && <div className="conts-desc">{service.description}</div>}
                {service.links && service.links.length > 0 && (
                  <ul className="link-list">
                    {service.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Button
                          as="a"
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          title={link.external ? '새 창 열림' : undefined}
                          size="xsmall"
                          variant="link"
                          className="basic"
                        >
                          {link.icon && link.iconPosition === 'left' && renderIcon(link.icon)}
                          {link.label}
                          {link.icon && link.iconPosition !== 'left' && renderIcon(link.icon)}
                          {!link.icon && (link.external ? renderIcon('ico-go') : renderIcon('ico-angle right'))}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

/**
 * KRDS TutorialPanel Tutorial Content Component
 * @param title 튜토리얼 제목
 * @param steps 튜토리얼 단계들
 * @param onTutorialStop 튜토리얼 종료 핸들러
 * @param stopButtonText 종료 버튼 텍스트
 */
const TutorialPanelTutorialContent = forwardRef<HTMLDivElement, TutorialPanelTutorialContentProps>(
  ({ title, steps = [], onTutorialStop, stopButtonText = '그만 따라하기', className, ...props }, ref) => {
    return (
      <div ref={ref} className={classNames('help-conts-area-inner', className)} {...props}>
        <div className="conts-area">
          {title && (
            <h4 className="help-title">
              <a href="#" title="이전으로 돌아가기">
                {title}
              </a>
            </h4>
          )}
          {steps.length > 0 && (
            <ul className="coach-help-process">
              {steps.map((step, index) => (
                <li key={index}>
                  <h4 className={classNames('tit', step.current && 'current')}>{step.title}</h4>
                  {step.steps && step.steps.length > 0 && (
                    <Disclosure buttonText={`전체 ${step.steps.length}단계`} className="conts-expand-area">
                      <ul className="krds-info-list decimal">
                        {step.steps.map((stepItem, stepIndex) => (
                          <li key={stepIndex}>{stepItem}</li>
                        ))}
                      </ul>
                    </Disclosure>
                  )}
                  {step.content && <div className="step-content">{step.content}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="help-panel-action">
          <Button size="medium" variant="secondary" className="coach-btn-stop" onClick={onTutorialStop}>
            {stopButtonText}
          </Button>
        </div>
      </div>
    )
  }
)

/**
 * KRDS TutorialPanel Close Component
 * @param children 버튼 내용
 */
const TutorialPanelClose = forwardRef<HTMLButtonElement, TutorialPanelCloseProps>(({ children, className, onClick, ...props }, ref) => {
  const { onOpenChange } = useTutorialPanelContext()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onOpenChange(false)
    onClick?.(event)
  }

  const renderIcon = (iconName: string) => {
    return <i className={`svg-icon ${iconName}`}></i>
  }

  return (
    <Button
      ref={ref}
      size="small"
      variant="tertiary"
      className={classNames('btn-help-panel fold', className)}
      onClick={handleClick}
      {...props}
    >
      {children || (
        <>
          <span className="sr-only">도움말</span> 접어두기 {renderIcon('ico-fold right')}
        </>
      )}
    </Button>
  )
})

TutorialPanelRoot.displayName = 'TutorialPanel.Root'
TutorialPanelTrigger.displayName = 'TutorialPanel.Trigger'
TutorialPanelContainer.displayName = 'TutorialPanel.Container'
TutorialPanelTabs.displayName = 'TutorialPanel.Tabs'
TutorialPanelTabPanel.displayName = 'TutorialPanel.TabPanel'
TutorialPanelHelpContent.displayName = 'TutorialPanel.HelpContent'
TutorialPanelTutorialContent.displayName = 'TutorialPanel.TutorialContent'
TutorialPanelClose.displayName = 'TutorialPanel.Close'

export const TutorialPanel = Object.assign(TutorialPanelRoot, {
  Root: TutorialPanelRoot,
  Trigger: TutorialPanelTrigger,
  Container: TutorialPanelContainer,
  Tabs: TutorialPanelTabs,
  TabPanel: TutorialPanelTabPanel,
  HelpContent: TutorialPanelHelpContent,
  TutorialContent: TutorialPanelTutorialContent,
  Close: TutorialPanelClose
})

export default TutorialPanel
