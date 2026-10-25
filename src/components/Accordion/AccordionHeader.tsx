import { classNames } from '@/utils'
import { forwardRef } from 'react'
import { useAccordionContext } from './AccordionContext'
import { useAccordionItemContext } from './AccordionItemContext'

import { AccordionHeaderProps } from './Accordion.types'

/**
 * KRDS AccordionHeader Component
 * @param children 헤더 제목
 * @param onClick 커스텀 클릭 핸들러
 */
const AccordionHeader = forwardRef<HTMLHeadingElement, AccordionHeaderProps>(({ children, onClick, className = '', ...props }, ref) => {
  const { onToggle } = useAccordionContext()
  const { value: itemValue, isExpanded, itemId } = useAccordionItemContext()
  const headerId = `accordion-header-${itemId}`
  const panelId = `accordion-panel-${itemId}`

  const buttonClasses = classNames('btn-accordion', isExpanded && 'active')

  const handleClick = () => {
    onToggle(itemValue)
    onClick?.()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <h5 className={classNames('accordion-header', className)} ref={ref} {...props}>
      <button
        type="button"
        id={headerId}
        className={buttonClasses}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {children}
      </button>
    </h5>
  )
})

AccordionHeader.displayName = 'AccordionHeader'

export default AccordionHeader
