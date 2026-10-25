import { forwardRef } from 'react'
import { MastheadProps } from './Masthead.types'

/**
 * KRDS Masthead Component
 * @param text 배너 텍스트
 * @param className 커스텀 클래스명
 */
export const Masthead = forwardRef<HTMLDivElement, MastheadProps>(({ text, className, ...props }, ref) => {
  return (
    <div id="krds-masthead" ref={ref} className={className} {...props}>
      <div className="toggle-wrap">
        <div className="toggle-head">
          <div className="inner">
            <span className="nuri-txt">{text}</span>
          </div>
        </div>
      </div>
    </div>
  )
})

Masthead.displayName = 'Masthead'
