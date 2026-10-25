import { StructuredList, StructuredListBody, StructuredListDescription, StructuredListItem, StructuredListTitle } from '@krds.ui/react'

export default function StructuredListDemo() {
  return (
    <StructuredList>
      <StructuredListItem>
        <StructuredListBody>
          <StructuredListTitle>주민등록표 등본 발급</StructuredListTitle>
          <StructuredListDescription>2026.10.02 신청</StructuredListDescription>
        </StructuredListBody>
      </StructuredListItem>
    </StructuredList>
  )
}
