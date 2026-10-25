import { classNames } from '@/utils'
import React, { forwardRef } from 'react'
import { TagProps, TagWrapProps } from './Tag.types'

/**
 * KRDS Tag Component
 * @param variant tag type ('deletable' | 'link')
 * @param onDelete delete button click handler
 * @param deleteDisabled delete button disabled state
 * @param className custom class name
 */
export const Tag = forwardRef<HTMLSpanElement | HTMLAnchorElement, TagProps>(({ children, className, ...props }, ref) => {
  const tagClassName = classNames('krds-btn-tag', props.variant === 'link' && 'link', className)

  if (props.variant === 'link') {
    const { variant: _variant, ...linkProps } = props
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} className={tagClassName} {...linkProps}>
        {children}
      </a>
    )
  }

  const { variant: _variant, onDelete, deleteDisabled, ...spanProps } = props

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} className={tagClassName} {...spanProps}>
      {children}
      {onDelete && (
        <button type="button" className="btn-delete" onClick={onDelete} disabled={deleteDisabled}>
          <span className="sr-only">삭제</span>
        </button>
      )}
    </span>
  )
})

Tag.displayName = 'Tag'

/**
 * KRDS TagWrap Component
 * @param size tag group size ('small' | 'medium' | 'large')
 * @param className custom class name
 */
export const TagWrap = forwardRef<HTMLDivElement, TagWrapProps>(({ children, size = 'medium', className, ...props }, ref) => {
  const wrapClassName = classNames('krds-tag-wrap', size, className)

  return (
    <div ref={ref} className={wrapClassName} {...props}>
      {children}
    </div>
  )
})

TagWrap.displayName = 'TagWrap'
