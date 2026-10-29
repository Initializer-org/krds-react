import { HelpPanel, HelpPanelContent, HelpSection, HelpLinkList, HelpPanelAction, HelpPanelClose } from '@krds.ui/react'

export default function HelpPanelDemo() {
  return (
    <HelpPanel defaultOpen>
      <HelpPanelContent srOnlyTitle="신청서 작성 도움말">
        <HelpSection title="신청 전 확인하세요" description="필요한 서류와 신청 절차를 확인할 수 있습니다.">
          <HelpLinkList links={[{ text: '신청 안내', href: '#guide' }]} />
        </HelpSection>
        <HelpPanelAction>
          <HelpPanelClose />
        </HelpPanelAction>
      </HelpPanelContent>
    </HelpPanel>
  )
}
