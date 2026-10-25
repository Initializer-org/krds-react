import { forwardRef } from 'react'
import { classNames } from '@/utils'
import { LinkProps } from './Link.types'

/**
 * KRDS Link 컴포넌트
 * @param variant 링크 스타일 타입 ('default' | 'basic')
 * @param underline 밑줄 표시 여부 ('always' | 'hover' | 'none')
 * @param preserveColorOnHover hover 시 컬러 유지 여부
 * @param icon 외부 링크 아이콘 또는 커스텀 아이콘
 * @param external 외부 링크 여부
 * @param size 링크 크기 ('xsmall' | 'small' | 'medium' | 'large' | 'xlarge')
 * @param disabled 비활성화 여부
 * @param children 링크 텍스트 내용
 * @param className 사용자 정의 클래스명
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      variant = 'default',
      underline = 'always',
      preserveColorOnHover = false,
      icon,
      external = false,
      size = 'large',
      disabled = false,
      children,
      className,
      href,
      target,
      rel,
      onClick,
      ...props
    },
    ref
  ) => {
    const linkClasses = classNames(
      'krds-btn',
      'link',
      size,
      variant === 'basic' && 'basic',
      preserveColorOnHover && 'pure',
      disabled && 'disabled',
      className
    )

    const linkTextClasses = {
      always: 'underline',
      hover: 'underline hidden-underline',
      none: ''
    }[underline]

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        event.preventDefault()
        return
      }
      onClick?.(event)
    }

    const linkTarget = external ? '_blank' : target
    const linkRel = external ? 'noopener noreferrer' : rel
    const linkTitle = external && !props.title ? '새 창 열림' : props.title

    const Icon = icon ? icon : external ? <i className="svg-icon ico-go" /> : null
    return (
      <a
        ref={ref}
        className={linkClasses}
        href={disabled ? undefined : href}
        target={linkTarget}
        rel={linkRel}
        title={linkTitle}
        onClick={handleClick}
        tabIndex={disabled ? -1 : undefined}
        aria-disabled={disabled}
        {...props}
      >
        <span className={linkTextClasses}>{children}</span>
        {Icon}
      </a>
    )
  }
)

Link.displayName = 'Link'
