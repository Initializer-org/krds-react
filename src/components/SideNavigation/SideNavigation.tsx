import { classNames } from '@/utils'
import { forwardRef, useEffect, useRef } from 'react'
import {
  SideNavigationItemProps,
  SideNavigationLinkProps,
  SideNavigationMenuProps,
  SideNavigationPopupMenuProps,
  SideNavigationPopupProps,
  SideNavigationPopupTitleProps,
  SideNavigationPopupToggleProps,
  SideNavigationProps,
  SideNavigationSubItemProps,
  SideNavigationSubMenuProps,
  SideNavigationTitleProps,
  SideNavigationToggleProps
} from './SideNavigation.types'
import { useMergeRefs } from '@/hooks/use-merge-refs'

/**
 * KRDS SideNavigation Root Component
 * @param children 자식 컴포넌트들
 * @param className 추가 CSS 클래스
 */
const SideNavigationRoot = forwardRef<HTMLElement, SideNavigationProps>(({ children, className, ...props }, ref) => {
  return (
    <nav className={classNames('krds-side-navigation', className)} ref={ref} {...props}>
      {children}
    </nav>
  )
})

SideNavigationRoot.displayName = 'SideNavigation'

/**
 * KRDS SideNavigation Title Component
 * @param children 제목 텍스트
 * @param className 추가 CSS 클래스
 */
const SideNavigationTitle = forwardRef<HTMLHeadingElement, SideNavigationTitleProps>(({ children, className, ...props }, ref) => {
  return (
    <h2 className={classNames('lnb-tit', className)} ref={ref} {...props}>
      {children}
    </h2>
  )
})

SideNavigationTitle.displayName = 'SideNavigation.Title'

/**
 * KRDS SideNavigation Menu Component
 * @param children 메뉴 아이템들
 * @param className 추가 CSS 클래스
 */
const SideNavigationMenu = forwardRef<HTMLUListElement, SideNavigationMenuProps>(({ children, className, ...props }, ref) => {
  return (
    <ul className={classNames('lnb-list', className)} role="menubar" ref={ref} {...props}>
      {children}
    </ul>
  )
})

SideNavigationMenu.displayName = 'SideNavigation.Menu'

/**
 * KRDS SideNavigation Item Component (2depth)
 * @param children 자식 요소들
 * @param active 활성화 상태 (서브메뉴 표시용)
 * @param className 추가 CSS 클래스
 */
const SideNavigationItem = forwardRef<HTMLLIElement, SideNavigationItemProps>(({ children, active, className, ...props }, ref) => {
  return (
    <li className={classNames('lnb-item', active && 'active', className)} role="none" ref={ref} {...props}>
      {children}
    </li>
  )
})

SideNavigationItem.displayName = 'SideNavigation.Item'

/**
 * KRDS SideNavigation SubItem Component (3depth)
 * @param children 자식 요소들
 * @param active 활성화 상태
 * @param className 추가 CSS 클래스
 */
const SideNavigationSubItem = forwardRef<HTMLLIElement, SideNavigationSubItemProps>(({ children, active, className, ...props }, ref) => {
  return (
    <li className={classNames('lnb-subitem', active && 'active', className)} role="none" ref={ref} {...props}>
      {children}
    </li>
  )
})

SideNavigationSubItem.displayName = 'SideNavigation.SubItem'

/**
 * KRDS SideNavigation Toggle Button Component
 * @param children 버튼 텍스트
 * @param active 활성화 상태
 * @param expanded 확장된 상태
 * @param onClick 클릭 핸들러
 * @param className 추가 CSS 클래스
 */
const SideNavigationToggle = forwardRef<HTMLButtonElement, SideNavigationToggleProps>(
  ({ children, active, expanded, onClick, className, ...props }, ref) => {
    return (
      <button
        type="button"
        className={classNames('lnb-btn', 'lnb-toggle', active && 'active', className)}
        role="menuitem"
        aria-expanded={expanded}
        onClick={onClick}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

SideNavigationToggle.displayName = 'SideNavigation.Toggle'

/**
 * KRDS SideNavigation SubMenu Component
 * @param children 서브메뉴 아이템들
 * @param id 메뉴 ID
 * @param className 추가 CSS 클래스
 */
const SideNavigationSubMenu = forwardRef<HTMLDivElement, SideNavigationSubMenuProps>(({ children, id, className, ...props }, ref) => {
  return (
    <div className={classNames('lnb-submenu', className)} ref={ref} {...props}>
      <ul id={id} role="menu">
        {children}
      </ul>
    </div>
  )
})

SideNavigationSubMenu.displayName = 'SideNavigation.SubMenu'

/**
 * KRDS SideNavigation Link Component
 * @param children 링크 텍스트
 * @param href 링크 URL
 * @param current 현재 페이지 여부
 * @param onClick 클릭 핸들러
 * @param className 추가 CSS 클래스
 */
const SideNavigationLink = forwardRef<HTMLAnchorElement, SideNavigationLinkProps>(
  ({ children, href = '#', current, onClick, className, ...props }, ref) => {
    return (
      <a
        href={href}
        className={classNames('lnb-btn', 'lnb-link', className)}
        role="menuitem"
        aria-current={current ? 'page' : undefined}
        onClick={onClick}
        ref={ref}
        {...props}
      >
        {children}
      </a>
    )
  }
)

SideNavigationLink.displayName = 'SideNavigation.Link'

/**
 * KRDS SideNavigation Popup Toggle Component
 * @param children 버튼 텍스트
 * @param expanded 확장된 상태
 * @param onClick 클릭 핸들러
 * @param className 추가 CSS 클래스
 */
const SideNavigationPopupToggle = forwardRef<HTMLButtonElement, SideNavigationPopupToggleProps>(
  ({ children, expanded, onClick, className, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const _ref = useMergeRefs(ref, buttonRef)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget
      const popupSubmenu = button.nextElementSibling as HTMLElement

      if (popupSubmenu && popupSubmenu.classList.contains('lnb-submenu-lv2')) {
        popupSubmenu.classList.add('active')
        button.setAttribute('aria-expanded', 'true')

        const handleTransitionEnd = () => {
          const firstButton = popupSubmenu.querySelector('.lnb-btn-tit') as HTMLButtonElement
          firstButton?.focus()
          popupSubmenu.removeEventListener('transitionend', handleTransitionEnd)
        }

        popupSubmenu.addEventListener('transitionend', handleTransitionEnd)
      }

      onClick?.(event)
    }

    return (
      <button
        type="button"
        className={classNames('lnb-btn', 'lnb-toggle-popup', className)}
        role="menuitem"
        aria-expanded={expanded}
        aria-haspopup="true"
        onClick={handleClick}
        ref={_ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

SideNavigationPopupToggle.displayName = 'SideNavigation.PopupToggle'

/**
 * KRDS SideNavigation Popup Component
 * @param children 팝업 내용
 * @param active 활성화 상태
 * @param id 메뉴 ID
 * @param className 추가 CSS 클래스
 */
const SideNavigationPopup = forwardRef<HTMLDivElement, SideNavigationPopupProps>(({ children, active, id, className, ...props }, ref) => {
  const popupRef = useRef<HTMLDivElement>(null)
  const _ref = useMergeRefs(ref, popupRef)

  useEffect(() => {
    const popupElement = popupRef.current
    if (!popupElement) return

    const handleFocusOut = (event: FocusEvent) => {
      const relatedTarget = event.relatedTarget as HTMLElement

      // 포커스가 서브메뉴 밖으로 나갔는지 확인
      if (!popupElement.contains(relatedTarget)) {
        popupElement.classList.remove('active')

        // 이전에 클릭된 토글 버튼 찾기
        const toggleButton = popupElement.previousElementSibling as HTMLButtonElement
        if (toggleButton && toggleButton.classList.contains('lnb-toggle-popup')) {
          toggleButton.setAttribute('aria-expanded', 'false')

          const handleTransitionEnd = () => {
            toggleButton.focus()
            popupElement.removeEventListener('transitionend', handleTransitionEnd)
          }

          popupElement.addEventListener('transitionend', handleTransitionEnd)
        }
      }
    }

    popupElement.addEventListener('focusout', handleFocusOut)

    return () => {
      popupElement.removeEventListener('focusout', handleFocusOut)
    }
  }, [])

  return (
    <div className={classNames('lnb-submenu-lv2', active && 'active', className)} id={id} role="menu" ref={_ref} {...props}>
      {children}
    </div>
  )
})

SideNavigationPopup.displayName = 'SideNavigation.Popup'

/**
 * KRDS SideNavigation Popup Title Component
 * @param children 제목 텍스트
 * @param onClick 클릭 핸들러
 * @param className 추가 CSS 클래스
 */
const SideNavigationPopupTitle = forwardRef<HTMLButtonElement, SideNavigationPopupTitleProps>(
  ({ children, onClick, className, ...props }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget
      const popupSubmenu = button.closest('.lnb-submenu-lv2') as HTMLElement

      if (popupSubmenu) {
        popupSubmenu.classList.remove('active')

        const toggleButton = popupSubmenu.previousElementSibling as HTMLButtonElement
        if (toggleButton && toggleButton.classList.contains('lnb-toggle-popup')) {
          toggleButton.setAttribute('aria-expanded', 'false')
          toggleButton.focus()
        }
      }

      onClick?.(event)
    }

    return (
      <button type="button" className={classNames('lnb-btn-tit', className)} onClick={handleClick} ref={ref} {...props}>
        {children}
      </button>
    )
  }
)

SideNavigationPopupTitle.displayName = 'SideNavigation.PopupTitle'

/**
 * KRDS SideNavigation Popup Menu Component (4depth)
 * @param children 4depth 메뉴 아이템들
 * @param className 추가 CSS 클래스
 */
const SideNavigationPopupMenu = forwardRef<HTMLUListElement, SideNavigationPopupMenuProps>(({ children, className, ...props }, ref) => {
  return (
    <ul className={className} ref={ref} {...props}>
      {children}
    </ul>
  )
})

SideNavigationPopupMenu.displayName = 'SideNavigation.PopupMenu'

const SideNavigation = Object.assign(SideNavigationRoot, {
  Title: SideNavigationTitle,
  Menu: SideNavigationMenu,
  Item: SideNavigationItem,
  SubItem: SideNavigationSubItem,
  Toggle: SideNavigationToggle,
  SubMenu: SideNavigationSubMenu,
  Link: SideNavigationLink,
  PopupToggle: SideNavigationPopupToggle,
  Popup: SideNavigationPopup,
  PopupTitle: SideNavigationPopupTitle,
  PopupMenu: SideNavigationPopupMenu
})

export { SideNavigation }
