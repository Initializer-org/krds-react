import { useState, useRef, useEffect, forwardRef, useMemo, useCallback } from 'react'
import { CalendarProps, CalendarDate } from './Calendar.types'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { classNames } from '@/utils'

/**
 * KRDS Calendar Component
 * @param mode 달력 모드 ('single' | 'range')
 * @param position 달력 위치 ('top' | 'bottom')
 * @param value 현재 선택된 날짜 (단일 선택)
 * @param defaultValue 기본 선택된 날짜 (단일 선택)
 * @param startDate 범위 선택 시작 날짜
 * @param endDate 범위 선택 종료 날짜
 * @param defaultStartDate 기본 범위 선택 시작 날짜
 * @param defaultEndDate 기본 범위 선택 종료 날짜
 * @param disabledDates 비활성화할 날짜 배열
 * @param eventDates 이벤트가 있는 날짜 배열
 * @param isOpen 달력 열림 상태
 * @param defaultIsOpen 기본 달력 열림 상태
 * @param label 입력 필드 레이블
 * @param placeholder 입력 필드 placeholder
 * @param disabled 비활성화 여부
 * @param readOnly 읽기 전용 여부
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      mode = 'single',
      position = 'bottom',
      value,
      defaultValue = '',
      startDate,
      endDate,
      defaultStartDate = '',
      defaultEndDate = '',
      disabledDates = [],
      eventDates = [],
      isOpen,
      defaultIsOpen = false,
      onOpenChange,
      onChange,
      onRangeChange,
      onYearChange,
      onMonthChange,
      onTodayClick,
      onConfirm,
      onCancel,
      label = '기간선택',
      inputId = 'cal',
      placeholder = 'YYYY.MM.DD',
      startPlaceholder = '시작날짜',
      endPlaceholder = '종료날짜',
      startTitle = '시작날짜 입력',
      endTitle = '종료날짜 입력',
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
      className: _className,
      ...rest
    },
    ref
  ) => {
    const [internalIsOpen, setInternalIsOpen] = useUncontrolled({
      value: isOpen,
      defaultValue: defaultIsOpen,
      finalValue: false,
      onChange: onOpenChange
    })

    const [internalValue, setInternalValue] = useUncontrolled({
      value,
      defaultValue,
      finalValue: '',
      onChange
    })

    const [internalStartDate, setInternalStartDate] = useUncontrolled({
      value: startDate,
      defaultValue: defaultStartDate,
      finalValue: '',
      onChange: newStartDate => {
        if (onRangeChange) {
          onRangeChange(newStartDate, internalEndDate)
        }
      }
    })

    const [internalEndDate, setInternalEndDate] = useUncontrolled({
      value: endDate,
      defaultValue: defaultEndDate,
      finalValue: '',
      onChange: newEndDate => {
        if (onRangeChange) {
          onRangeChange(internalStartDate, newEndDate)
        }
      }
    })

    const parseDate = useCallback((dateString: string): Date | null => {
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
    }, [])

    const formatDate = (date: Date): string => {
      return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
    }

    const getCurrentYearMonth = useCallback((): { year: number; month: number } => {
      const today = new Date()

      if (mode === 'single' && internalValue) {
        const selectedDate = parseDate(internalValue)
        if (selectedDate) {
          return {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1
          }
        }
      } else if (mode === 'range' && internalStartDate) {
        const selectedDate = parseDate(internalStartDate)
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
    }, [mode, internalValue, internalStartDate, parseDate])

    const [currentYearMonth, setCurrentYearMonth] = useState(getCurrentYearMonth)

    useEffect(() => {
      const newYearMonth = getCurrentYearMonth()
      setCurrentYearMonth(newYearMonth)
    }, [internalValue, internalStartDate, mode, getCurrentYearMonth])

    const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false)

    const [clickCount, setClickCount] = useState(0)
    const [startTd, setStartTd] = useState<CalendarDate | null>(null)

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

      const remainingCells = 42 - dates.length
      const nextMonth = month === 12 ? 1 : month + 1
      const nextYear = month === 12 ? year + 1 : year

      for (let day = 1; day <= remainingCells; day++) {
        const dateString = `${nextYear}.${nextMonth.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`

        dates.push({
          year: nextYear,
          month: nextMonth,
          day,
          isNew: true,
          isDayOff: dates.length % 7 === 0,
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

    const handleCloseCalendar = useCallback(() => {
      setInternalIsOpen(false)
      setYearDropdownOpen(false)
      setMonthDropdownOpen(false)
    }, [setInternalIsOpen])

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

      if (mode === 'single') {
        setInternalValue(dateString)
      } else {
        const currentDate = new Date(date.year, date.month - 1, date.day)

        if (startTd) {
          const startDate = new Date(startTd.year, startTd.month - 1, startTd.day)
          if (currentDate < startDate) {
            setInternalStartDate(dateString)
            setInternalEndDate('')
            setStartTd(date)
            return
          }
        }

        setClickCount(clickCount + 1)

        if (clickCount % 2 === 0) {
          setInternalStartDate(dateString)
          setInternalEndDate('')
          setStartTd(date)
        } else {
          setInternalEndDate(dateString)
          setStartTd(null)
        }
      }
    }

    const handleTodayClick = () => {
      const today = new Date()
      const todayString = formatDate(today)

      if (mode === 'single') {
        setInternalValue(todayString)
      } else {
        setInternalStartDate(todayString)
        setInternalEndDate(todayString)
      }

      setCurrentYearMonth({
        year: today.getFullYear(),
        month: today.getMonth() + 1
      })
      setClickCount(0)
      setStartTd(null)

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
      setInternalValue(newValue)

      const parsedDate = parseDate(newValue)
      if (parsedDate) {
        setCurrentYearMonth({
          year: parsedDate.getFullYear(),
          month: parsedDate.getMonth() + 1
        })
      }
    }

    const handleStartDateChange = (newValue: string) => {
      setInternalStartDate(newValue)

      const parsedDate = parseDate(newValue)
      if (parsedDate) {
        setCurrentYearMonth({
          year: parsedDate.getFullYear(),
          month: parsedDate.getMonth() + 1
        })
      }
    }

    const handleEndDateChange = (newValue: string) => {
      setInternalEndDate(newValue)

      const parsedDate = parseDate(newValue)
      if (parsedDate) {
        setCurrentYearMonth({
          year: parsedDate.getFullYear(),
          month: parsedDate.getMonth() + 1
        })
      }
    }

    const isDateInPeriod = (date: CalendarDate): { isPeriod: boolean; isStart: boolean; isEnd: boolean } => {
      if (mode === 'single') {
        const isSelected =
          internalValue === `${date.year}.${date.month.toString().padStart(2, '0')}.${date.day.toString().padStart(2, '0')}`
        return { isPeriod: isSelected, isStart: isSelected, isEnd: isSelected }
      } else {
        const dateString = `${date.year}.${date.month.toString().padStart(2, '0')}.${date.day.toString().padStart(2, '0')}`
        const isStart = internalStartDate === dateString
        const isEnd = internalEndDate === dateString

        if (!internalEndDate) {
          return { isPeriod: isStart, isStart, isEnd: isEnd }
        }

        const currentDate = new Date(date.year, date.month - 1, date.day)
        const startParts = internalStartDate.split('.').map(Number)
        const endParts = internalEndDate.split('.').map(Number)
        const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2])
        const endDate = new Date(endParts[0], endParts[1] - 1, endParts[2])

        const isPeriod = currentDate >= startDate && currentDate <= endDate

        return { isPeriod: isPeriod, isStart, isEnd }
      }
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

    return (
      <div className="form-group" ref={ref} {...rest}>
        <div className="form-tit">
          <label htmlFor={inputId}>{label}</label>
        </div>
        <div className="form-conts calendar-conts">
          <div className="calendar-input">
            {mode === 'single' ? (
              <input
                type="text"
                className="krds-input datepicker cal"
                placeholder={placeholder}
                id={inputId}
                value={internalValue}
                onChange={e => handleInputChange(e.target.value)}
                disabled={disabled}
                readOnly={readOnly}
              />
            ) : (
              <ul className="input-group range set">
                <li>
                  <input
                    type="text"
                    className="krds-input datepicker"
                    placeholder={startPlaceholder}
                    title={startTitle}
                    value={internalStartDate}
                    onChange={e => handleStartDateChange(e.target.value)}
                    disabled={disabled}
                    readOnly={readOnly}
                  />
                </li>
                <li className="mark">-</li>
                <li>
                  <input
                    type="text"
                    className="krds-input datepicker"
                    placeholder={endPlaceholder}
                    title={endTitle}
                    value={internalEndDate}
                    onChange={e => handleEndDateChange(e.target.value)}
                    disabled={disabled}
                    readOnly={readOnly}
                  />
                </li>
              </ul>
            )}
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
            <div
              className={classNames('calendar-wrap', position, { single: mode === 'single' })}
              aria-label="달력"
              tabIndex={0}
              ref={calendarWrapRef}
            >
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

                            const { isPeriod, isStart, isEnd } = isDateInPeriod(date)

                            const cellClasses = classNames({
                              old: date.isOld,
                              new: date.isNew,
                              today: date.isToday,
                              disabled: date.isDisabled,
                              'day-off': date.isDayOff,
                              'day-event': date.hasEvent,
                              period: isPeriod,
                              start: isStart,
                              end: isEnd
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
                                  aria-pressed={isPeriod}
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
    )
  }
)

Calendar.displayName = 'Calendar'
