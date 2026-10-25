import { Checkbox, CheckboxGroup } from '@krds.ui/react'

export default function CheckboxDemo() {
  return (
    // 레이블은 id와 label로 준다 (children만 쓰면 레이블이 연결되지 않고 이름이 '레이블'로 고정됨, README 알려진 문제)
    <CheckboxGroup>
      <Checkbox id="agree-privacy" name="agree" value="privacy" label="개인정보 수집·이용 동의" />
      <Checkbox id="agree-sms" name="agree" value="sms" label="문자 알림 동의" />
    </CheckboxGroup>
  )
}
