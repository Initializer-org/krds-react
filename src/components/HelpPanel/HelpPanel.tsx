import Button from '@/components/Button'
import { Disclosure } from '@/components/Disclosure'
import { TextList, TextListItem } from '@/components/TextList'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { classNames } from '@/utils'
import React, { createContext, forwardRef, useCallback, useContext, useEffect, useId, useMemo, useRef } from 'react'
import {
  HelpLinkListProps,
  HelpPanelCloseProps,
  HelpPanelContentProps,
  HelpPanelContextValue,
  HelpPanelProps,
  HelpPanelTriggerProps,
  HelpSectionProps
} from './HelpPanel.types'

const HelpPanelContext = createContext<HelpPanelContextValue | null>(null)

const useHelpPanelContext = () => useContext(HelpPanelContext)

/**
 * KRDS HelpPanel Component
 * @param isOpen 도움말 패널 열림 상태
 * @param defaultOpen 비제어 상태에서 사용할 초기 열림 상태
 * @param onOpenChange 도움말 패널 열림/닫힘 상태 변경 핸들러
 * @param className 사용자 정의 클래스명
 */
const HelpPanel = forwardRef<HTMLDivElement, HelpPanelProps>(
  ({ isOpen, defaultOpen = false, onOpenChange, children, className, ...props }, ref) => {
    const [openState, setOpenState] = useUncontrolled<boolean>({
      value: isOpen,
      defaultValue: defaultOpen,
      onChange: onOpenChange
    })

    const helpPanelRef = useRef<HTMLDivElement | null>(null)
    const lastFocusedElementRef = useRef<HTMLElement | null>(null)
    const previousIsOpenRef = useRef<boolean>(Boolean(openState))
    const panelId = useId()

    const childArray = React.Children.toArray(children)
    const triggerElements: React.ReactNode[] = []
    const panelChildren = childArray.filter(child => {
      if (!React.isValidElement(child)) {
        return true
      }

      const elementType = child.type as { displayName?: string; name?: string }
      const displayName =
        typeof elementType === 'function' || typeof elementType === 'object' ? (elementType.displayName ?? elementType.name) : undefined

      if (elementType === HelpPanelTrigger || displayName === 'HelpPanelTrigger') {
        triggerElements.push(child)
        return false
      }

      return true
    })

    const setOpen = useCallback(
      (nextOpen: boolean) => {
        if (nextOpen) {
          lastFocusedElementRef.current = document.activeElement as HTMLElement | null
        }
        setOpenState(nextOpen)
      },
      [setOpenState]
    )

    const open = useCallback(() => setOpen(true), [setOpen])
    const close = useCallback(() => setOpen(false), [setOpen])
    const toggle = useCallback(() => setOpen(!openState), [openState, setOpen])

    useEffect(() => {
      const helpPanel = helpPanelRef.current
      if (!helpPanel) {
        return
      }

      const nextIsOpen = Boolean(openState)

      if (nextIsOpen && !previousIsOpenRef.current) {
        if (!lastFocusedElementRef.current) {
          lastFocusedElementRef.current = document.activeElement as HTMLElement | null
        }

        const focusableElements = helpPanel.querySelectorAll('a, button, [tabindex="0"], input, textarea, select')
        if (focusableElements.length > 0) {
          ;(focusableElements[0] as HTMLElement).focus()
        }
      }

      if (!nextIsOpen && previousIsOpenRef.current) {
        lastFocusedElementRef.current?.focus?.()
        lastFocusedElementRef.current = null
      }

      previousIsOpenRef.current = nextIsOpen
    }, [openState])

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    const contextValue = useMemo<HelpPanelContextValue>(
      () => ({
        isOpen: Boolean(openState),
        open,
        close,
        toggle,
        setOpen,
        panelId,
        lastFocusedElementRef
      }),
      [openState, open, close, toggle, setOpen, panelId]
    )

    const helpPanelClasses = classNames('krds-help-panel', className, contextValue.isOpen && 'expand')

    return (
      <HelpPanelContext.Provider value={contextValue}>
        {triggerElements}
        <div
          ref={node => {
            helpPanelRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          id={panelId}
          className={helpPanelClasses}
          onKeyDown={handleKeyDown}
          {...props}
        >
          <div className="help-panel-wrap">
            <div className="help-conts-area">{panelChildren}</div>
          </div>
        </div>
      </HelpPanelContext.Provider>
    )
  }
)

HelpPanel.displayName = 'HelpPanel'

/**
 * KRDS HelpPanelTrigger Component
 * @param children 트리거 버튼 텍스트
 * @param className 사용자 정의 클래스명
 */
const HelpPanelTrigger = forwardRef<HTMLButtonElement, HelpPanelTriggerProps>(
  ({ children = '도움말', className, onClick, ...props }, ref) => {
    const context = useHelpPanelContext()
    const buttonClasses = classNames('btn-help-panel', 'expand', 'btn-help-exec', className)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)

      if (!event.defaultPrevented) {
        context?.open()
      }
    }

    return (
      <Button
        size="small"
        variant="tertiary"
        className={buttonClasses}
        ref={ref}
        onClick={handleClick}
        aria-expanded={context?.isOpen ?? false}
        aria-controls={context?.panelId}
        {...props}
      >
        <i className="svg-icon ico-fold"></i>
        {children}
      </Button>
    )
  }
)

HelpPanelTrigger.displayName = 'HelpPanelTrigger'

/**
 * KRDS HelpPanelContent Component
 * @param children 도움말 패널 내용
 * @param srOnlyTitle 스크린 리더 전용 제목
 * @param className 사용자 정의 클래스명
 */
const HelpPanelContent = forwardRef<HTMLDivElement, HelpPanelContentProps>(({ children, srOnlyTitle, className, ...props }, ref) => {
  const contentClasses = classNames('help-conts-area-inner', className)

  return (
    <div className={contentClasses} ref={ref} {...props}>
      {srOnlyTitle && <h3 className="sr-only">{srOnlyTitle}</h3>}
      {children}
    </div>
  )
})

HelpPanelContent.displayName = 'HelpPanelContent'

/**
 * KRDS HelpSection Component
 * @param title 섹션 제목
 * @param description 섹션 설명
 * @param children 섹션 내용
 * @param className 사용자 정의 클래스명
 */
const HelpSection = forwardRef<HTMLDivElement, HelpSectionProps>(({ title, description, children, className, ...props }, ref) => {
  const sectionClasses = classNames('conts-area', 'help-conts', className)

  return (
    <div className={sectionClasses} ref={ref} {...props}>
      <div className="conts-wrap">
        <h4 className="help-title">
          {title}
          <span className="krds-btn medium icon">
            <span className="sr-only">도움말</span>
            <i className="svg-icon ico-help"></i>
          </span>
        </h4>
        {description && (
          <div className="conts-desc">
            <p>{description}</p>
          </div>
        )}
        {children}
      </div>
    </div>
  )
})

HelpSection.displayName = 'HelpSection'

/**
 * KRDS HelpLinkList Component
 * @param links 링크 목록
 * @param iconPosition 아이콘 위치 ('left' | 'right')
 * @param className 사용자 정의 클래스명
 */
const HelpLinkList = forwardRef<HTMLUListElement, HelpLinkListProps>(({ links, iconPosition = 'right', className, ...props }, ref) => {
  const listClasses = classNames('link-list', className)

  return (
    <ul className={listClasses} ref={ref} {...props}>
      {links.map((link, index) => (
        <li key={index}>
          <Button
            as="a"
            size="xsmall"
            variant="link"
            href={link.href}
            target={link.target}
            title={link.target === '_blank' ? '새 창 열림' : undefined}
            className="basic"
          >
            {iconPosition === 'left' && link.icon && <i className={`svg-icon ${link.icon}`}></i>}
            {link.text}
            {iconPosition === 'right' && <i className={`svg-icon ${link.icon || 'ico-go'}`}></i>}
          </Button>
        </li>
      ))}
    </ul>
  )
})

HelpLinkList.displayName = 'HelpLinkList'

/**
 * KRDS HelpPanelClose Component
 * @param children 닫기 버튼 텍스트
 * @param className 사용자 정의 클래스명
 */
const HelpPanelClose = forwardRef<HTMLButtonElement, HelpPanelCloseProps>(
  ({ children = '접어두기', className, onClick, ...props }, ref) => {
    const context = useHelpPanelContext()
    const buttonClasses = classNames('btn-help-panel', 'fold', className)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)

      if (!event.defaultPrevented) {
        context?.close()
      }
    }

    return (
      <Button
        size="small"
        variant="tertiary"
        className={buttonClasses}
        ref={ref}
        onClick={handleClick}
        aria-controls={context?.panelId}
        {...props}
      >
        <span className="sr-only">도움말</span>
        {children}
        <i className="svg-icon ico-fold right"></i>
      </Button>
    )
  }
)

HelpPanelClose.displayName = 'HelpPanelClose'

/**
 * KRDS HelpRelatedService Component
 * @param children 관련 서비스 그룹들
 * @param className 사용자 정의 클래스명
 */
const HelpRelatedService = forwardRef<HTMLDivElement, { children?: React.ReactNode; className?: string }>(
  ({ children, className, ...props }, ref) => {
    const serviceClasses = classNames('conts-area', 'related-service', className)

    return (
      <div className={serviceClasses} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)

HelpRelatedService.displayName = 'HelpRelatedService'

/**
 * KRDS HelpServiceGroup Component
 * @param title 서비스 그룹 제목
 * @param children 서비스 그룹 내용
 * @param className 사용자 정의 클래스명
 */
const HelpServiceGroup = forwardRef<HTMLDivElement, { title: string; children?: React.ReactNode; className?: string }>(
  ({ title, children, className, ...props }, ref) => {
    const groupClasses = classNames('conts-wrap', className)

    return (
      <div className={groupClasses} ref={ref} {...props}>
        <h4 className="help-title">{title}</h4>
        {children}
      </div>
    )
  }
)

HelpServiceGroup.displayName = 'HelpServiceGroup'

/**
 * KRDS HelpTutorialTitle Component
 * @param title 따라하기 제목
 * @param href 이전으로 돌아가기 링크
 * @param className 사용자 정의 클래스명
 */
const HelpTutorialTitle = forwardRef<HTMLHeadingElement, { title: string; href?: string; className?: string }>(
  ({ title, href, className, ...props }, ref) => {
    const titleClasses = classNames('help-title', className)

    return (
      <h4 className={titleClasses} ref={ref} {...props}>
        {href ? (
          <a href={href} title="이전으로 돌아가기">
            {title}
          </a>
        ) : (
          title
        )}
      </h4>
    )
  }
)

HelpTutorialTitle.displayName = 'HelpTutorialTitle'

/**
 * KRDS HelpCoachProcess Component
 * @param children 코치 태스크들
 * @param className 사용자 정의 클래스명
 */
const HelpCoachProcess = forwardRef<HTMLUListElement, { children?: React.ReactNode; className?: string }>(
  ({ children, className, ...props }, ref) => {
    const processClasses = classNames('coach-help-process', className)

    return (
      <ul className={processClasses} ref={ref} {...props}>
        {children}
      </ul>
    )
  }
)

HelpCoachProcess.displayName = 'HelpCoachProcess'

/**
 * KRDS HelpCoachTask Component
 * @param title 태스크 제목
 * @param isCurrent 현재 태스크 여부
 * @param expandText 펼치기 버튼 텍스트
 * @param steps 단계 목록
 * @param className 사용자 정의 클래스명
 */
const HelpCoachTask = forwardRef<
  HTMLLIElement,
  {
    title: string
    isCurrent?: boolean
    expandText: string
    steps: string[]
    className?: string
  }
>(({ title, isCurrent = false, expandText, steps, className, ...props }, ref) => {
  const titleClasses = classNames('tit', isCurrent && 'current')

  return (
    <li className={className} ref={ref} {...props}>
      <h4 className={titleClasses}>{title}</h4>
      <Disclosure buttonText={expandText} className="conts-expand-area">
        <TextList type="decimal">
          {steps.map((step, index) => (
            <TextListItem key={index}>{step}</TextListItem>
          ))}
        </TextList>
      </Disclosure>
    </li>
  )
})

HelpCoachTask.displayName = 'HelpCoachTask'

/**
 * KRDS HelpPanelAction Component
 * @param children 액션 버튼들
 * @param className 사용자 정의 클래스명
 */
const HelpPanelAction = forwardRef<HTMLDivElement, { children?: React.ReactNode; className?: string }>(
  ({ children, className, ...props }, ref) => {
    const actionClasses = classNames('help-panel-action', className)

    return (
      <div className={actionClasses} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)

HelpPanelAction.displayName = 'HelpPanelAction'

/**
 * KRDS HelpContentArea Component
 * @param children 컨텐츠 영역 내용
 * @param className 사용자 정의 클래스명
 */
const HelpContentArea = forwardRef<HTMLDivElement, { children?: React.ReactNode; className?: string }>(
  ({ children, className, ...props }, ref) => {
    const areaClasses = classNames('conts-area', className)

    return (
      <div className={areaClasses} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)

HelpContentArea.displayName = 'HelpContentArea'

export {
  HelpCoachProcess,
  HelpCoachTask,
  HelpContentArea,
  HelpLinkList,
  HelpPanel,
  HelpPanelAction,
  HelpPanelClose,
  HelpPanelContent,
  HelpPanelTrigger,
  HelpRelatedService,
  HelpSection,
  HelpServiceGroup,
  HelpTutorialTitle,
  useHelpPanelContext
}
