import { Accordion } from '@krds.ui/react'

export default function AccordionDemo() {
  return (
    <Accordion defaultValue={['eligibility']}>
      <Accordion.Item value="eligibility">
        <Accordion.Header>신청 자격</Accordion.Header>
        <Accordion.Panel>만 19세 이상 국민</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="method">
        <Accordion.Header>신청 방법</Accordion.Header>
        <Accordion.Panel>온라인 또는 방문</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}
