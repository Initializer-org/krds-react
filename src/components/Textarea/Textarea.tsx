import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { classNames } from '@/utils'
import React, { forwardRef, useId, useMemo } from 'react'
import { TextareaProps } from './Textarea.types'

/**
 * KRDS Textarea Component
 * @param value 제어 상태일 때 입력된 값
 * @param defaultValue 비제어 상태일 때의 초기 값
 * @param onChange 입력 값이 변경될 때 호출되는 콜백
 * @param label 레이블
 * @param countTotal 글자수 총합 표시값
 * @param maxLength 최대 글자수
 * @param showCount 글자수 카운터 표시 여부
 * @param disabled disabled 상태
 * @param readOnly readOnly 상태
 * @param className custom class name
 */
const Textarea: React.FC<TextareaProps> = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      label,
      maxLength,
      showCount = true,
      countTotal = 100,
      disabled = false,
      readOnly = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const textareaId = id || generatedId

    const [_value, setValue] = useUncontrolled<string>({
      value,
      defaultValue,
      onChange
    })

    const currentLength = useMemo(() => {
      return _value ? _value.length : 0
    }, [_value])

    const shouldShowCount = showCount || Boolean(maxLength)

    const textareaClasses = classNames('krds-input', className)

    const containerClasses = classNames('form-group')

    return (
      <div className={containerClasses}>
        {label && (
          <div className="form-tit">
            <label htmlFor={textareaId}>{label}</label>
          </div>
        )}

        <div className="form-conts">
          <div className="textarea-wrap">
            <textarea
              ref={ref}
              id={textareaId}
              className={textareaClasses}
              value={_value}
              onChange={e => setValue(e.target.value)}
              disabled={disabled}
              readOnly={readOnly}
              maxLength={maxLength}
              {...props}
            />

            {shouldShowCount && (
              <p className="textarea-count">
                <span className="count-now">{currentLength}</span>
                <span className="count-total">/{maxLength ?? countTotal}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
