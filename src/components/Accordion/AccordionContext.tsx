import { createContext, useContext } from 'react'
import { AccordionContextValue } from './Accordion.types'

export const AccordionContext = createContext<AccordionContextValue | null>(null)

export const useAccordionContext = () => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion 하위 컴포넌트는 Accordion 컴포넌트 내부에서 사용되어야 합니다.')
  }
  return context
}
