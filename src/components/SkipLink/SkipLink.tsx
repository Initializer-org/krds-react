import React from 'react'
import { SkipLinkProps } from './SkipLink.types'

/**
 * KRDS SkipLink 컴포넌트
 * @param targetId 이동할 대상 요소 ID
 * @param children 링크 텍스트 내용
 * @param className 사용자 정의 클래스명
 */
export const SkipLink = React.forwardRef<HTMLDivElement, SkipLinkProps>(
  ({ targetId = 'breadcrumb', children = '본문 바로가기', className, ...props }, ref) => {
    return (
      <div id="krds-skip-link" ref={ref} className={className} {...props}>
        <a href={`#${targetId}`}>{children}</a>
      </div>
    )
  }
)

SkipLink.displayName = 'SkipLink'

export default SkipLink
