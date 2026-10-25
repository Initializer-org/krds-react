import { classNames } from '@/utils'
import { forwardRef, useId } from 'react'
import { useAccordionContext } from './AccordionContext'
import { AccordionItemContext } from './AccordionItemContext'

import { AccordionItemProps } from './Accordion.types'

/**
 * KRDS AccordionItem Component ( Pattern)
 * @param value 아이템 값 (고유 식별자)
 * @param children 자식 컴포넌트들 (Header와 Panel)
 */
const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(({ value, children, className = '', ...props }, ref) => {
  const { expandedValues } = useAccordionContext()
  const isExpanded = expandedValues.includes(value)
  const itemId = useId()

  const itemClasses = classNames('accordion-item', isExpanded && 'active', className)

  const itemContextValue = {
    value,
    isExpanded,
    itemId
  }

  return (
    <AccordionItemContext.Provider value={itemContextValue}>
      <div className={itemClasses} ref={ref} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
})

AccordionItem.displayName = 'AccordionItem'

export default AccordionItem
