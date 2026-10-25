import { classNames } from '@/utils'
import { forwardRef } from 'react'

import { AccordionPanelProps } from './Accordion.types'
import { useAccordionItemContext } from './AccordionItemContext'

/**
 * KRDS AccordionPanel Component
 * @param children 패널 내용
 */
const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(({ children, className = '', ...props }, ref) => {
  const { itemId } = useAccordionItemContext()
  const headerId = `accordion-header-${itemId}`
  const panelId = `accordion-panel-${itemId}`

  return (
    <div id={panelId} aria-labelledby={headerId} className={classNames('accordion-collapse', className)} ref={ref} {...props}>
      <div className="accordion-body">{children}</div>
    </div>
  )
})

AccordionPanel.displayName = 'AccordionPanel'

export default AccordionPanel
