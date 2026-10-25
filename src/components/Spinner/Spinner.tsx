import { classNames } from '@/utils'
import React from 'react'
import type { SpinnerProps } from './Spinner.types'

/**
 * KRDS Spinner 컴포넌트
 * @param label 스피너 옆에 표시할 텍스트
 * @param className 추가 커스텀 클래스
 * @param children input 등 자식 요소가 있을 경우 form-spinner 래퍼로 감쌈
 */
const Spinner: React.FC<SpinnerProps> = ({ label, className, children }) => {
  const spinnerElement = (
    <div className={classNames('krds-spinner', className)} role="status">
      <span className="sr-only">로딩 중</span>
      {label}
    </div>
  )

  if (children) {
    return (
      <div className="form-spinner">
        {children}
        {spinnerElement}
      </div>
    )
  }

  return spinnerElement
}

export default Spinner
