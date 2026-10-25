import { forwardRef, useId } from 'react'
import { classNames } from '@/utils'
import { useUncontrolled } from '@/hooks/use-uncontrolled'

import { DisclosureProps } from './Disclosure.types'

/**
 * KRDS Disclosure Component
 * @param buttonText 토글 버튼 텍스트
 * @param children 확장 가능한 콘텐츠
 * @param defaultExpanded 초기 확장 상태
 * @param expanded 제어된 확장 상태
 * @param onToggle 확장 상태 변경 콜백
 * @param className 커스텀 클래스명
 */
export const Disclosure = forwardRef<HTMLDivElement, DisclosureProps>(
  ({ buttonText, children, defaultExpanded = false, expanded, onToggle, className, ...props }, ref) => {
    const contentId = 'disclosure-content-' + useId()

    const [isExpanded, setIsExpanded] = useUncontrolled<boolean>({
      value: expanded,
      defaultValue: defaultExpanded,
      finalValue: false,
      onChange: onToggle
    })

    const handleToggle = () => {
      setIsExpanded(!isExpanded)
    }

    return (
      <div ref={ref} className={classNames('krds-disclosure', isExpanded && 'active', className)} {...props}>
        <button type="button" className="btn-conts-expand" aria-expanded={isExpanded} aria-controls={contentId} onClick={handleToggle}>
          {buttonText}
        </button>
        <div id={contentId} className="expand-wrap">
          <div className="expand-in">{children}</div>
        </div>
      </div>
    )
  }
)

Disclosure.displayName = 'Disclosure'
