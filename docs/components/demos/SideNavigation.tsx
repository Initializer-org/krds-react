import { SideNavigation } from '@krds.ui/react'

export default function SideNavigationDemo() {
  return (
    <SideNavigation>
      <SideNavigation.Title>민원 신청</SideNavigation.Title>
      <SideNavigation.Menu>
        <SideNavigation.Item>
          <SideNavigation.Link href="#apply">신청하기</SideNavigation.Link>
        </SideNavigation.Item>
      </SideNavigation.Menu>
    </SideNavigation>
  )
}
