import { Radio, RadioGroup } from '@krds.ui/react'

export default function RadioDemo() {
  return (
    <RadioGroup name="auth" defaultValue="phone">
      <Radio value="phone">휴대폰 인증</Radio>
      <Radio value="cert">공동인증서</Radio>
    </RadioGroup>
  )
}
