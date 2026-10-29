import { Select } from '@krds.ui/react'

export default function SelectDemo() {
  return <Select label="발급 용도" options={[{ value: 'submit', label: '제출용' }]} />
}
