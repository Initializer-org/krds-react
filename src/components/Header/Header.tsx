import { Dropdown } from '@/components/Dropdown'
import MainMenu from '@/components/MainMenu/MainMenu'
import type { MobileTriggerProps } from '@/components/MainMenu/MainMenu.types'
import { classNames } from '@/utils'
import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState
} from 'react'
import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import type {
  HeaderBrandingProps,
  HeaderComponentSubmodules,
  HeaderContextType,
  HeaderMainMenuProps,
  HeaderMyGovProps,
  HeaderNaviButtonJoinProps,
  HeaderNaviButtonLoginProps,
  HeaderNaviButtonLogoutProps,
  HeaderNaviButtonSearchProps,
  HeaderNaviProps,
  HeaderProps,
  HeaderUtilitiesProps,
  HeaderUtilityDropdownProps,
  HeaderUtilityProps
} from './Header.types'

const Slot = forwardRef<any, { children?: ReactNode } & Record<string, unknown>>(({ children, ...props }, ref) => {
  if (isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      ...(children as any)?.props,
      ref
    })
  }
  return null
})
Slot.displayName = 'HeaderSlot'

const HeaderContext = createContext<HeaderContextType | null>(null)

const useHeaderContext = () => {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error('Header compound components must be used within Header')
  }
  return context
}

const MyGovContext = createContext<{
  close: () => void
} | null>(null)

const useMyGovContext = () => useContext(MyGovContext)

const DEFAULT_HEADER_ID = 'krds-header'
const DEFAULT_MOBILE_TRIGGER_PORTAL_ID = 'krds-header-mobile-trigger'
const DEFAULT_DESKTOP_MENU_PORTAL_ID = 'krds-header-in'
const DEFAULT_MOBILE_MENU_PORTAL_ID = 'krds-header'

const HeaderComponent = forwardRef<HTMLElement, HeaderProps>((props, ref) => {
  const {
    children,
    id,
    className,
    mobileMenuTriggerPortalId,
    desktopMenuPortalId = DEFAULT_DESKTOP_MENU_PORTAL_ID,
    mobileMenuPortalId = DEFAULT_MOBILE_MENU_PORTAL_ID,
    ...restProps
  } = props

  const headerId = id ?? DEFAULT_HEADER_ID

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const resolvedTriggerPortalId = mobileMenuTriggerPortalId ?? DEFAULT_MOBILE_TRIGGER_PORTAL_ID

  const setDropdown = useCallback((dropdownId: string | null) => {
    setOpenDropdownId(dropdownId)
  }, [])

  const closeDropdowns = useCallback(() => {
    setDropdown(null)
  }, [setDropdown])

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element | null
      if (!target?.closest(`#${headerId} .krds-drop-wrap`)) {
        closeDropdowns()
      }
    }

    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [closeDropdowns, headerId])

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdowns()
      }
    }

    document.addEventListener('keyup', handleKeyUp)
    return () => document.removeEventListener('keyup', handleKeyUp)
  }, [closeDropdowns])

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const wrap = document.querySelector('#wrap')
      const container = document.querySelector('#container') as HTMLElement | null
      if (!wrap || !container) return

      const containerOffsetTop = container.offsetTop
      const scrollY = window.scrollY
      const scrollDown = scrollY > lastScrollY
      const scrollUp = scrollY < lastScrollY

      if (scrollY > containerOffsetTop + 50 && scrollDown) {
        wrap.classList.add('scroll-down')
        wrap.classList.remove('scroll-up')
      } else if (scrollY > containerOffsetTop + 50 && scrollUp) {
        wrap.classList.add('scroll-up')
        wrap.classList.remove('scroll-down')
      } else {
        wrap.classList.remove('scroll-down', 'scroll-up')
      }

      lastScrollY = scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const contextValue = useMemo<HeaderContextType>(
    () => ({
      openDropdownId,
      setDropdown,
      closeDropdowns,
      mobileTriggerPortalId: resolvedTriggerPortalId,
      desktopMenuPortalId,
      mobileMenuPortalId
    }),
    [openDropdownId, setDropdown, closeDropdowns, resolvedTriggerPortalId, desktopMenuPortalId, mobileMenuPortalId]
  )

  return (
    <HeaderContext.Provider value={contextValue}>
      <header ref={ref} id={headerId} className={className} {...restProps}>
        <div id={desktopMenuPortalId} className="header-in">
          {children}
        </div>
      </header>
    </HeaderContext.Provider>
  )
})

const Container = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={classNames('header-container', className)} {...props}>
    <div className="inner">{children}</div>
  </div>
))

const Utilities = ({ children, className, ...props }: HeaderUtilitiesProps) => {
  const items = Children.map(children, child => {
    if (!isValidElement(child)) {
      return <UtilityItem>{child}</UtilityItem>
    }

    const displayName = (child.type as { displayName?: string }).displayName
    if (displayName === UtilityItem.displayName || displayName === UtilityDropdown.displayName) {
      return child
    }

    return <UtilityItem>{child}</UtilityItem>
  })

  return (
    <div className={classNames('header-utility', className)} {...props}>
      <ul className="utility-list">{items}</ul>
    </div>
  )
}

const UtilityItem = forwardRef<HTMLLIElement, HeaderUtilityProps>(({ className, children, ...props }, ref) => {
  return (
    <li ref={ref} className={className} {...props}>
      {children}
    </li>
  )
})

const UtilityDropdown = ({
  id,
  label,
  buttonText,
  children,
  dropdownClassName,
  itemClassName,
  buttonClassName,
  ...dropdownProps
}: HeaderUtilityDropdownProps) => {
  const generatedId = useId()
  const dropdownId = id ?? `utility-${generatedId}`
  const { openDropdownId, setDropdown, closeDropdowns } = useHeaderContext()
  const isOpen = openDropdownId === dropdownId

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setDropdown(dropdownId)
      } else {
        closeDropdowns()
      }
    },
    [closeDropdowns, dropdownId, setDropdown]
  )

  const resolvedButtonText = buttonText ?? (
    <>
      {label}
      <i className="svg-icon ico-toggle"></i>
    </>
  )

  return (
    <UtilityItem className={itemClassName}>
      <Dropdown
        {...dropdownProps}
        buttonText={resolvedButtonText}
        buttonClassName={classNames('krds-btn small text drop-btn', buttonClassName)}
        className={classNames(dropdownClassName)}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
      >
        {children}
      </Dropdown>
    </UtilityItem>
  )
}

const Branding = ({
  logoHref = '#',
  onLogoClick,
  logoAltText = 'KRDS - Korea Design System',
  children,
  className,
  ...props
}: HeaderBrandingProps) => (
  <div className={classNames('header-branding', className)} {...props}>
    <h2 className="logo">
      {logoHref ? (
        <a href={logoHref} onClick={onLogoClick}>
          <span className="sr-only">{logoAltText}</span>
        </a>
      ) : (
        <button type="button" onClick={onLogoClick}>
          <span className="sr-only">{logoAltText}</span>
        </button>
      )}
    </h2>
    {children}
  </div>
)

const Navi = ({ children, className, ...props }: HeaderNaviProps) => {
  const { mobileTriggerPortalId } = useHeaderContext()
  return (
    <div className={classNames('header-actions', className)} {...props}>
      {children}
      <div id={mobileTriggerPortalId} className="header-mobile-trigger" data-mobile-trigger="true" />
    </div>
  )
}

const NaviButtonSearch = forwardRef<HTMLButtonElement, HeaderNaviButtonSearchProps>(
  ({ label = '통합검색', title = '통합검색 레이어', className, type = 'button', ...props }, ref) => (
    <button type={type} className={classNames('btn-navi sch', className)} title={title} ref={ref} {...props}>
      {label}
    </button>
  )
)

const NaviButtonLogin = forwardRef<HTMLAnchorElement | HTMLButtonElement, HeaderNaviButtonLoginProps>((props, ref) => {
  if ('href' in props && props.href) {
    const { href, label = '로그인', className, ...anchorProps } = props
    return (
      <a href={href} className={classNames('btn-navi login', className)} ref={ref as Ref<HTMLAnchorElement>} {...anchorProps}>
        {label}
      </a>
    )
  }

  const { label = '로그인', className, type = 'button', ...buttonProps } = props
  return (
    <button
      type={type as ButtonHTMLAttributes<HTMLButtonElement>['type']}
      className={classNames('btn-navi login', className)}
      ref={ref as Ref<HTMLButtonElement>}
      {...(buttonProps as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {label}
    </button>
  )
})

const NaviButtonJoin = forwardRef<HTMLButtonElement, HeaderNaviButtonJoinProps>(
  ({ label = '회원가입', className, type = 'button', ...props }, ref) => (
    <button type={type} className={classNames('btn-navi join', className)} ref={ref} {...props}>
      {label}
    </button>
  )
)

const NaviButtonLogout = forwardRef<HTMLButtonElement, HeaderNaviButtonLogoutProps>(
  ({ children = '로그아웃', className, onClick, type = 'button', ...props }, ref) => {
    const myGovContext = useMyGovContext()
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
      onClick?.(event)
      if (!event.defaultPrevented) {
        myGovContext?.close()
      }
    }

    return (
      <button type={type} className={classNames('krds-btn medium text', className)} ref={ref} onClick={handleClick} {...props}>
        {children}
      </button>
    )
  }
)

const MyGov = forwardRef<HTMLButtonElement, HeaderMyGovProps>(
  (
    {
      label = '나의 GOV',
      name,
      remainingTime,
      remainingTimeLabel = '로그아웃까지 남은 시간',
      extendTimeLabel = '시간 연장',
      onExtendTime,
      items,
      className,
      buttonClassName,
      dropdownId,
      ...buttonProps
    },
    ref
  ) => {
    const generatedId = useId()
    const id = dropdownId ?? `my-gov-${generatedId}`
    const { openDropdownId, setDropdown, closeDropdowns } = useHeaderContext()
    const isOpen = openDropdownId === id

    const handleOpenChange = useCallback(
      (nextOpen: boolean) => {
        if (nextOpen) {
          setDropdown(id)
        } else {
          closeDropdowns()
        }
      },
      [closeDropdowns, id, setDropdown]
    )

    const contextValue = useMemo(
      () => ({
        close: closeDropdowns
      }),
      [closeDropdowns]
    )

    const { onClick, ...restButtonProps } = buttonProps
    void onClick

    return (
      <MyGovContext.Provider value={contextValue}>
        <Dropdown
          ref={ref}
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          className={classNames('my-drop', className)}
          buttonText={label}
          buttonClassName={classNames('btn-navi my drop-btn', buttonClassName, isOpen && 'active')}
          {...restButtonProps}
        >
          <Dropdown.TopSection>
            <p className="my-name">{name}</p>
            {remainingTime && (
              <dl className="my-time">
                <dt>{remainingTimeLabel}</dt>
                <dd>
                  <span className="time">{remainingTime}</span>
                  {onExtendTime && (
                    <button type="button" className="krds-btn medium text" onClick={onExtendTime}>
                      {extendTimeLabel}
                    </button>
                  )}
                </dd>
              </dl>
            )}
          </Dropdown.TopSection>

          {items && items.length > 0 && (
            <Dropdown.List>
              {items.map((item, index) => {
                if (item.href) {
                  const { key: _key, label: itemLabel, className: itemClassName, onClick, href, ...anchorProps } = item

                  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = event => {
                    onClick?.(event)
                    if (!event.defaultPrevented) {
                      closeDropdowns()
                    }
                  }

                  return (
                    <li key={item.key ?? index}>
                      <a href={href} className={classNames('item-link', itemClassName)} onClick={handleClick} {...anchorProps}>
                        {itemLabel}
                      </a>
                    </li>
                  )
                }

                const { key: _key, label: itemLabel, className: itemClassName, onClick, type = 'button', ...buttonItemProps } = item

                const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
                  ;(onClick as React.MouseEventHandler<HTMLButtonElement>)?.(event)
                  if (!event.defaultPrevented) {
                    closeDropdowns()
                  }
                }

                return (
                  <li key={item.key ?? index}>
                    <button
                      type={type as ButtonHTMLAttributes<HTMLButtonElement>['type']}
                      className={classNames('item-link', itemClassName)}
                      onClick={handleClick}
                      {...(buttonItemProps as ButtonHTMLAttributes<HTMLButtonElement>)}
                    >
                      {itemLabel}
                    </button>
                  </li>
                )
              })}
            </Dropdown.List>
          )}

          <Dropdown.BottomSection>
            <Header.NaviButton.Logout onClick={() => console.log('logout')} />
          </Dropdown.BottomSection>
        </Dropdown>
      </MyGovContext.Provider>
    )
  }
)

const HeaderMainMenu = forwardRef<HTMLElement, HeaderMainMenuProps>(
  ({ mobileTrigger, mobileTriggerProps, allMenuButtonLabel = '전체메뉴', ...rest }, ref) => {
    const { mobileTriggerPortalId, desktopMenuPortalId, mobileMenuPortalId } = useHeaderContext()

    const triggerProps: MobileTriggerProps = {
      ...mobileTriggerProps,
      label: mobileTriggerProps?.label ?? allMenuButtonLabel
    }

    const fallbackTrigger = <MainMenu.MobileTrigger {...triggerProps} />
    const triggerNode = mobileTrigger ?? fallbackTrigger

    return (
      <MainMenu
        ref={ref}
        {...rest}
        mobileTrigger={triggerNode}
        mobileTriggerPortalId={mobileTriggerPortalId}
        desktopPortalId={desktopMenuPortalId}
        mobilePortalId={mobileMenuPortalId}
      />
    )
  }
)

HeaderComponent.displayName = 'Header'
Container.displayName = 'Header.Container'
Utilities.displayName = 'Header.Utilities'
UtilityItem.displayName = 'Header.Utility'
UtilityDropdown.displayName = 'Header.UtilityDropdown'
Branding.displayName = 'Header.Branding'
Navi.displayName = 'Header.Navi'
NaviButtonSearch.displayName = 'Header.NaviButton.Search'
NaviButtonLogin.displayName = 'Header.NaviButton.Login'
NaviButtonJoin.displayName = 'Header.NaviButton.Join'
NaviButtonLogout.displayName = 'Header.NaviButton.Logout'
MyGov.displayName = 'Header.NaviButton.MyGov'
HeaderMainMenu.displayName = 'Header.MainMenu'

const Header = HeaderComponent as typeof HeaderComponent & HeaderComponentSubmodules

Header.Container = Container
Header.Utilities = Utilities
Header.Utility = Object.assign(UtilityItem, {
  Dropdown: UtilityDropdown,
  DropdownItem: Dropdown.Item
})
Header.Branding = Branding
Header.Navi = Navi
Header.NaviButton = {
  Search: NaviButtonSearch,
  Login: NaviButtonLogin,
  Join: NaviButtonJoin,
  MyGov,
  Logout: NaviButtonLogout
}
Header.MainMenu = HeaderMainMenu

export { Header }
