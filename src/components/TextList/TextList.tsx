import { classNames } from '@/utils'
import { forwardRef } from 'react'
import { TextListItemProps, TextListProps } from './TextList.types'

/**
 * KRDS TextList Component
 * @param type 텍스트 목록 타입 ('decimal' | 'dash' | 'hollow' | 'ordered')
 * @param children 자식 요소
 * @param className 커스텀 클래스명
 */
export const TextList = forwardRef<HTMLUListElement | HTMLOListElement, TextListProps>(
  ({ type = 'decimal', children, className, ...props }, ref) => {
    const isOrdered = type === 'ordered'

    if (isOrdered) {
      return (
        <ol ref={ref as React.Ref<HTMLOListElement>} className={classNames('krds-info-list', type, className)} {...props}>
          {children}
        </ol>
      )
    }

    return (
      <ul ref={ref as React.Ref<HTMLUListElement>} className={classNames('krds-info-list', type, className)} {...props}>
        {children}
      </ul>
    )
  }
)

TextList.displayName = 'TextList'

/**
 * KRDS TextListItem Component
 * @param children 자식 요소
 * @param className 커스텀 클래스명
 * @param number 번호 (ordered 타입에서 사용)
 */
export const TextListItem = forwardRef<HTMLLIElement, TextListItemProps>(({ children, className, number, ...props }, ref) => {
  return (
    <li ref={ref} className={className} {...props}>
      {number && <span className="num">{number}</span>}
      {children}
    </li>
  )
})

TextListItem.displayName = 'TextListItem'
