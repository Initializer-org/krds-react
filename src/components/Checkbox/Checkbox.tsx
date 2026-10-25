import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { classNames } from '@/utils'
import React, { forwardRef, useState } from 'react'
import { CheckboxChipProps, CheckboxGroupProps, CheckboxProps } from './Checkbox.types'

/**
 * KRDS Checkbox Component
 * @param size 체크박스 크기 ('medium' | 'large')
 * @param checked 체크박스 선택 상태
 * @param disabled 체크박스 비활성화 상태
 * @param label 체크박스 레이블 텍스트
 * @param description 추가 설명 텍스트
 * @param className 사용자 정의 클래스명
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { id, name, defaultValue, checked, disabled = false, size = 'medium', children, description, onChange, className, label, ...props },
    ref
  ) => {
    const [_checked, setChecked] = useUncontrolled<boolean>({
      value: checked,
      defaultValue,
      onChange: (value: boolean) => {
        if (onChange) {
          const syntheticEvent = {
            target: { checked: value }
          } as React.ChangeEvent<HTMLInputElement>
          onChange(syntheticEvent)
        }
      }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked)
    }

    const checkboxClasses = classNames('krds-form-check', size, className)

    return (
      <div className={checkboxClasses}>
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={_checked}
          disabled={disabled}
          onChange={handleChange}
          ref={ref}
          aria-label={label || '레이블'}
          {...props}
        />
        <label htmlFor={id}>{children || label}</label>
        {description && (
          <div className="krds-form-check-cnt">
            <p className="krds-form-check-p">{description}</p>
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

/**
 * KRDS CheckboxChip Component
 * @param size 체크박스 칩 크기 ('small' | 'medium' | 'large')
 * @param checked 체크박스 선택 상태
 * @param disabled 체크박스 비활성화 상태
 * @param className 사용자 정의 클래스명
 */
const CheckboxChip = forwardRef<HTMLInputElement, CheckboxChipProps>(
  ({ id, name, defaultValue, checked, disabled = false, size = 'medium', children, onChange, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    const checkboxClasses = classNames('krds-form-chip', size, isFocused && 'focus', className)

    const [_checked, setChecked] = useUncontrolled<boolean>({
      value: checked,
      defaultValue: defaultValue as unknown as boolean,
      onChange: (value: boolean) => {
        if (onChange) {
          const syntheticEvent = {
            target: { checked: value }
          } as React.ChangeEvent<HTMLInputElement>
          onChange(syntheticEvent)
        }
      }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked)
    }

    const handleFocus = () => {
      setIsFocused(true)
    }

    const handleBlur = () => {
      setIsFocused(false)
    }

    return (
      <div className={checkboxClasses}>
        <input
          type="checkbox"
          className="checkbox"
          id={id}
          name={name}
          checked={_checked}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={ref}
          {...props}
        />
        <label className="krds-form-chip-outline" htmlFor={id}>
          {children}
        </label>
      </div>
    )
  }
)

CheckboxChip.displayName = 'CheckboxChip'

/**
 * KRDS CheckboxGroup Component
 * @param column 레이아웃 방향 (true: 세로, false: 가로)
 * @param className 사용자 정의 클래스명
 */
const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ children, column = false, className }) => {
  return <div className={classNames('krds-check-area', column && 'chk-column', className)}>{children}</div>
}

CheckboxGroup.displayName = 'CheckboxGroup'

export { Checkbox, CheckboxChip, CheckboxGroup }
