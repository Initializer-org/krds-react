import { Tab, TabList, TabPanel, TabTrigger } from '@krds.ui/react'

export default function TabDemo() {
  return (
    <Tab defaultValue="overview">
      <TabList>
        <TabTrigger value="overview">개요</TabTrigger>
        <TabTrigger value="process">절차</TabTrigger>
      </TabList>
      <TabPanel value="overview">개요 내용</TabPanel>
      <TabPanel value="process">절차 내용</TabPanel>
    </Tab>
  )
}
