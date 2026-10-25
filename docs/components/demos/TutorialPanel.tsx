import { TutorialPanel } from '@krds.ui/react'

export default function TutorialPanelDemo() {
  return (
    <TutorialPanel isOpen>
      <TutorialPanel.Container>
        <TutorialPanel.HelpContent>신청서 작성 도움말</TutorialPanel.HelpContent>
      </TutorialPanel.Container>
    </TutorialPanel>
  )
}
