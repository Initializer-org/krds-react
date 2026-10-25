import { Breadcrumb } from '@krds.ui/react'

export default function BreadcrumbDemo() {
  return (
    <Breadcrumb
      items={[
        { text: '홈', href: '/' },
        { text: '민원 신청', href: '/apply' }
      ]}
    />
  )
}
