import { Portal } from '@/components/Portal'
import { classNames } from '@/utils'
import React, {
  forwardRef,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import type {
  DesktopBanner,
  DesktopLeafItem,
  DesktopMainDropdown,
  DesktopMainItem,
  DesktopMainLink,
  DesktopSubLink,
  DesktopSubMenu,
  MainMenuProps,
  MobileDepth3Item,
  MobileDepth4,
  MobileLinkItem,
  MobileMainItem,
  MobilePanelDepth3,
  MobilePanel,
  MobilePanelItem,
  MobilePanelLink,
  MobileTriggerProps
} from './MainMenu.types'

const DEFAULT_SEARCH_PLACEHOLDER = '찾고자 하는 메뉴명을 입력해 주세요'
const DEFAULT_SEARCH_SR = '검색'
const DEFAULT_CLOSE_LABEL = '전체메뉴 닫기'

const fallbackKey = (provided: string | undefined, fallback: string) => (provided && provided.trim().length > 0 ? provided : fallback)

const toDomId = (key: string) => key.replace(/[^a-zA-Z0-9_-]/g, '_')

type MobileMenuPhase = 'idle' | 'pre-opening' | 'opening' | 'open' | 'closing'

const MobileTriggerButton = forwardRef<HTMLButtonElement, MobileTriggerProps>(
  ({ label, children, className, onClick, ...buttonProps }, ref) => (
    <button
      type="button"
      className={classNames('btn-navi all', className)}
      onClick={onClick}
      ref={ref}
      aria-controls="mobile-nav"
      {...buttonProps}
    >
      {children ?? label}
    </button>
  )
)

MobileTriggerButton.displayName = 'MainMenuMobileTrigger'

const createFocusTrap = (trap: HTMLElement) => {
  const focusable = trap.querySelectorAll<HTMLElement>('a, button, [tabindex="0"], input, textarea, select')
  if (!focusable.length) return () => {}

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return
    const active = trap.ownerDocument.activeElement

    if (event.shiftKey) {
      if (active === first) {
        event.preventDefault()
        last.focus()
      }
    } else if (active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  trap.addEventListener('keydown', handleKeyDown)
  return () => trap.removeEventListener('keydown', handleKeyDown)
}

const ensureBackdrop = () => {
  let backdrop = document.querySelector<HTMLElement>('.gnb-backdrop')
  let owns = false

  if (!backdrop) {
    backdrop = document.createElement('div')
    backdrop.className = 'gnb-backdrop'
    document.body.appendChild(backdrop)
    owns = true
  }

  return { backdrop, owns }
}

const breakpoint = 1024

const MainMenu = forwardRef<HTMLElement, MainMenuProps>((props, ref) => {
  const { desktop, mobile, mobileTrigger, onMobileMenuOpen, onMobileMenuClose, desktopPortalId, mobilePortalId } = props
  const mobileNavId = mobile.id?.trim() ? mobile.id : 'mobile-nav'
  const mobileTriggerContainer = 'mobileTriggerPortalId' in props ? props.mobileTriggerPortalId : props.mobileTriggerContainerElement
  const desktopNavRef = useRef<HTMLElement | null>(null)
  const mobileNavRef = useRef<HTMLDivElement | null>(null)
  const mobileBodyRef = useRef<HTMLDivElement | null>(null)

  const mainListRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const subListRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const mainTriggerRefs = useRef<Record<string, HTMLElement | null>>({})
  const mobilePanelRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const depth4Refs = useRef<Record<string, HTMLDivElement | null>>({})
  const depth4TriggerRefs = useRef<Record<string, HTMLElement | null>>({})

  const desktopEntries = useMemo(
    () =>
      desktop.items.map((item, index) => ({
        item,
        key: fallbackKey((item as DesktopMainDropdown | DesktopMainLink).id, `desktop-main-${index}`),
        index
      })),
    [desktop.items]
  )

  const mobileEntries = useMemo(
    () =>
      mobile.body.mainItems.map((item, index) => ({
        item,
        key: fallbackKey(item.id, `mobile-main-${index}`),
        index
      })),
    [mobile.body.mainItems]
  )

  const [desktopActiveMain, setDesktopActiveMain] = useState<string | null>(null)
  const [desktopActiveSub, setDesktopActiveSub] = useState<Record<string, string | null>>({})
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mobileActiveMain, setMobileActiveMain] = useState<string | null>(mobileEntries[0]?.key ?? null)
  const [openDepth3, setOpenDepth3] = useState<Record<string, boolean>>({})
  const [openDepth4, setOpenDepth4] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuPhase, setMobileMenuPhase] = useState<MobileMenuPhase>('idle')
  const previousMobileOpenRef = useRef(isMobileOpen)
  const mobileTransitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMobileOpenRef = useRef(isMobileOpen)

  const backdropInfoRef = useRef<{ backdrop: HTMLElement; owns: boolean } | null>(null)

  useImperativeHandle(ref, () => desktopNavRef.current as HTMLElement, [])

  useEffect(() => {
    if (!mobileEntries.length) {
      setMobileActiveMain(null)
    } else {
      setMobileActiveMain(prev => prev ?? mobileEntries[0].key)
    }
  }, [mobileEntries])

  const desktopItemMap = useMemo(() => {
    const map = new Map<string, DesktopMainItem>()
    desktopEntries.forEach(entry => map.set(entry.key, entry.item))
    return map
  }, [desktopEntries])

  const activeDesktopItem = desktopActiveMain ? desktopItemMap.get(desktopActiveMain) : null
  const shouldShowBackdrop = Boolean(
    activeDesktopItem && activeDesktopItem.type === 'dropdown' && !(activeDesktopItem as DesktopMainDropdown).isDropdownTrigger
  )

  const closeDesktopMenu = useCallback(() => {
    setDesktopActiveMain(null)
  }, [])

  useEffect(() => {
    const { backdrop, owns } = ensureBackdrop()
    backdropInfoRef.current = { backdrop, owns }

    const handleBackdropClick = () => closeDesktopMenu()
    backdrop.addEventListener('click', handleBackdropClick)

    return () => {
      backdrop.removeEventListener('click', handleBackdropClick)
      if (owns && backdrop.parentElement === document.body) {
        document.body.removeChild(backdrop)
      }
    }
  }, [closeDesktopMenu])

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const nav = desktopNavRef.current
      if (!nav) return
      const target = event.target as Node
      if (!nav.contains(target)) {
        closeDesktopMenu()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [closeDesktopMenu])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        closeDesktopMenu()
        setIsMobileOpen(false)
      }
    }
    document.addEventListener('keyup', handler)
    return () => document.removeEventListener('keyup', handler)
  }, [closeDesktopMenu])

  useEffect(() => {
    isMobileOpenRef.current = isMobileOpen
  }, [isMobileOpen])

  useEffect(() => {
    const info = backdropInfoRef.current
    if (!info) return
    const { backdrop } = info
    const body = document.body

    if (shouldShowBackdrop) {
      backdrop.classList.add('active')
      body.classList.add('is-gnb-web')
      if (body.scrollHeight > window.innerHeight) {
        body.classList.add('hasScrollY')
      }
    } else {
      backdrop.classList.remove('active')
      body.classList.remove('is-gnb-web')
      body.classList.remove('hasScrollY')
    }
  }, [shouldShowBackdrop])

  const registerMainListRef = useCallback((key: string, node: HTMLDivElement | null) => {
    if (node) {
      mainListRefs.current[key] = node
    } else {
      delete mainListRefs.current[key]
    }
  }, [])

  const registerSubListRef = useCallback((mainKey: string, subKey: string, node: HTMLDivElement | null) => {
    const composite = `${mainKey}__${subKey}`
    if (node) {
      subListRefs.current[composite] = node
    } else {
      delete subListRefs.current[composite]
    }
  }, [])

  const registerMainTriggerRef = useCallback((key: string, node: HTMLElement | null) => {
    if (node) {
      mainTriggerRefs.current[key] = node
    } else {
      delete mainTriggerRefs.current[key]
    }
  }, [])

  const registerPanelRef = useCallback((key: string, node: HTMLDivElement | null) => {
    if (node) {
      mobilePanelRefs.current[key] = node
    } else {
      delete mobilePanelRefs.current[key]
    }
  }, [])

  const registerDepth4Ref = useCallback((key: string, node: HTMLDivElement | null) => {
    if (node) {
      depth4Refs.current[key] = node
    } else {
      delete depth4Refs.current[key]
    }
  }, [])

  const registerDepth4TriggerRef = useCallback((key: string, node: HTMLElement | null) => {
    if (node) {
      depth4TriggerRefs.current[key] = node
    } else {
      delete depth4TriggerRefs.current[key]
    }
  }, [])

  useLayoutEffect(() => {
    if (!desktopActiveMain) return
    const mainList = mainListRefs.current[desktopActiveMain]
    if (!mainList) return
    const subKey = desktopActiveSub[desktopActiveMain]
    if (!subKey) {
      mainList.style.minHeight = ''
      return
    }
    const composite = `${desktopActiveMain}__${subKey}`
    const subList = subListRefs.current[composite]
    if (!subList) return
    mainList.style.minHeight = subList.scrollHeight ? `${subList.scrollHeight}px` : ''
  }, [desktopActiveMain, desktopActiveSub])

  useEffect(() => {
    if (desktopActiveMain) return
    Object.values(mainListRefs.current).forEach(node => {
      if (node) node.style.minHeight = ''
    })
  }, [desktopActiveMain])

  const handleDesktopMainClick = useCallback(
    (entry: { item: DesktopMainItem; key: string }) => {
      const { item, key } = entry
      if (item.type === 'link') return

      if (desktopActiveMain === key) {
        closeDesktopMenu()
        return
      }

      const dropdown = item as DesktopMainDropdown
      const firstIndex = dropdown.sections.findIndex(section => section.type === 'menu')
      const firstSubKey =
        firstIndex >= 0 ? fallbackKey((dropdown.sections[firstIndex] as DesktopSubMenu).id, `${key}-section-${firstIndex}`) : null

      setDesktopActiveMain(key)
      setDesktopActiveSub(prev => ({ ...prev, [key]: firstSubKey }))
    },
    [closeDesktopMenu, desktopActiveMain]
  )

  const handleDesktopSubClick = useCallback((mainKey: string, subKey: string) => {
    setDesktopActiveSub(prev => ({ ...prev, [mainKey]: subKey }))
  }, [])

  const desktopMainKeys = useMemo(() => desktopEntries.map(entry => entry.key), [desktopEntries])

  const handleMainKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>, index: number) => {
      const focusByIndex = (idx: number) => {
        const key = desktopMainKeys[(idx + desktopMainKeys.length) % desktopMainKeys.length]
        const trigger = mainTriggerRefs.current[key]
        trigger?.focus()
      }

      switch (event.key) {
        case 'Home':
          event.preventDefault()
          focusByIndex(0)
          break
        case 'End':
          event.preventDefault()
          focusByIndex(desktopMainKeys.length - 1)
          break
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault()
          focusByIndex(index + 1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault()
          focusByIndex(index - 1)
          break
        default:
          break
      }
    },
    [desktopMainKeys]
  )

  useEffect(() => {
    const nav = mobileNavRef.current
    if (!nav) return

    if (mobileTransitionTimeoutRef.current) {
      clearTimeout(mobileTransitionTimeoutRef.current)
      mobileTransitionTimeoutRef.current = null
    }

    if (isMobileOpen) {
      setMobileMenuPhase(prev => {
        if (prev === 'open' || prev === 'opening') return prev
        return 'pre-opening'
      })

      const activeTrigger = nav.querySelector('.gnb-main-trigger.active')
      if (activeTrigger && mobileBodyRef.current) {
        const id = activeTrigger.getAttribute('aria-controls')
        if (id) {
          const targetPanel = document.getElementById(id)
          if (targetPanel && mobileBodyRef.current) {
            const bodyRef = mobileBodyRef.current
            bodyRef.style.scrollBehavior = 'auto'
            bodyRef.scrollTop = targetPanel.offsetTop
            requestAnimationFrame(() => {
              bodyRef.style.scrollBehavior = ''
            })
          }
        }
      }

      const openingTimeout = setTimeout(() => {
        if (!isMobileOpenRef.current) return
        setMobileMenuPhase(prev => (prev === 'open' ? prev : 'opening'))
        document.body.classList.add('is-gnb-mobile')

        const handleTransitionEnd = (e: TransitionEvent) => {
          if (e.target !== nav) return
          if (!isMobileOpenRef.current) {
            nav.removeEventListener('transitionend', handleTransitionEnd)
            return
          }
          setMobileMenuPhase('open')
          const gnbWrap = nav.querySelector('.gnb-wrap')
          if (gnbWrap instanceof HTMLElement) {
            gnbWrap.setAttribute('tabindex', '0')
            gnbWrap.focus()
          }
          nav.removeEventListener('transitionend', handleTransitionEnd)

          document.querySelector('#krds-header .header-in')?.setAttribute('inert', '')
          document.getElementById('container')?.setAttribute('inert', '')
          document.getElementById('footer')?.setAttribute('inert', '')
        }

        nav.addEventListener('transitionend', handleTransitionEnd)
      }, 100)

      mobileTransitionTimeoutRef.current = openingTimeout
    } else {
      setMobileMenuPhase(prev => (prev === 'idle' ? prev : 'closing'))

      document.querySelector('#krds-header .header-in')?.removeAttribute('inert')
      document.getElementById('container')?.removeAttribute('inert')
      document.getElementById('footer')?.removeAttribute('inert')

      const handleTransitionEnd = (e: TransitionEvent) => {
        if (e.target !== nav) return
        if (isMobileOpenRef.current) {
          nav.removeEventListener('transitionend', handleTransitionEnd)
          return
        }
        setMobileMenuPhase('idle')
        const navId = nav.getAttribute('id')
        const openGnb = navId ? document.querySelector(`[aria-controls=${navId}]`) : null
        if (openGnb instanceof HTMLElement) {
          openGnb.focus()
        }
        nav.removeAttribute('tabindex')
        nav.removeEventListener('transitionend', handleTransitionEnd)
      }

      nav.addEventListener('transitionend', handleTransitionEnd)

      const closingTimeout = setTimeout(() => {
        document.body.classList.remove('is-gnb-mobile')
      }, 400)

      mobileTransitionTimeoutRef.current = closingTimeout
    }

    return () => {
      if (mobileTransitionTimeoutRef.current) {
        clearTimeout(mobileTransitionTimeoutRef.current)
        mobileTransitionTimeoutRef.current = null
      }
    }
  }, [isMobileOpen])

  useEffect(() => {
    const wasOpen = previousMobileOpenRef.current
    if (wasOpen !== isMobileOpen) {
      if (isMobileOpen) {
        onMobileMenuOpen?.()
      } else {
        onMobileMenuClose?.()
      }
      previousMobileOpenRef.current = isMobileOpen
    }
  }, [isMobileOpen, onMobileMenuClose, onMobileMenuOpen])

  useEffect(() => {
    return () => {
      if (previousMobileOpenRef.current) {
        onMobileMenuClose?.()
      }
    }
  }, [onMobileMenuClose])

  useEffect(() => {
    if (!isMobileOpen) return
    const nav = mobileNavRef.current
    if (!nav) return
    const cleanup = createFocusTrap(nav)
    return cleanup
  }, [isMobileOpen])

  const handleMobileOpen = useCallback(() => {
    setMobileMenuPhase(prev => {
      if (prev === 'open' || prev === 'opening') return prev
      return 'pre-opening'
    })
    setIsMobileOpen(true)
  }, [])

  const handleMobileClose = useCallback(() => {
    setMobileMenuPhase(prev => (prev === 'idle' ? prev : 'closing'))
    setIsMobileOpen(false)
    setOpenDepth4(null)
  }, [])

  const handleMobileBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    const gnbWrap = mobileNavRef.current?.querySelector('.gnb-wrap')
    if (gnbWrap && !gnbWrap.contains(target)) {
      if (gnbWrap instanceof HTMLElement) {
        gnbWrap.focus()
      }
    }
  }, [])

  const mobileTriggerContent = useMemo(() => {
    if (mobileTrigger && isValidElement(mobileTrigger)) {
      return cloneElement(mobileTrigger, {
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          if (typeof mobileTrigger.props.onClick === 'function') {
            mobileTrigger.props.onClick(event)
          }
          if (!event.defaultPrevented) {
            handleMobileOpen()
          }
        },
        'aria-controls': mobileTrigger.props['aria-controls'] ?? mobileNavId
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
    }

    return <MobileTriggerButton onClick={handleMobileOpen} aria-controls={mobileNavId} />
  }, [mobileTrigger, handleMobileOpen, mobileNavId])

  const mobileTriggerNode = useMemo(
    () => <Portal container={mobileTriggerContainer}>{mobileTriggerContent}</Portal>,
    [mobileTriggerContainer, mobileTriggerContent]
  )

  const isMobileMenuVisible = mobileMenuPhase !== 'idle'
  const shouldApplyMobileOpenClasses = mobileMenuPhase === 'opening' || mobileMenuPhase === 'open'

  const handleMobileMainClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>, entry: { item: MobileMainItem; key: string }) => {
    event.preventDefault()
    const { item, key } = entry
    setMobileActiveMain(key)
    const firstPanel = item.panels[0]
    if (!firstPanel) return
    const panelKey = fallbackKey(firstPanel.id, `${key}-panel-0`)
    const panelNode = mobilePanelRefs.current[panelKey]
    const body = mobileBodyRef.current
    if (panelNode && body) {
      body.scrollTo({ top: panelNode.offsetTop, left: 0, behavior: 'smooth' })
    }
  }, [])

  const mobilePanelsFlat = useMemo(
    () =>
      mobileEntries.flatMap(entry =>
        entry.item.panels.map((panel, panelIndex) => ({
          panel,
          panelKey: fallbackKey(panel.id, `${entry.key}-panel-${panelIndex}`),
          ownerKey: entry.key
        }))
      ),
    [mobileEntries]
  )

  useEffect(() => {
    const body = mobileBodyRef.current
    if (!body) return

    const handler = () => {
      let currentKey: string | null = null
      const scrollTop = body.scrollTop

      for (const { panelKey, ownerKey } of mobilePanelsFlat) {
        const node = mobilePanelRefs.current[panelKey]
        if (!node) continue
        if (scrollTop >= node.offsetTop - 10) {
          currentKey = ownerKey
        }
      }

      if (currentKey) {
        setMobileActiveMain(currentKey)
      }
    }

    body.addEventListener('scroll', handler)
    return () => body.removeEventListener('scroll', handler)
  }, [mobilePanelsFlat])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= breakpoint) {
        setIsMobileOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleDepth3 = useCallback((key: string) => {
    setOpenDepth3(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const openDepth4Panel = useCallback((event: React.MouseEvent<HTMLElement>, _item: MobileDepth4, key: string) => {
    event.preventDefault()
    setOpenDepth4(key)
    const wrap = depth4Refs.current[key]
    if (wrap) {
      wrap.style.display = 'block'
      requestAnimationFrame(() => {
        wrap.classList.add('is-open')
        const prevButton = wrap.querySelector<HTMLButtonElement>('.trigger-prev')
        prevButton?.focus()
      })
    }
    depth4TriggerRefs.current[key] = event.currentTarget as HTMLElement
  }, [])

  const closeDepth4Panel = useCallback((key: string) => {
    const wrap = depth4Refs.current[key]
    const trigger = depth4TriggerRefs.current[key]
    if (wrap) {
      wrap.classList.remove('is-open')
      setTimeout(() => {
        wrap.style.display = ''
        trigger?.focus()
      }, 250)
    }
    setOpenDepth4(current => (current === key ? null : current))
  }, [])

  const handleSearchSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      const trimmed = searchQuery.trim()
      if (!trimmed) return
      mobile.header?.search?.onSearch?.(trimmed)
    },
    [mobile.header?.search, searchQuery]
  )

  const renderDesktopLeafList = (items: DesktopLeafItem[], parentKey: string) => {
    const hasDescription = items.some(item => item.description)

    return (
      <ul className={classNames(hasDescription && 'type-description')}>
        {items.map((item, index) => {
          const leafKey = fallbackKey(item.id, `${parentKey}-leaf-${index}`)
          const content =
            item.href && !item.asButton ? (
              <a
                href={item.href || '#'}
                target={item.isExternal ? '_blank' : undefined}
                title={item.isExternal ? '새 창 열림' : undefined}
                onClick={item.onClick}
              >
                {item.label}
                {item.isExternal && <i className="svg-icon ico-go" />}
              </a>
            ) : (
              <button type="button" onClick={item.onClick}>
                {item.label}
              </button>
            )

          if (item.description) {
            return (
              <li key={leafKey}>
                <h3 className="tit">{content}</h3>
                <p className="txt">{item.description}</p>
              </li>
            )
          }

          return <li key={leafKey}>{content}</li>
        })}
      </ul>
    )
  }

  const renderDesktopBanner = (banner?: DesktopBanner) => {
    if (!banner) return null
    return (
      <div className="gnb-sub-banner">
        {banner.badgeText && <span className="krds-badge bg-secondary">{banner.badgeText}</span>}
        {banner.children}
        <button type="button" className="krds-btn medium text" onClick={banner.onButtonClick}>
          {banner.buttonText} <i className="svg-icon ico-angle right" />
        </button>
      </div>
    )
  }

  const renderDesktopSubMenu = (mainKey: string, sectionEntry: { section: DesktopSubMenu; key: string }) => {
    const { section, key: subKey } = sectionEntry
    const isActive = desktopActiveSub[mainKey] === subKey
    const panelId = toDomId(`gnb-sub-${subKey}`)

    return (
      <li key={subKey}>
        <button
          type="button"
          className={classNames('gnb-sub-trigger', isActive && 'active')}
          data-trigger="gnb"
          aria-expanded={isActive ? 'true' : 'false'}
          aria-controls={panelId}
          onClick={() => handleDesktopSubClick(mainKey, subKey)}
        >
          {section.label}
        </button>
        <div
          className={classNames('gnb-sub-list', section.layout && section.layout !== 'default' && section.layout, isActive && 'active')}
          id={panelId}
          ref={node => registerSubListRef(mainKey, subKey, node)}
        >
          <div className="gnb-sub-content">
            <h2 className="sub-title">
              <span>{section.label}</span>
              {section.quickLinkHref && (
                <a
                  href={section.quickLinkHref || '#'}
                  className="krds-btn link basic small"
                  target={section.quickLinkExternal ? '_blank' : undefined}
                  title={section.quickLinkExternal ? '새 창 열림' : undefined}
                >
                  <span className="underline">{section.quickLinkLabel ?? '바로가기'}</span>
                  <i className="svg-icon ico-angle right" />
                </a>
              )}
            </h2>
            {renderDesktopLeafList(section.items, subKey)}
          </div>
          {renderDesktopBanner(section.banner)}
        </div>
      </li>
    )
  }

  const renderDesktopSubLink = (sectionEntry: { section: DesktopSubLink; key: string }) => {
    const { section, key } = sectionEntry
    return (
      <li key={key}>
        <a
          href={section.href || '#'}
          className="gnb-sub-trigger is-link"
          data-trigger="gnb"
          target={section.isExternal ? '_blank' : undefined}
          title={section.isExternal ? '새 창 열림' : undefined}
          onClick={section.onClick}
        >
          {section.label}
        </a>
      </li>
    )
  }

  const renderDesktopMainItem = (entry: { item: DesktopMainItem; key: string; index: number }) => {
    const { item, key: mainKey, index } = entry

    if (item.type === 'link') {
      const link = item as DesktopMainLink
      const triggerProps = {
        'data-trigger': 'gnb' as const,
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => handleMainKeyDown(event, index),
        ref: (node: HTMLElement | null) => registerMainTriggerRef(mainKey, node)
      }

      if (link.renderAsButton || !link.href) {
        return (
          <li key={mainKey}>
            <button type="button" className="gnb-main-trigger is-link" onClick={link.onClick} {...triggerProps}>
              {link.label}
            </button>
          </li>
        )
      }

      return (
        <li key={mainKey}>
          <a
            href={link.href || '#'}
            className="gnb-main-trigger is-link"
            target={link.isExternal ? '_blank' : undefined}
            title={link.isExternal ? '새 창 열림' : undefined}
            onClick={link.onClick}
            {...triggerProps}
          >
            {link.label}
          </a>
        </li>
      )
    }

    const dropdown = item as DesktopMainDropdown
    const isActive = desktopActiveMain === mainKey
    const toggleId = toDomId(`gnb-main-${mainKey}`)

    const sectionEntries = dropdown.sections.map((section, sectionIndex) => ({
      section,
      key: fallbackKey((section as DesktopSubMenu | DesktopSubLink).id, `${mainKey}-section-${sectionIndex}`),
      index: sectionIndex
    }))

    return (
      <li key={mainKey}>
        <button
          type="button"
          className={classNames('gnb-main-trigger', dropdown.isDropdownTrigger && 'is-dropdown', isActive && 'active')}
          data-trigger="gnb"
          aria-haspopup="true"
          aria-expanded={isActive ? 'true' : 'false'}
          aria-controls={toggleId}
          onClick={() => handleDesktopMainClick({ item, key: mainKey })}
          onKeyDown={event => handleMainKeyDown(event, index)}
          ref={node => registerMainTriggerRef(mainKey, node)}
        >
          {dropdown.label}
        </button>
        <div className={classNames('gnb-toggle-wrap', isActive && 'is-open')} id={toggleId}>
          <div
            className={classNames('gnb-main-list', dropdown.mainListClassName)}
            data-has-submenu={sectionEntries.some(section => section.section.type === 'menu') ? 'true' : 'false'}
            ref={node => registerMainListRef(mainKey, node)}
          >
            <ul>
              {sectionEntries.map(sectionEntry =>
                sectionEntry.section.type === 'menu'
                  ? renderDesktopSubMenu(mainKey, {
                      section: sectionEntry.section as DesktopSubMenu,
                      key: sectionEntry.key
                    })
                  : renderDesktopSubLink({
                      section: sectionEntry.section as DesktopSubLink,
                      key: sectionEntry.key
                    })
              )}
            </ul>
          </div>
        </div>
      </li>
    )
  }

  const renderMobileDepth3Item = (entry: { item: MobileDepth3Item; key: string; index: number }) => {
    const { item, key: depth3Key } = entry

    if (item.type === 'link') {
      return (
        <li key={depth3Key}>
          <a href={item.href || '#'} className="depth3-trigger">
            {item.label}
          </a>
        </li>
      )
    }

    const depth4 = item as MobileDepth4
    const isOpen = openDepth4 === depth3Key
    const depth4Entries = depth4.items.map((link, depth4Index) => ({
      link,
      key: fallbackKey(link.id, `${depth3Key}-depth4-${depth4Index}`)
    }))

    return (
      <li key={depth3Key}>
        <a
          href="#"
          className={classNames('depth3-trigger', 'has-depth4', isOpen && 'active')}
          onClick={event => openDepth4Panel(event, depth4, depth3Key)}
          ref={node => registerDepth4TriggerRef(depth3Key, node)}
        >
          {depth4.label}
        </a>
        <div
          className={classNames('depth4-wrap', isOpen && 'is-open')}
          style={{ display: isOpen ? 'block' : undefined }}
          ref={node => registerDepth4Ref(depth3Key, node)}
        >
          <div className="depth4-head">
            <button type="button" className="krds-btn icon trigger-prev" onClick={() => closeDepth4Panel(depth3Key)}>
              <span className="sr-only">이전화면</span>
              <i className="svg-icon ico-angle left" />
            </button>
            <button type="button" className="krds-btn icon trigger-close" onClick={() => closeDepth4Panel(depth3Key)}>
              <span className="sr-only">{DEFAULT_CLOSE_LABEL}</span>
              <i className="svg-icon ico-popup-close" />
            </button>
          </div>
          <div className="depth4-body">
            <h4 className="sub-title">{depth4.title}</h4>
            <ul className="depth4-ul">
              {depth4Entries.map(entry => (
                <li key={entry.key}>
                  <a
                    href={entry.link.href || '#'}
                    target={entry.link.isExternal ? '_blank' : undefined}
                    title={entry.link.isExternal ? '새 창 열림' : undefined}
                  >
                    {entry.link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </li>
    )
  }

  const renderMobilePanelItem = (entry: { item: MobilePanelItem; key: string; index: number }) => {
    const { item, key } = entry

    if (item.type === 'link') {
      const link = item as MobilePanelLink
      return (
        <li key={key}>
          <a href={link.href || '#'} className="gnb-sub-trigger">
            {link.label}
          </a>
        </li>
      )
    }

    const depth3 = item as MobilePanelDepth3
    const depth3Key = key
    const isOpen = openDepth3[depth3Key] ?? false

    return (
      <li key={depth3Key}>
        <a
          href="#"
          className={classNames('gnb-sub-trigger', 'has-depth3', isOpen && 'active')}
          onClick={event => {
            event.preventDefault()
            toggleDepth3(depth3Key)
          }}
        >
          {depth3.label}
        </a>
        <div className={classNames('depth3-wrap', isOpen && 'is-open')}>
          <ul>
            {depth3.items.map((child, childIndex) =>
              renderMobileDepth3Item({
                item: child,
                key: fallbackKey(child.id, `${depth3Key}-child-${childIndex}`),
                index: childIndex
              })
            )}
          </ul>
        </div>
      </li>
    )
  }

  const renderMobilePanel = (entry: { panel: MobilePanel; key: string; index: number }) => {
    const { panel, key: panelKey } = entry
    const panelDomId = toDomId(panelKey)

    return (
      <div className="gnb-sub-list" id={panelDomId} key={panelKey} ref={node => registerPanelRef(panelKey, node)}>
        <h2 className="sub-title">{panel.label}</h2>
        <ul>
          {panel.items.map((item, itemIndex) =>
            renderMobilePanelItem({
              item,
              key: fallbackKey((item as MobilePanelLink | MobilePanelDepth3).id, `${panelKey}-item-${itemIndex}`),
              index: itemIndex
            })
          )}
        </ul>
      </div>
    )
  }

  const renderMobileMainItem = (entry: { item: MobileMainItem; key: string; index: number }) => {
    const { item, key: mainKey } = entry
    const firstPanel = item.panels[0]
    const firstPanelKey = firstPanel ? fallbackKey(firstPanel.id, `${mainKey}-panel-0`) : mainKey
    const href = `#${toDomId(firstPanelKey)}`

    return (
      <li key={mainKey}>
        <a
          href={href}
          className={classNames('gnb-main-trigger', mobileActiveMain === mainKey && 'active')}
          onClick={event => handleMobileMainClick(event, entry)}
        >
          {item.label}
        </a>
      </li>
    )
  }

  const renderUtilityItem = (item: MobileLinkItem | { id?: string; label: string; href?: string; onClick?: () => void }, index: number) => {
    const key = fallbackKey(item.id as string | undefined, `utility-${index}`)
    if ('href' in item && item.href) {
      return (
        <li key={key}>
          <a href={item.href || '#'} className="krds-btn xsmall text" onClick={item.onClick}>
            {item.label}
          </a>
        </li>
      )
    }
    return (
      <li key={key}>
        <button type="button" className="krds-btn xsmall text" onClick={item.onClick}>
          {item.label}
        </button>
      </li>
    )
  }

  const desktopMenuContent = (
    <nav className="krds-main-menu" ref={desktopNavRef}>
      <div className="inner">
        <ul className="gnb-menu">{desktopEntries.map(renderDesktopMainItem)}</ul>
      </div>
    </nav>
  )

  const mobileMenuContent = (
    <div
      id={mobileNavId}
      className={classNames(
        'krds-main-menu-mobile',
        shouldApplyMobileOpenClasses && 'is-backdrop',
        shouldApplyMobileOpenClasses && 'is-open'
      )}
      style={{ display: isMobileMenuVisible ? 'block' : 'none' }}
      ref={mobileNavRef}
      onClick={handleMobileBackdropClick}
    >
      <div className="gnb-wrap">
        <div className="gnb-header">
          {mobile.header?.utilities && mobile.header.utilities.length > 0 && (
            <div className="gnb-utils">
              <ul className="utility-list">{mobile.header.utilities.map((util, index) => renderUtilityItem(util, index))}</ul>
            </div>
          )}

          {mobile.header?.login && (
            <div className="gnb-login">
              {mobile.header.login.isLoggedIn ? (
                <>
                  {mobile.header.login.userName && <span className="user">{mobile.header.login.userName}</span>}
                  <button type="button" className="krds-btn large text" onClick={mobile.header.login.onLogout}>
                    <i className="svg-icon ico-logout" />
                    {mobile.header.login.logoutText ?? '로그아웃'}
                  </button>
                </>
              ) : (
                <button type="button" className="krds-btn large text" onClick={mobile.header.login.onLogin}>
                  <i className="svg-icon ico-log" />
                  {mobile.header.login.loginText ?? '로그인을 해주세요'}
                </button>
              )}
            </div>
          )}

          {mobile.header?.services && mobile.header.services.length > 0 && (
            <div className="gnb-service-menu">
              {mobile.header.services.map((service, index) => {
                const key = fallbackKey(service.id, `service-${index}`)
                return (
                  <a key={key} href={service.href || '#'} className="link" onClick={service.onClick}>
                    {service.label}
                  </a>
                )
              })}
            </div>
          )}

          {mobile.header?.search && (
            <form className="sch-input" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="krds-input"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder={mobile.header.search.placeholder ?? DEFAULT_SEARCH_PLACEHOLDER}
                title="찾고자 하는 메뉴명 입력"
              />
              <button type="submit" className="krds-btn medium icon ico-search">
                <span className="sr-only">{DEFAULT_SEARCH_SR}</span>
                <i className="svg-icon ico-sch" />
              </button>
            </form>
          )}
        </div>

        <div className="gnb-body" ref={mobileBodyRef}>
          <div className="gnb-menu">
            <div className="menu-wrap">
              <ul>{mobileEntries.map(renderMobileMainItem)}</ul>
            </div>
            <div className="submenu-wrap">
              {mobileEntries.flatMap(entry =>
                entry.item.panels.map((panel, panelIndex) =>
                  renderMobilePanel({
                    panel,
                    key: fallbackKey(panel.id, `${entry.key}-panel-${panelIndex}`),
                    index: panelIndex
                  })
                )
              )}
            </div>
          </div>

          {mobile.bottomLinks && mobile.bottomLinks.length > 0 && (
            <div className="gnb-bottom">
              {mobile.bottomLinks.map((link, index) => (
                <a
                  key={fallbackKey(link.id, `bottom-${index}`)}
                  href={link.href || '#'}
                  className="krds-btn small text"
                  target={link.isExternal ? '_blank' : undefined}
                  title={link.isExternal ? '새 창 열림' : undefined}
                  onClick={link.onClick}
                >
                  {link.label}
                  <i className={`svg-icon ${link.isExternal ? 'ico-go' : 'ico-angle right'}`} />
                </a>
              ))}
            </div>
          )}
        </div>

        <button type="button" className="krds-btn medium icon" id="close-nav" onClick={handleMobileClose}>
          <span className="sr-only">{DEFAULT_CLOSE_LABEL}</span>
          <i className="svg-icon ico-popup-close" />
        </button>
      </div>
    </div>
  )

  return (
    <>
      {mobileTriggerNode}
      {desktopPortalId ? <Portal container={desktopPortalId}>{desktopMenuContent}</Portal> : desktopMenuContent}
      {mobilePortalId ? <Portal container={mobilePortalId}>{mobileMenuContent}</Portal> : mobileMenuContent}
    </>
  )
})

MainMenu.displayName = 'MainMenu'

const MainMenuWithStatic = MainMenu as typeof MainMenu & {
  MobileTrigger: typeof MobileTriggerButton
}

MainMenuWithStatic.MobileTrigger = MobileTriggerButton

export default MainMenuWithStatic
