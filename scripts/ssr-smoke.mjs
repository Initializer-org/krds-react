// 빌드 결과(dist)의 모든 컴포넌트가 서버 렌더링되는지 확인한다
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import * as L from '../dist/index.js'

// 필수 props가 있거나 부모 안에서만 쓰는 컴포넌트
const cases = {
  AccordionItem: () => h(L.Accordion, {}, h(L.AccordionItem, { title: 'a' }, 'x')),
  Breadcrumb: () => h(L.Breadcrumb, { items: [{ label: '홈', href: '/' }] }),
  CriticalAlert: () => h(L.CriticalAlert, { alerts: [] }),
  Select: () => h(L.Select, { options: [{ value: 'a', label: 'A' }] }),
  StepIndicator: () => h(L.StepIndicator, { steps: [{ label: '신청' }] }),
  Tab: () => h(L.Tab, {}, h(L.TabList, {}, h(L.TabTrigger, { value: 'a' }, 'A')), h(L.TabPanel, { value: 'a' }, 'x'))
}
cases.TabList = cases.TabTrigger = cases.TabPanel = cases.Tab
const noChildren = new Set(['DateInput', 'TextInput', 'Textarea', 'ToggleSwitch'])

const names = Object.keys(L).filter(n => /^[A-Z]/.test(n))
const failed = []
for (const n of names) {
  try {
    renderToString(cases[n]?.() ?? h(L[n], {}, noChildren.has(n) ? undefined : 'x'))
  } catch (e) {
    failed.push(`${n}: ${String(e.message).split('\n')[0]}`)
  }
}
if (failed.length) {
  console.error(failed.join('\n'))
  process.exit(1)
}
console.log(`SSR 렌더링 통과 ${names.length}개`)
