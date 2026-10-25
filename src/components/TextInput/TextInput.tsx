import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { classNames } from '@/utils'
import { forwardRef, useId, useState, useEffect } from 'react'
import { TextInputProps } from './TextInput.types'
import Button from '../Button'

/**
 * KRDS TextInput Component
 * @param value 제어 상태일 때 입력된 값
 * @param defaultValue 비제어 상태일 때의 초기 값
 * @param onChange 입력 값이 변경될 때 호출되는 콜백
 * @param label 레이블
 * @param hint 도움말 텍스트
 * @param error 에러 메시지
 * @param success 성공 메시지
 * @param information 정보 메시지
 * @param size 입력 필드 크기 ('small' | 'medium' | 'large' | 'xlarge')
 * @param showPasswordToggle 비밀번호 보기/숨기기 버튼 표시 여부
 * @param showClearButton 삭제 버튼 표시 여부
 * @param type 입력 필드 타입
 * @param disabled disabled 상태
 * @param readOnly readOnly 상태
 * @param className custom class name
 */
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      label,
      hint,
      error,
      success,
      information,
      size = 'large',
      showPasswordToggle = false,
      showClearButton = false,
      type = 'text',
      disabled = false,
      readOnly = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || generatedId

    const [_value, setValue] = useUncontrolled<string>({
      value,
      defaultValue,
      onChange,
      finalValue: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [internalType, setInternalType] = useState(type)

    useEffect(() => {
      if (type === 'password') {
        setInternalType(showPassword ? 'text' : 'password')
      } else {
        setInternalType(type)
      }
    }, [type, showPassword])

    const isError = Boolean(error)
    const isSuccess = Boolean(success) && !isError
    const isInformation = Boolean(information) && !isError && !isSuccess

    const shouldShowPasswordToggle = showPasswordToggle && type === 'password'
    const shouldShowClearButton = showClearButton && _value && !disabled && !readOnly
    const hasButtons = shouldShowPasswordToggle || shouldShowClearButton

    const containerClasses = classNames(
      'form-group',
      isError && 'is-error',
      isSuccess && 'is-success',
      isInformation && 'is-information',
      className
    )

    const inputWrapperClasses = classNames('form-conts', hasButtons && 'btn-ico-wrap')

    const handleClear = () => {
      setValue('')
    }

    const handlePasswordToggle = () => {
      setShowPassword(prev => !prev)
    }

    const renderHintMessage = () => {
      if (isError) {
        return <p className="form-hint-invalid">{error}</p>
      }
      if (isSuccess) {
        return <p className="form-hint-success">{success}</p>
      }
      if (isInformation) {
        return <p className="form-hint-information">{information}</p>
      }
      if (hint) {
        return <p className="form-hint">{hint}</p>
      }
      return null
    }

    return (
      <div className={containerClasses}>
        {label && (
          <div className="form-tit">
            <label htmlFor={inputId}>{label}</label>
          </div>
        )}

        <div className={inputWrapperClasses} {...(shouldShowClearButton && { 'data-delete': 'true' })}>
          <input
            ref={ref}
            id={inputId}
            type={internalType}
            className={classNames('krds-input', size)}
            value={_value}
            onChange={e => setValue(e.target.value)}
            disabled={disabled}
            readOnly={readOnly}
            {...props}
          />

          {hasButtons && (
            <div className="btn-group">
              {shouldShowClearButton && (
                <Button variant="icon" size="medium" className="pure btn-delete-input" onClick={handleClear}>
                  <span className="sr-only">내용 삭제</span>
                  <i className="svg-icon ico-delete-fill" />
                </Button>
              )}

              {shouldShowPasswordToggle && (
                <Button variant="icon" size="medium" onClick={handlePasswordToggle}>
                  <span className="sr-only">{showPassword ? '입력한 비밀번호 가리기' : '입력한 비밀번호 보기'}</span>
                  <i
                    className={classNames(
                      'svg-icon ico-pw-visible',
                      showPassword && 'ico-pw-visible-on',
                      !showPassword && 'ico-pw-visible'
                    )}
                  />
                </Button>
              )}
            </div>
          )}
        </div>

        {renderHintMessage()}
      </div>
    )
  }
)

TextInput.displayName = 'TextInput'

export default TextInput
