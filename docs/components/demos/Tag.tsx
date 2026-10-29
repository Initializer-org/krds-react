import { Tag, TagWrap } from '@krds.ui/react'

export default function TagDemo() {
  return (
    <TagWrap>
      <Tag>주민등록</Tag>
      <Tag>건강보험</Tag>
      <Tag variant="link" href="#tax">
        지방세
      </Tag>
    </TagWrap>
  )
}
