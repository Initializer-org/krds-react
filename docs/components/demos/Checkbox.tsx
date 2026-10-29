import { Checkbox, CheckboxGroup } from '@krds.ui/react'

export default function CheckboxDemo() {
  return (
    <CheckboxGroup>
      <Checkbox name="agree" value="privacy">
        개인정보 수집·이용 동의
      </Checkbox>
      <Checkbox name="agree" value="sms">
        문자 알림 동의
      </Checkbox>
    </CheckboxGroup>
  )
}
