import { classNames } from '@/utils'
import { forwardRef } from 'react'
import { StepIndicatorProps } from './StepIndicator.types'

/**
 * KRDS StepIndicator Component
 * @param steps 단계 목록
 * @param currentStep 현재 활성 단계 인덱스 (0부터 시작, 기본값 -1)
 * @param currentStepText 스크린 리더용 현재 단계 텍스트
 * @param pageTitle 페이지 타이틀 텍스트
 */
export const StepIndicator = forwardRef<HTMLOListElement, StepIndicatorProps>(
  ({ steps, currentStep = -1, currentStepText = '현재단계', pageTitle, className, ...props }, ref) => {
    const getStepStatus = (index: number): 'default' | 'done' | 'active' => {
      if (index < currentStep) return 'done'
      if (index === currentStep) return 'active'
      return 'default'
    }

    const stepList = (
      <ol ref={ref} className={classNames('krds-step-wrap', className)} {...props}>
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const isActive = status === 'active'
          const stepKey = step.id || `step-${index}`

          return (
            <li key={stepKey} className={status !== 'default' ? status : undefined}>
              <span>
                {isActive && <em className="sr-only">{currentStepText}</em>}
                <i className="step">{step.step}</i>
                <span className="step-tit">{step.title}</span>
              </span>
            </li>
          )
        })}
      </ol>
    )

    if (pageTitle) {
      return (
        <div className="page-title-wrap between">
          <h2 className="h-tit">{pageTitle}</h2>
          {stepList}
        </div>
      )
    }

    return stepList
  }
)

StepIndicator.displayName = 'StepIndicator'
