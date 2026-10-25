import { classNames } from '@/utils'
import { forwardRef } from 'react'
import { Badge } from '../Badge'
import Button from '../Button'
import {
  StructuredListActionProps,
  StructuredListBadgeProps,
  StructuredListBodyProps,
  StructuredListButtonsProps,
  StructuredListContentProps,
  StructuredListDescriptionProps,
  StructuredListFooterProps,
  StructuredListHeaderProps,
  StructuredListItemProps,
  StructuredListMetaProps,
  StructuredListProps,
  StructuredListTagProps,
  StructuredListTitleProps
} from './StructuredList.types'

/**
 * KRDS StructuredList Component
 * @param children 구조화 목록 아이템들
 * @param className 사용자 정의 클래스명
 */
export const StructuredList = forwardRef<HTMLUListElement, StructuredListProps>(({ children, className, ...props }, ref) => {
  const listClasses = classNames('krds-structured-list', 'type-full', className)
  return (
    <ul ref={ref} className={listClasses} {...props}>
      {children}
    </ul>
  )
})

StructuredList.displayName = 'StructuredList'

/**
 * KRDS StructuredListItem Component
 * @param children 구조화 목록 아이템 내용
 * @param className 사용자 정의 클래스명
 */
export const StructuredListItem = forwardRef<HTMLLIElement, StructuredListItemProps>(({ children, className, ...props }, ref) => {
  const itemClasses = classNames('structured-item', className)
  return (
    <li ref={ref} className={itemClasses} {...props}>
      <div className="in">{children}</div>
    </li>
  )
})

StructuredListItem.displayName = 'StructuredListItem'

/**
 * KRDS StructuredListHeader Component
 * @param children 헤더 내용
 * @param className 사용자 정의 클래스명
 */
export function StructuredListHeader({ children, className }: StructuredListHeaderProps) {
  return <div className={classNames('card-top', className)}>{children}</div>
}

/**
 * KRDS StructuredListBadge Component
 * @param children 뱃지 텍스트
 * @param variant 뱃지 종류 ('filled' | 'light')
 * @param color 뱃지 색상 ('primary' | 'success' | 'secondary')
 * @param className 사용자 정의 클래스명
 */
export function StructuredListBadge({ children, variant = 'light', color = 'primary', className }: StructuredListBadgeProps) {
  return (
    <Badge variant={variant} color={color} className={className}>
      {children}
    </Badge>
  )
}

/**
 * KRDS StructuredListBody Component
 * @param children 본문 내용
 * @param className 사용자 정의 클래스명
 */
export function StructuredListBody({ children, className }: StructuredListBodyProps) {
  return <div className={classNames('card-body', className)}>{children}</div>
}

/**
 * KRDS StructuredListContent Component
 * @param children 내용 요소들
 * @param href 링크 URL
 * @param className 사용자 정의 클래스명
 */
export function StructuredListContent({ children, href, className }: StructuredListContentProps) {
  const contentClasses = classNames('c-text', className)

  if (href) {
    return (
      <a href={href} className={contentClasses}>
        {children}
      </a>
    )
  }

  return <div className={contentClasses}>{children}</div>
}

/**
 * KRDS StructuredListTitle Component
 * @param children 제목 텍스트
 * @param className 사용자 정의 클래스명
 */
export function StructuredListTitle({ children, className }: StructuredListTitleProps) {
  return (
    <p className={classNames('c-tit', className)}>
      <span className="span">{children}</span>
    </p>
  )
}

/**
 * KRDS StructuredListDescription Component
 * @param children 설명 텍스트
 * @param className 사용자 정의 클래스명
 */
export function StructuredListDescription({ children, className }: StructuredListDescriptionProps) {
  return <p className={classNames('c-txt', className)}>{children}</p>
}

/**
 * KRDS StructuredListMeta Component
 * @param label 메타 레이블
 * @param children 메타 값
 * @param className 사용자 정의 클래스명
 */
export function StructuredListMeta({ label, children, className }: StructuredListMetaProps) {
  return (
    <p className={classNames('c-date', className)}>
      {label && <strong className="key">{label}</strong>}
      <span className="value">{children}</span>
    </p>
  )
}

/**
 * KRDS StructuredListAction Component
 * @param children 액션 텍스트
 * @param onClick 클릭 핸들러
 * @param href 링크 URL
 * @param variant 버튼 종류 ('primary' | 'secondary' | 'text')
 * @param title 버튼 제목
 * @param className 사용자 정의 클래스명
 */
export function StructuredListAction({ children, onClick, href, variant = 'secondary', title, className }: StructuredListActionProps) {
  return (
    <div className={classNames('c-btn', className)}>
      {href ? (
        <Button as="a" href={href} variant={variant} title={title}>
          {children}
        </Button>
      ) : (
        <Button variant={variant} onClick={onClick} title={title}>
          {children}
        </Button>
      )}
    </div>
  )
}

/**
 * KRDS StructuredListFooter Component
 * @param children 푸터 내용
 * @param className 사용자 정의 클래스명
 */
export function StructuredListFooter({ children, className }: StructuredListFooterProps) {
  return <div className={classNames('card-btm', className)}>{children}</div>
}

/**
 * KRDS StructuredListTag Component
 * @param children 태그 텍스트
 * @param className 사용자 정의 클래스명
 */
export function StructuredListTag({ children, className }: StructuredListTagProps) {
  return <span className={classNames('tag', className)}>{children}</span>
}

/**
 * KRDS StructuredListButtons Component
 * @param children 버튼 요소들
 * @param className 사용자 정의 클래스명
 */
export function StructuredListButtons({ children, className }: StructuredListButtonsProps) {
  return <div className={classNames('card-btn', className)}>{children}</div>
}
