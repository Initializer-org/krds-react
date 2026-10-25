import { Select } from '@krds.ui/react'

export default function SelectDemo() {
  return (
    // id를 줘야 레이블이 연결된다 (README 알려진 문제)
    <Select id="purpose" label="발급 용도" options={[{ value: 'submit', label: '제출용' }]} />
  )
}
