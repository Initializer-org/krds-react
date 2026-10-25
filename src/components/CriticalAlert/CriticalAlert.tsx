import { classNames } from '@/utils'
import { forwardRef } from 'react'
import Button from '../Button/Button'
import { CriticalAlertItemProps, CriticalAlertsProps } from './CriticalAlert.types'

/**
 * KRDS Critical Alert Component
 * @param alerts alert 목록
 * @param className custom class name
 */
export const CriticalAlerts = forwardRef<HTMLDivElement, CriticalAlertsProps>(({ alerts, className, ...props }, ref) => {
  return (
    <div ref={ref} className={classNames('main-urgent-wrap', className)} {...props}>
      <ul className="krds-critical-alerts">
        {alerts.map((alert, index) => (
          <CriticalAlertItem key={index} {...alert} />
        ))}
      </ul>
    </div>
  )
})

CriticalAlerts.displayName = 'CriticalAlerts'

const CriticalAlertItem = ({ variant, message, href, linkText = '자세히 보기' }: CriticalAlertItemProps) => {
  const variantText = {
    danger: '긴급',
    ok: '안전',
    info: '안내'
  }[variant]

  return (
    <li>
      <div className="critical-ban">
        <span className={classNames('critical-badge', variant)}>{variantText}</span>
        <p className="critical-txt">{message}</p>
        {href && (
          <Button as="a" href={href} variant="link" size="medium" className="basic">
            <span className="m-hide">{linkText}</span>
            <i className="svg-icon ico-angle right"></i>
          </Button>
        )}
      </div>
    </li>
  )
}

export const CriticalAlert = CriticalAlerts
