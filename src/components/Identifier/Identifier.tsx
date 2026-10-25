import { forwardRef } from 'react'
import { classNames } from '@/utils'
import { IdentifierProps } from './Identifier.types'

/**
 * KRDS Identifier 컴포넌트
 * @param logoAlt 로고 alt 텍스트
 * @param text 식별자 텍스트
 * @param className 추가 커스텀 클래스
 */
export const Identifier = forwardRef<HTMLDivElement, IdentifierProps>(
  ({ text = '이 누리집은 보건복지부 산하기관 누리집입니다.', logoAlt = 'KRDS - Korea Design System', className, ...props }, ref) => {
    return (
      <div ref={ref} aria-label="운영기관 식별자" className={classNames('krds-identifier', className)} {...props}>
        <span className="logo">
          <span className="sr-only">{logoAlt}</span>
        </span>
        <span className="ban-txt">{text}</span>
      </div>
    )
  }
)

Identifier.displayName = 'Identifier'
