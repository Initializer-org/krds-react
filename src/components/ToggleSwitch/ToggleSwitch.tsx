import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { classNames } from '@/utils'
import React, { forwardRef, useId, useState } from 'react'
import { ToggleSwitchProps } from './ToggleSwitch.types'

/**
 * KRDS ToggleSwitch Component
 * @param size 토글 스위치 크기 ('medium' | 'large')
 * @param label 토글 스위치 라벨 텍스트
 * @param checked 체크 상태 (제어된 컴포넌트)
 * @param defaultChecked 기본 체크 상태 (비제어 컴포넌트)
 * @param onChange 값 변경 핸들러
 * @param className 추가 CSS 클래스명
 */
export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ size = 'large', label, checked, defaultChecked = false, onChange, className, id: providedId, disabled, ...rest }, ref) => {
    const autoId = useId()
    const id = providedId || autoId

    const [isFocused, setIsFocused] = useState(false)

    const [internalChecked, handleCheckedChange] = useUncontrolled({
      value: checked,
      defaultValue: defaultChecked,
      finalValue: false,
      onChange: (value, event) => {
        if (!disabled) {
          onChange?.(value, event as React.ChangeEvent<HTMLInputElement>)
        }
      }
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) {
        return
      }
      handleCheckedChange(event.target.checked, event)
    }

    const handleFocus = () => {
      setIsFocused(true)
    }

    const handleBlur = () => {
      setIsFocused(false)
    }

    const containerClasses = classNames(
      'krds-form-toggle-switch',
      size === 'medium' && 'medium',
      size === 'large' && 'large',
      isFocused && 'focus',
      className
    )

    return (
      <div className={containerClasses}>
        <input
          ref={ref}
          type="checkbox"
          id={id}
          checked={internalChecked}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        <label htmlFor={id}>
          <span className="switch-toggle">
            <i></i>
          </span>
          {label}
        </label>
      </div>
    )
  }
)

ToggleSwitch.displayName = 'ToggleSwitch'
