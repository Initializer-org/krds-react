import { createContext, useContext } from 'react'

export interface AccordionItemContextValue {
  /** 아이템 값 */
  value: string
  /** 열림 상태 */
  isExpanded: boolean
  /** 아이템 고유 식별자 */
  itemId: string
}

export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null)

export const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext)
  if (!context) {
    throw new Error('AccordionHeader와 AccordionPanel은 AccordionItem 컴포넌트 내부에서 사용되어야 합니다.')
  }
  return context
}
