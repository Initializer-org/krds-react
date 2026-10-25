import { classNames } from '@/utils'
import { forwardRef } from 'react'
import {
  TableCaptionProps,
  TableColgroupProps,
  TableColProps,
  TableProps,
  TableTbodyProps,
  TableTdProps,
  TableTFootProps,
  TableTheadProps,
  TableThProps,
  TableTrProps
} from './Table.types'

/**
 * KRDS Table Component
 * @param scroll enables horizontal scroll
 * @param mobScroll enables mobile scroll
 */
const TableRoot = forwardRef<HTMLTableElement, TableProps>(({ scroll, mobScroll, className, children, ...props }, ref) => {
  const wrapperClasses = classNames('krds-table-wrap', scroll && 'scroll', mobScroll && 'mob-scroll', className)

  return (
    <div className={wrapperClasses}>
      <table ref={ref} className="tbl col data" {...props}>
        {children}
      </table>
    </div>
  )
})

TableRoot.displayName = 'Table'

/**
 * KRDS Table Caption Component
 */
const TableCaption = forwardRef<HTMLElement, TableCaptionProps>(({ children, ...props }, ref) => {
  return (
    <caption ref={ref} {...props}>
      {children}
    </caption>
  )
})

TableCaption.displayName = 'Table.Caption'

/**
 * KRDS Table Colgroup Component
 */
const TableColgroup = forwardRef<HTMLTableColElement, TableColgroupProps>(({ children, ...props }, ref) => {
  return (
    <colgroup ref={ref} {...props}>
      {children}
    </colgroup>
  )
})

TableColgroup.displayName = 'Table.Colgroup'

/**
 * KRDS Table Col Component
 */
const TableCol = forwardRef<HTMLTableColElement, TableColProps>(({ width, ...props }, ref) => {
  return <col ref={ref} style={{ width }} {...props} />
})

TableCol.displayName = 'Table.Col'

/**
 * KRDS Table Thead Component
 */
const TableThead = forwardRef<HTMLTableSectionElement, TableTheadProps>(({ children, className, ...props }, ref) => {
  return (
    <thead ref={ref} className={className} {...props}>
      {children}
    </thead>
  )
})

TableThead.displayName = 'Table.Thead'

/**
 * KRDS Table Tbody Component
 */
const TableTbody = forwardRef<HTMLTableSectionElement, TableTbodyProps>(({ children, className, ...props }, ref) => {
  return (
    <tbody ref={ref} className={className} {...props}>
      {children}
    </tbody>
  )
})

TableTbody.displayName = 'Table.Tbody'

/**
 * KRDS Table TFoot Component
 */
const TableTFoot = forwardRef<HTMLTableSectionElement, TableTFootProps>(({ children, ...props }, ref) => {
  return (
    <tfoot ref={ref} {...props}>
      {children}
    </tfoot>
  )
})

TableTFoot.displayName = 'Table.TFoot'

/**
 * KRDS Table Tr Component
 */
const TableTr = forwardRef<HTMLTableRowElement, TableTrProps>(({ children, ...props }, ref) => {
  return (
    <tr ref={ref} {...props}>
      {children}
    </tr>
  )
})

TableTr.displayName = 'Table.Tr'

/**
 * KRDS Table Th Component
 */
const TableTh = forwardRef<HTMLTableCellElement, TableThProps>(({ className, children, ...props }, ref) => {
  return (
    <th ref={ref} className={className} {...props}>
      {children}
    </th>
  )
})

TableTh.displayName = 'Table.Th'

/**
 * KRDS Table Td Component
 */
const TableTd = forwardRef<HTMLTableCellElement, TableTdProps>(({ className, children, ...props }, ref) => {
  return (
    <td ref={ref} className={className} {...props}>
      {children}
    </td>
  )
})

TableTd.displayName = 'Table.Td'

export const Table = Object.assign(TableRoot, {
  Caption: TableCaption,
  Colgroup: TableColgroup,
  Col: TableCol,
  Thead: TableThead,
  Tbody: TableTbody,
  TFoot: TableTFoot,
  Tr: TableTr,
  Th: TableTh,
  Td: TableTd
})
