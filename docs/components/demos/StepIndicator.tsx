import { StepIndicator } from '@krds.ui/react'

export default function StepIndicatorDemo() {
  return (
    <StepIndicator
      currentStep={1}
      steps={[
        { step: '1단계', title: '신청' },
        { step: '2단계', title: '서류 검토' }
      ]}
    />
  )
}
