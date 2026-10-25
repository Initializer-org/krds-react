import { classNames } from '@/utils'
import React from 'react'
import { BreadcrumbProps } from './Breadcrumb.types'

/**
 * KRDS Breadcrumb Component
 * @param items 브레드크럼 아이템 목록 ('home' | 'link' | 'disabled')
 * @param className 추가 클래스명
 * @param ariaLabel 접근성 레이블
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(({ items, className, ariaLabel = '현재 경로', ...props }, ref) => {
  return (
    <nav ref={ref} className={classNames('krds-breadcrumb-wrap', className)} aria-label={ariaLabel} {...props}>
      <ol className="breadcrumb" role="list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const liClassName = classNames(index === 0 && 'home')
          return (
            <li key={index} className={liClassName || undefined}>
              <a
                href={item.disabled ? undefined : item.href}
                className={classNames('txt')}
                onClick={item.disabled ? e => e.preventDefault() : undefined}
                aria-current={isLast ? 'page' : undefined}
                aria-disabled={item.disabled ? 'true' : undefined}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
})

Breadcrumb.displayName = 'Breadcrumb'
