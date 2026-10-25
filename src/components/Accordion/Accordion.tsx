import { classNames } from '@/utils'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { forwardRef, useCallback } from 'react'
import { AccordionContext } from './AccordionContext'
import AccordionItem from './AccordionItem'
import AccordionHeader from './AccordionHeader'
import AccordionPanel from './AccordionPanel'
import { AccordionProps } from './Accordion.types'

/**
 * KRDS Accordion Component ( Pattern)
 * @param variant 아코디언 스타일 변형 ('default' | 'line')
 * @param allowMultiple 다중 선택 허용 여부
 * @param value 열린 아이템 값 배열 (제어 상태)
 * @param onChange 열린 아이템 변경 핸들러
 * @param defaultValue 초기 열린 아이템 값 배열 (비제어 상태)
 * @param children 자식 컴포넌트들
 */
const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(
  ({ variant = 'default', allowMultiple = true, value, onChange, defaultValue = [], children, className = '', ...props }, ref) => {
    const [expandedValues, setExpandedValues] = useUncontrolled<string[]>({
      value,
      defaultValue,
      finalValue: [],
      onChange
    })

    const handleToggle = useCallback(
      (itemValue: string) => {
        const isCurrentlyExpanded = expandedValues.includes(itemValue)

        if (allowMultiple) {
          const newExpandedValues = isCurrentlyExpanded ? expandedValues.filter(val => val !== itemValue) : [...expandedValues, itemValue]
          setExpandedValues(newExpandedValues)
        } else {
          const newExpandedValues = isCurrentlyExpanded ? [] : [itemValue]
          setExpandedValues(newExpandedValues)
        }
      },
      [expandedValues, allowMultiple, setExpandedValues]
    )

    const accordionClasses = classNames('krds-accordion', variant === 'line' && 'type-line', className)

    const contextValue = {
      expandedValues,
      onToggle: handleToggle,
      variant
    }

    return (
      <AccordionContext.Provider value={contextValue}>
        <div className={accordionClasses} ref={ref} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)

AccordionRoot.displayName = 'AccordionRoot'

const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Panel: AccordionPanel
})

Accordion.displayName = 'Accordion'

export default Accordion
