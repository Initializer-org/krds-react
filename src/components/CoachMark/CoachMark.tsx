import { classNames } from '@/utils'
import { forwardRef } from 'react'
import Button from '../Button'
import { CoachMarkProps } from './CoachMark.types'

/**
 * KRDS CoachMark Component
 * @param title 코치 마크 제목
 * @param description 코치 마크 설명
 * @param currentStep 현재 단계
 * @param totalSteps 총 단계 수
 * @param onSkip 그만보기 버튼 클릭 핸들러
 * @param onPrevious 이전으로 버튼 클릭 핸들러
 * @param onNext 다음으로 버튼 클릭 핸들러
 * @param children 코치 마크 내용
 * @param isVisible 코치 마크 표시 여부
 */
const CoachMark = forwardRef<HTMLDivElement, CoachMarkProps>(
  (
    {
      title = '1단계 : 코치 마크',
      description = '1단계 코치 마크 내용입니다.',
      currentStep = 1,
      totalSteps = 4,
      onSkip,
      onPrevious,
      onNext,
      children,
      isVisible = true,
      className = '',
      ...restProps
    },
    ref
  ) => {
    if (!isVisible) {
      return null
    }

    const handleSkip = () => {
      onSkip?.()
    }

    const handlePrevious = () => {
      onPrevious?.()
    }

    const handleNext = () => {
      onNext?.()
    }

    const showPreviousButton = currentStep > 1

    return (
      <div ref={ref} className={classNames('txt-box bg-white krds-coach-mark', className)} {...restProps}>
        <div className="coach-balloon">
          <h5 className="sr-only">따라하기 가이드</h5>
          <h6 className="coach-tit">{title}</h6>
          <p className="desc">{description}</p>
          <div className="coach-controls">
            <div className="num">
              <span className="sr-only">현재 단계</span>
              <strong>{currentStep}</strong>
              <span className="sr-only">총 단계</span>
              <span>{totalSteps}</span>
            </div>
            <div className="btn-wrap">
              <Button variant="text" size="small" onClick={handleSkip}>
                그만보기
              </Button>
              {showPreviousButton && (
                <Button variant="text" size="small" onClick={handlePrevious}>
                  이전으로
                </Button>
              )}
              <Button variant="tertiary" size="small" onClick={handleNext}>
                다음으로
              </Button>
            </div>
          </div>
        </div>

        <div>{children}</div>
      </div>
    )
  }
)

CoachMark.displayName = 'CoachMark'

export default CoachMark
