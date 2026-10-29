import { classNames } from '@/utils'
import React, { forwardRef, useId } from 'react'
import { SelectProps } from './Select.types'
import { useUncontrolled } from '@/hooks/use-uncontrolled'

const Select: React.FC<SelectProps> = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      options,
      label,
      hint,
      error,
      size = 'large',
      variant = 'default',
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [_value, setValue] = useUncontrolled({
      value,
      defaultValue,
      onChange
    })

    // id를 주지 않아도 레이블이 연결되도록 (원본은 id가 없으면 레이블이 연결되지 않았음)
    const generatedId = useId()
    const selectId = props.id ?? generatedId

    const selectClasses = classNames(
      variant === 'sorting' ? 'krds-form-select-sort' : 'krds-form-select',
      size,
      error && 'is-error',
      disabled && 'disabled',
      className
    )

    if (variant === 'sorting') {
      return (
        <select
          className={selectClasses}
          disabled={disabled}
          value={_value}
          onChange={e => setValue(e.target.value)}
          title="선택"
          {...props}
          ref={ref}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <div className="form-group">
        {label && (
          <div className="form-tit">
            <label htmlFor={selectId}>{label}</label>
          </div>
        )}
        <div className="form-conts">
          <select
            className={selectClasses}
            disabled={disabled}
            value={_value}
            onChange={e => setValue(e.target.value)}
            {...props}
            id={selectId}
            ref={ref}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {hint && !error && <p className="form-hint">{hint}</p>}
        {error && <p className="form-hint-invalid">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
