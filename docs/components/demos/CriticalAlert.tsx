import { CriticalAlert } from '@krds.ui/react'

export default function CriticalAlertDemo() {
  return <CriticalAlert alerts={[{ variant: 'danger', message: '시스템 점검 안내', href: '#notice', linkText: '자세히 보기' }]} />
}
