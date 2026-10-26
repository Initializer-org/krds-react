import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { classNames } from '@/utils'
import React, { createContext, forwardRef, useContext, useId, useMemo, useState } from 'react'
import { RadioChipProps, RadioGroupContextType, RadioGroupProps, RadioProps } from './Radio.types'

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined)

/**
 * KRDS Radio 컴포넌트
 * @param value 라디오 버튼의 값 (RadioGroup 내에서 사용)
 * @param checked 선택 상태 (controlled mode)
 * @param defaultChecked 초기 선택 상태 (uncontrolled mode)
 * @param disabled 비활성화 여부
 * @param size 라디오 버튼 크기 ('medium' | 'large')
 * @param description 부가적인 설명 텍스트
 * @param onChange 값 변경 시 호출되는 콜백
 * @param className 추가 커스텀 클래스
 */
const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    { id, name, defaultChecked, checked, disabled = false, size = 'medium', children, description, onChange, className, value, ...props },
    ref
  ) => {
    const radioClasses = classNames('krds-form-check', size, className)

    const radioGroup = useContext(RadioGroupContext)

    // 렌더할 때마다 Math.random()으로 만들면 서버 렌더링과 브라우저의 id가 달라지므로 useId
    const generatedId = useId()
    const autoId = id ?? generatedId

    const isInGroup = !!radioGroup
    const groupValue = radioGroup?.value
    const groupName = radioGroup?.name
    const groupOnChange = radioGroup?.onChange

    const uniqueName = useMemo(() => {
      if (isInGroup) return groupName
      if (name) return name
      return `radio-${autoId}`
    }, [isInGroup, groupName, name, autoId])

    const isChecked = isInGroup ? groupValue === value : checked

    const [_checked, setChecked] = useUncontrolled<boolean>({
      value: isChecked,
      defaultValue: defaultChecked,
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
      if (isInGroup && value !== undefined) {
        if (typeof value === 'string') {
          groupOnChange?.(value)
        }
      } else {
        setChecked(e.target.checked)
      }
    }

    return (
      <div className={radioClasses}>
        <input
          type="radio"
          id={autoId}
          name={uniqueName}
          checked={_checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        <label htmlFor={autoId}>{children}</label>
        {description && (
          <div className="krds-form-check-cnt">
            <p className="krds-form-check-p">{description}</p>
          </div>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'

/**
 * KRDS RadioChip 컴포넌트
 * @param value 라디오 칩의 값 (RadioGroup 내에서 사용)
 * @param checked 선택 상태 (controlled mode)
 * @param defaultChecked 초기 선택 상태 (uncontrolled mode)
 * @param disabled 비활성화 여부
 * @param size 라디오 칩 크기 ('small' | 'medium' | 'large')
 * @param onChange 값 변경 시 호출되는 콜백
 * @param className 추가 커스텀 클래스
 */
const RadioChip = forwardRef<HTMLInputElement, RadioChipProps>(
  ({ id, name, defaultChecked, checked, disabled = false, size = 'medium', children, onChange, className, value, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    const radioChipClasses = classNames('krds-form-chip', size, isFocused && 'focus', className)

    const radioGroup = useContext(RadioGroupContext)

    // 렌더할 때마다 Math.random()으로 만들면 서버 렌더링과 브라우저의 id가 달라지므로 useId
    const generatedId = useId()
    const autoId = id ?? generatedId

    const isInGroup = !!radioGroup
    const groupValue = radioGroup?.value
    const groupName = radioGroup?.name
    const groupOnChange = radioGroup?.onChange

    const uniqueName = useMemo(() => {
      if (isInGroup) return groupName
      if (name) return name
      return `radio-chip-${autoId}`
    }, [isInGroup, groupName, name, autoId])

    const isChecked = isInGroup ? groupValue === value : checked

    const [_checked, setChecked] = useUncontrolled<boolean>({
      value: isChecked,
      defaultValue: defaultChecked,
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
      if (isInGroup && value !== undefined) {
        if (typeof value === 'string') {
          groupOnChange?.(value)
        }
      } else {
        setChecked(e.target.checked)
      }
    }

    const handleFocus = () => {
      setIsFocused(true)
    }

    const handleBlur = () => {
      setIsFocused(false)
    }

    return (
      <div className={radioChipClasses}>
        <input
          type="radio"
          className="radio"
          id={autoId}
          name={uniqueName}
          checked={_checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={ref}
          {...props}
        />
        <label className="krds-form-chip-outline" htmlFor={autoId}>
          {children}
        </label>
      </div>
    )
  }
)

RadioChip.displayName = 'RadioChip'

/**
 * KRDS RadioGroup 컴포넌트
 * @param value 라디오 그룹의 값 (controlled mode)
 * @param defaultValue 초기 값 (uncontrolled mode)
 * @param onChange 값 변경 시 호출되는 콜백
 * @param name 라디오 그룹의 이름
 * @param children Radio 또는 RadioChip 컴포넌트들
 * @param className 추가 커스텀 클래스
 * @param column 세로 배치 여부
 */
const RadioGroup: React.FC<RadioGroupProps> = ({ value, defaultValue, onChange, name, children, className, column = false }) => {
  const [currentValue, handleChange] = useUncontrolled({
    value,
    defaultValue,
    onChange
  })

  const contextValue: RadioGroupContextType = {
    value: currentValue,
    onChange: handleChange,
    name
  }

  const groupClasses = classNames('krds-check-area', column && 'chk-column', className)

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div className={groupClasses}>{children}</div>
    </RadioGroupContext.Provider>
  )
}

RadioGroup.displayName = 'RadioGroup'

export { Radio, RadioChip, RadioGroup }
