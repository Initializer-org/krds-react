import { useState } from 'react'

export interface UseUncontrolledOptions<T> {
  /**
   * 제어 상태에서 사용할 값
   * Value when component is in controlled mode
   */
  value?: T

  /**
   * 비제어 상태일 때 사용할 초기 값
   * Initial value when component is in uncontrolled mode
   */
  defaultValue?: T

  /**
   * value와 defaultValue가 제공되지 않았을 때 사용할 최종 기본 값
   * Fallback value when both `value` and `defaultValue` are undefined
   */
  finalValue?: T

  /**
   * 제어 상태일 때 호출되는 변경 핸들러
   * Change handler used in controlled mode
   */
  onChange?: (value: T, ...payload: any[]) => void
}

export type UseUncontrolledReturnValue<T> = [
  /**
   * 현재 값
   * Current value (from `value` if controlled, internal state if uncontrolled)
   */
  T,

  /**
   * 값을 업데이트하는 함수
   * Function to update the value (calls `onChange` or updates internal state)
   */
  (value: T, ...payload: any[]) => void,

  /**
   * 현재 상태가 제어 상태인지 여부
   * Whether the component is in controlled mode (`true`) or uncontrolled (`false`)
   */
  boolean
]

/**
 * 제어 상태와 비제어 상태를 모두 지원하는 커스텀 훅
 * Custom hook that supports both controlled and uncontrolled usage
 */
export function useUncontrolled<T>({
  value,
  defaultValue,
  finalValue,
  onChange = () => {}
}: UseUncontrolledOptions<T>): UseUncontrolledReturnValue<T> {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue !== undefined ? defaultValue : finalValue)

  const handleUncontrolledChange = (val: T, ...payload: any[]) => {
    setUncontrolledValue(val)
    onChange?.(val, ...payload)
  }

  // 제어 상태인 경우: 외부 value와 onChange를 그대로 사용
  // Controlled mode: use external `value` and `onChange` directly
  if (value !== undefined) {
    return [value as T, onChange, true]
  }

  // 비제어 상태인 경우: 내부 상태를 사용하여 값 관리
  // Uncontrolled mode: use internal state
  return [uncontrolledValue as T, handleUncontrolledChange, false]
}
