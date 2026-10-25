import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { classNames } from '@/utils'
import React, { forwardRef } from 'react'
import { PaginationItem, PaginationProps } from './Pagination.types'

/**
 * KRDS Pagination Component
 * @param totalPages 전체 페이지 수
 * @param currentPage 현재 페이지 (제어)
 * @param defaultPage 초기 페이지 (비제어)
 * @param onChange 페이지 변경 핸들러
 * @param prevLabel 이전 버튼 레이블
 * @param nextLabel 다음 버튼 레이블
 * @param boundaryCount 경계 영역에 표시할 페이지 수 (0-3)
 * @param siblingCount 현재 주변 표시 페이지 수 (0-3)
 * @param disabled 비활성 상태
 * @param className 커스텀 클래스명
 */
const Pagination: React.FC<PaginationProps> = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      totalPages,
      currentPage,
      defaultPage = 1,
      onChange,
      prevLabel = '이전',
      nextLabel = '다음',
      boundaryCount = 1,
      siblingCount = 1,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [page, setPage] = useUncontrolled<number>({
      value: currentPage,
      defaultValue: defaultPage,
      finalValue: 1,
      onChange: onChange as (v: number) => void
    })

    const clamp = (val: number) => Math.max(1, Math.min(totalPages, val))

    const createItems = (): PaginationItem[] => {
      if (totalPages <= 0) return []

      const startPages = Array.from({ length: Math.min(boundaryCount, totalPages) }, (_, i) => i + 1)
      const endPages = Array.from({ length: Math.min(boundaryCount, totalPages) }, (_, i) => totalPages - i).reverse()

      const siblingsStart = Math.max(Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1), boundaryCount + 2)
      const siblingsEnd = Math.min(
        Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
        endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
      )

      const items: PaginationItem[] = []

      items.push(...startPages)

      if (siblingsStart > boundaryCount + 2) {
        items.push('dots')
      } else if (boundaryCount + 1 < totalPages - boundaryCount) {
        items.push(boundaryCount + 1)
      }

      for (let i = siblingsStart; i <= siblingsEnd; i += 1) {
        if (i >= 1 && i <= totalPages) items.push(i)
      }

      if (siblingsEnd < totalPages - boundaryCount - 1) {
        items.push('dots')
      } else if (totalPages - boundaryCount > boundaryCount) {
        items.push(totalPages - boundaryCount)
      }

      for (const p of endPages) {
        if (!items.includes(p)) items.push(p)
      }

      const normalized: PaginationItem[] = []
      const set = new Set<string>()
      for (const it of items) {
        const key = String(it)
        if (!set.has(key)) {
          set.add(key)
          normalized.push(it)
        }
      }
      normalized.sort((a, b) => {
        if (a === 'dots' || b === 'dots') return 0
        return (a as number) - (b as number)
      })

      const finalItems: PaginationItem[] = []
      for (let i = 0; i < normalized.length; i++) {
        const curr = normalized[i]
        finalItems.push(curr)
        if (typeof curr === 'number' && i < normalized.length - 1) {
          const next = normalized[i + 1]
          if (typeof next === 'number' && next - curr > 1) {
            finalItems.push('dots')
          }
        }
      }

      return finalItems
    }

    const items = createItems()

    const handlePrev = () => {
      if (disabled) return
      const next = clamp(page - 1)
      if (next !== page) setPage(next)
    }

    const handleNext = () => {
      if (disabled) return
      const next = clamp(page + 1)
      if (next !== page) setPage(next)
    }

    const handlePage = (p: number) => () => {
      if (disabled) return
      if (p !== page) setPage(p)
    }

    const isPrevDisabled = disabled || page <= 1
    const isNextDisabled = disabled || page >= totalPages

    return (
      <div className={classNames('krds-pagination', className)} ref={ref} {...props}>
        <span
          className={classNames('page-navi prev', isPrevDisabled && 'disabled')}
          aria-disabled={isPrevDisabled}
          role="button"
          tabIndex={isPrevDisabled ? -1 : 0}
          onClick={!isPrevDisabled ? handlePrev : undefined}
        >
          {prevLabel}
        </span>

        <div className="page-links">
          {items.map((it, idx) => {
            if (it === 'dots') {
              return <span key={`dots-${idx}`} className="page-link link-dot" aria-hidden />
            }
            const isActive = it === page
            return (
              <a
                key={it}
                className={classNames('page-link', isActive && 'active')}
                aria-current={isActive ? 'page' : undefined}
                onClick={handlePage(it)}
                href="#"
              >
                {isActive ? (
                  <>
                    <span className="sr-only">현재페이지 </span>
                    {it}
                  </>
                ) : (
                  it
                )}
              </a>
            )
          })}
        </div>

        <a
          className={classNames('page-navi next', isNextDisabled && 'disabled')}
          aria-disabled={isNextDisabled}
          role="button"
          tabIndex={isNextDisabled ? -1 : 0}
          onClick={!isNextDisabled ? handleNext : undefined}
          href="#"
        >
          {nextLabel}
        </a>
      </div>
    )
  }
)

Pagination.displayName = 'Pagination'

export default Pagination
