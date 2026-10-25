import { InPageNavigation } from '@krds.ui/react'

export default function InPageNavigationDemo() {
  return (
    <InPageNavigation
      title="이 페이지의 구성"
      items={[
        { href: '#overview', label: '개요' },
        { href: '#process', label: '처리 절차' }
      ]}
    />
  )
}
