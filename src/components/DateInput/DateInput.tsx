import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { classNames } from '@/utils'
import { forwardRef, useId, useState, useRef, useEffect, useMemo } from 'react'
import { DateInputProps } from './DateInput.types'
import { CalendarDate } from '../Calendar/Calendar.types'

/**
 * KRDS DateInput Component
 * @param value 제어 상태일 때 입력된 값
 * @param defaultValue 비제어 상태일 때의 초기 값
 * @param onChange 입력 값이 변경될 때 호출되는 콜백
 * @param label 레이블
 * @param hint 도움말 텍스트
 * @param error 에러 메시지
 * @param success 성공 메시지
 * @param information 정보 메시지
 * @param size 입력 필드 크기 ('small' | 'medium' | 'large')
 * @param isCalendarOpen 달력 열림 상태
 * @param calendarPosition 달력 위치 ('top' | 'bottom')
 * @param disabledDates 비활성화할 날짜 배열
 * @param eventDates 이벤트가 있는 날짜 배열
 * @param disabled disabled 상태
 * @param readOnly readOnly 상태
 */
const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
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
      isCalendarOpen,
      defaultIsCalendarOpen = false,
      onCalendarOpenChange,
      calendarPosition = 'bottom',
      disabledDates = [],
      eventDates = [],
      onYearChange,
      onMonthChange,
      onTodayClick,
      onConfirm,
      onCancel,
      openButtonLabel = '달력 열기',
      prevButtonLabel = '이전 달',
      nextButtonLabel = '다음 달',
      yearSelectLabel = '연도 선택',
      monthSelectLabel = '월 선택',
      todayButtonText = '오늘',
      cancelButtonText = '취소',
      confirmButtonText = '확인',
      disabled = false,
      readOnly = false,
      className = '',
      id,
      placeholder = 'YYYY.MM.DD',
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

    const [internalIsOpen, setInternalIsOpen] = useUncontrolled({
      value: isCalendarOpen,
      defaultValue: defaultIsCalendarOpen,
      finalValue: false,
      onChange: onCalendarOpenChange
    })

    const parseDate = (dateString: string): Date | null => {
      if (!dateString) return null
      const parts = dateString.split('.')
      if (parts.length !== 3) return null

      const year = parseInt(parts[0])
      const month = parseInt(parts[1])
      const day = parseInt(parts[2])

      if (isNaN(year) || isNaN(month) || isNaN(day)) return null
      if (month < 1 || month > 12) return null
      if (day < 1 || day > 31) return null

      return new Date(year, month - 1, day)
    }

    const formatDate = (date: Date): string => {
      return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
    }

    const getCurrentYearMonth = (): { year: number; month: number } => {
      const today = new Date()

      if (_value) {
        const selectedDate = parseDate(_value)
        if (selectedDate) {
          return {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1
          }
        }
      }

      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1
      }
    }

    const [currentYearMonth, setCurrentYearMonth] = useState(getCurrentYearMonth)

    useEffect(() => {
      const newYearMonth = getCurrentYearMonth()
      setCurrentYearMonth(newYearMonth)
    }, [_value])

    const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false)

    const calendarWrapRef = useRef<HTMLDivElement>(null)

    const availableYears = useMemo(() => {
      const currentYear = new Date().getFullYear()
      return Array.from({ length: 101 }, (_, i) => {
        const year = currentYear - 50 + i
        return {
          value: year,
          label: `${year}년`,
          isActive: year === currentYearMonth.year,
          isDisabled: false
        }
      })
    }, [currentYearMonth.year])

    const availableMonths = useMemo(() => {
      return Array.from({ length: 12 }, (_, i) => {
        const month = i + 1
        return {
          value: month,
          label: `${month.toString().padStart(2, '0')}월`,
          isActive: month === currentYearMonth.month,
          isDisabled: false
        }
      })
    }, [currentYearMonth.month])

    const calendarDates = useMemo((): CalendarDate[] => {
      const { year, month } = currentYearMonth
      const today = new Date()
      const firstDay = new Date(year, month - 1, 1)
      const lastDay = new Date(year, month, 0)
      const firstDayOfWeek = firstDay.getDay()
      const daysInMonth = lastDay.getDate()

      const dates: CalendarDate[] = []

      const prevMonth = month === 1 ? 12 : month - 1
      const prevYear = month === 1 ? year - 1 : year
      const prevMonthLastDay = new Date(prevYear, prevMonth, 0).getDate()

      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i
        const dateString = `${prevYear}.${prevMonth.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`

        dates.push({
          year: prevYear,
          month: prevMonth,
          day,
          isOld: true,
          isDayOff: (firstDayOfWeek - 1 - i) % 7 === 0, // Sunday
          isDisabled: disabledDates.includes(dateString),
          hasEvent: eventDates.includes(dateString)
        })
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day)
        const dayOfWeek = date.getDay()
        const dateString = `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`
        const isToday = year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate()

        dates.push({
          year,
          month,
          day,
          isToday,
          isDayOff: dayOfWeek === 0, // Sunday
          isDisabled: disabledDates.includes(dateString),
          hasEvent: eventDates.includes(dateString)
        })
      }

      const remainingCells = 42 - dates.length // 6 weeks * 7 days
      const nextMonth = month === 12 ? 1 : month + 1
      const nextYear = month === 12 ? year + 1 : year

      for (let day = 1; day <= remainingCells; day++) {
        const dateString = `${nextYear}.${nextMonth.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`

        dates.push({
          year: nextYear,
          month: nextMonth,
          day,
          isNew: true,
          isDayOff: dates.length % 7 === 0, // Sunday
          isDisabled: disabledDates.includes(dateString),
          hasEvent: eventDates.includes(dateString)
        })
      }

      return dates
    }, [currentYearMonth, disabledDates, eventDates])

    const handleOpenCalendar = () => {
      if (disabled || readOnly) return
      setInternalIsOpen(true)

      setTimeout(() => {
        calendarWrapRef.current?.focus()
      }, 50)
    }

    const handleCloseCalendar = () => {
      setInternalIsOpen(false)
      setYearDropdownOpen(false)
      setMonthDropdownOpen(false)
    }

    const handlePrevMonth = () => {
      const newMonth = currentYearMonth.month === 1 ? 12 : currentYearMonth.month - 1
      const newYear = currentYearMonth.month === 1 ? currentYearMonth.year - 1 : currentYearMonth.year

      setCurrentYearMonth({ year: newYear, month: newMonth })
      onYearChange?.(newYear)
      onMonthChange?.(newMonth)
    }

    const handleNextMonth = () => {
      const newMonth = currentYearMonth.month === 12 ? 1 : currentYearMonth.month + 1
      const newYear = currentYearMonth.month === 12 ? currentYearMonth.year + 1 : currentYearMonth.year

      setCurrentYearMonth({ year: newYear, month: newMonth })
      onYearChange?.(newYear)
      onMonthChange?.(newMonth)
    }

    const handleYearSelect = (yearItem: { value: number; label: string; isDisabled?: boolean }) => {
      if (yearItem.isDisabled) return

      setCurrentYearMonth(prev => ({ ...prev, year: yearItem.value }))
      setYearDropdownOpen(false)
      onYearChange?.(yearItem.value)
    }

    const handleMonthSelect = (monthItem: { value: number; label: string; isDisabled?: boolean }) => {
      if (monthItem.isDisabled) return

      setCurrentYearMonth(prev => ({ ...prev, month: monthItem.value }))
      setMonthDropdownOpen(false)
      onMonthChange?.(monthItem.value)
    }

    const handleDateClick = (date: CalendarDate) => {
      if (date.isDisabled || date.isOld || date.isNew) return

      const dateString = `${date.year}.${date.month.toString().padStart(2, '0')}.${date.day.toString().padStart(2, '0')}`
      setValue(dateString)
    }

    const handleTodayClick = () => {
      const today = new Date()
      const todayString = formatDate(today)

      setValue(todayString)
      setCurrentYearMonth({
        year: today.getFullYear(),
        month: today.getMonth() + 1
      })

      onTodayClick?.()
    }

    const handleConfirm = () => {
      handleCloseCalendar()
      onConfirm?.()
    }

    const handleCancel = () => {
      handleCloseCalendar()
      onCancel?.()
    }

    const handleInputChange = (newValue: string) => {
      setValue(newValue)

      const parsedDate = parseDate(newValue)
      if (parsedDate) {
        setCurrentYearMonth({
          year: parsedDate.getFullYear(),
          month: parsedDate.getMonth() + 1
        })
      }
    }

    const isDateSelected = (date: CalendarDate): boolean => {
      const dateString = `${date.year}.${date.month.toString().padStart(2, '0')}.${date.day.toString().padStart(2, '0')}`
      return _value === dateString
    }

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (!internalIsOpen) return

        const target = event.target as Element
        if (!target.closest('.calendar-conts')) {
          handleCloseCalendar()
        }
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && internalIsOpen) {
          handleCloseCalendar()
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('click', handleClickOutside)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('click', handleClickOutside)
      }
    }, [internalIsOpen])

    const isError = Boolean(error)
    const isSuccess = Boolean(success) && !isError
    const isInformation = Boolean(information) && !isError && !isSuccess

    const containerClasses = classNames(
      'form-group',
      isError && 'is-error',
      isSuccess && 'is-success',
      isInformation && 'is-information',
      className
    )

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

        <div className="form-conts">
          <div className="form-conts calendar-conts">
            <div className="calendar-input">
              <input
                ref={ref}
                type="text"
                className={classNames('krds-input datepicker cal', size)}
                placeholder={placeholder}
                id={inputId}
                value={_value}
                onChange={e => handleInputChange(e.target.value)}
                disabled={disabled}
                readOnly={readOnly}
                {...props}
              />
              <button
                type="button"
                className="krds-btn medium icon form-btn-datepicker"
                onClick={handleOpenCalendar}
                aria-expanded={internalIsOpen}
                disabled={disabled}
              >
                <span className="sr-only">{openButtonLabel}</span>
                <i className="svg-icon ico-calendar"></i>
              </button>
            </div>

            <div className={classNames('krds-calendar-area', { active: internalIsOpen })}>
              <div className={classNames('calendar-wrap', calendarPosition)} aria-label="달력" tabIndex={0} ref={calendarWrapRef}>
                <div className="calendar-head">
                  <button type="button" className="btn-cal-move prev" onClick={handlePrevMonth}>
                    <span className="sr-only">{prevButtonLabel}</span>
                  </button>

                  <div className="calendar-switch-wrap">
                    <div className="calendar-drop-down">
                      <button
                        type="button"
                        className="btn-cal-switch year"
                        aria-label={yearSelectLabel}
                        onClick={() => {
                          setYearDropdownOpen(!yearDropdownOpen)
                          setMonthDropdownOpen(false)
                        }}
                        aria-expanded={yearDropdownOpen}
                      >
                        {currentYearMonth.year}년
                      </button>
                      <div
                        className={classNames('calendar-select calendar-year-wrap', {
                          active: yearDropdownOpen
                        })}
                      >
                        <ul className="sel year" role="listbox">
                          {availableYears.map(yearItem => (
                            <li key={yearItem.value} role="none">
                              <button
                                type="button"
                                role="option"
                                aria-selected={yearItem.value === currentYearMonth.year}
                                className={classNames({
                                  active: yearItem.value === currentYearMonth.year
                                })}
                                onClick={() => handleYearSelect(yearItem)}
                                disabled={yearItem.isDisabled}
                              >
                                {yearItem.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="calendar-drop-down">
                      <button
                        type="button"
                        className="btn-cal-switch month"
                        aria-label={monthSelectLabel}
                        onClick={() => {
                          setMonthDropdownOpen(!monthDropdownOpen)
                          setYearDropdownOpen(false)
                        }}
                        aria-expanded={monthDropdownOpen}
                      >
                        {currentYearMonth.month.toString().padStart(2, '0')}월
                      </button>
                      <div
                        className={classNames('calendar-select calendar-mon-wrap', {
                          active: monthDropdownOpen
                        })}
                      >
                        <ul className="sel month" role="listbox">
                          {availableMonths.map(monthItem => (
                            <li key={monthItem.value} role="none">
                              <button
                                type="button"
                                role="option"
                                aria-selected={monthItem.value === currentYearMonth.month}
                                className={classNames({
                                  active: monthItem.value === currentYearMonth.month
                                })}
                                onClick={() => handleMonthSelect(monthItem)}
                                disabled={monthItem.isDisabled}
                              >
                                {monthItem.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button type="button" className="btn-cal-move next" onClick={handleNextMonth}>
                    <span className="sr-only">{nextButtonLabel}</span>
                  </button>
                </div>

                <div className="calendar-body">
                  <div className="calendar-table-wrap">
                    <table className="calendar-tbl">
                      <caption>
                        {currentYearMonth.year}년 {currentYearMonth.month}월
                      </caption>
                      <thead>
                        <tr>
                          <th>일</th>
                          <th>월</th>
                          <th>화</th>
                          <th>수</th>
                          <th>목</th>
                          <th>금</th>
                          <th>토</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 6 }, (_, weekIndex) => (
                          <tr key={weekIndex}>
                            {Array.from({ length: 7 }, (_, dayIndex) => {
                              const dateIndex = weekIndex * 7 + dayIndex
                              const date = calendarDates[dateIndex]

                              if (!date) return <td key={dayIndex}></td>

                              const isSelected = isDateSelected(date)

                              const cellClasses = classNames({
                                old: date.isOld,
                                new: date.isNew,
                                today: date.isToday,
                                disabled: date.isDisabled,
                                'day-off': date.isDayOff,
                                'day-event': date.hasEvent,
                                period: isSelected,
                                start: isSelected,
                                end: isSelected
                              })

                              return (
                                <td
                                  key={dayIndex}
                                  className={cellClasses}
                                  data-date={`${date.year}.${date.month.toString().padStart(2, '0')}.${date.day.toString().padStart(2, '0')}`}
                                >
                                  <button
                                    type="button"
                                    className="btn-set-date"
                                    onClick={() => handleDateClick(date)}
                                    disabled={date.isDisabled || date.isOld || date.isNew}
                                    aria-pressed={isSelected}
                                    aria-label={date.hasEvent ? `${date.day} 일정있음` : date.isToday ? `${date.day} 오늘` : undefined}
                                  >
                                    <span>{date.day}</span>
                                  </button>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="calendar-footer">
                  <div className="calendar-btn-wrap">
                    <button type="button" className="krds-btn small text" onClick={handleTodayClick}>
                      {todayButtonText}
                    </button>
                    <button type="button" className="krds-btn small tertiary" onClick={handleCancel}>
                      {cancelButtonText}
                    </button>
                    <button type="button" className="krds-btn small primary" onClick={handleConfirm}>
                      {confirmButtonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {renderHintMessage()}
      </div>
    )
  }
)

DateInput.displayName = 'DateInput'

export { DateInput }
