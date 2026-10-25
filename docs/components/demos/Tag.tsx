import { Tag } from '@krds.ui/react'

export default function TagDemo() {
  return (
    // TagWrap이 패키지 최상위에서 export되지 않아 같은 마크업(krds-tag-wrap)을 직접 쓴다
    <div className="krds-tag-wrap medium">
      <Tag>주민등록</Tag>
      <Tag>건강보험</Tag>
      <Tag variant="link" href="#tax">
        지방세
      </Tag>
    </div>
  )
}
