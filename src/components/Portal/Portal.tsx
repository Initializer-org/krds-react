import React, { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { PortalProps } from './Portal.types'

export const Portal: React.FC<PortalProps> = ({ children, enabled = true, container, containerClassName }) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (!enabled) return

    let targetContainer: HTMLElement | null = null

    if (!container) {
      targetContainer = document.body
    } else if (typeof container === 'string') {
      targetContainer = document.getElementById(container)

      if (!targetContainer) {
        targetContainer = document.createElement('div')
        targetContainer.id = container
        if (containerClassName) {
          targetContainer.className = containerClassName
        }
        document.body.appendChild(targetContainer)
      }
    } else if (container instanceof HTMLElement) {
      targetContainer = container
    }

    setPortalContainer(targetContainer)

    return () => {
      if (targetContainer && typeof container === 'string' && targetContainer.children.length === 0 && targetContainer.id === container) {
        try {
          document.body.removeChild(targetContainer)
        } catch {
          // ignore
        }
      }
    }
  }, [enabled, container, containerClassName])

  if (!enabled) {
    return <>{children}</>
  }

  if (!portalContainer) {
    return null
  }

  return createPortal(children, portalContainer)
}

Portal.displayName = 'Portal'
