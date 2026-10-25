import { CheckboxChip } from '@krds.ui/react'

export default function CheckboxChipDemo() {
  return (
    // id를 줘야 레이블이 연결된다 (README 알려진 문제)
    <CheckboxChip id="chip-all" name="chip">
      전체
    </CheckboxChip>
  )
}
