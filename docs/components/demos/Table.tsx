import { Table } from '@krds.ui/react'

export default function TableDemo() {
  return (
    <Table>
      <Table.Caption>민원 처리 현황</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th scope="col">민원</Table.Th>
          <Table.Th scope="col">상태</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>전입신고</Table.Td>
          <Table.Td>처리 중</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  )
}
