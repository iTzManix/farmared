'use client';

import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, forwardRef } from 'react';

/* ── Wrapper ─────────────────────────────────────────────────── */
export interface TableWrapperProps extends HTMLAttributes<HTMLDivElement> {}

const TableWrapper = forwardRef<HTMLDivElement, TableWrapperProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl overflow-hidden ${className}`}
        style={{
          background: 'var(--surface-0)',
          boxShadow: 'var(--shadow-sm)',
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TableWrapper.displayName = 'TableWrapper';

/* ── Table ───────────────────────────────────────────────────── */
export interface TableProps extends HTMLAttributes<HTMLTableElement> {}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={`w-full text-sm ${className}`}
          style={{ borderCollapse: 'collapse' }}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);
Table.displayName = 'Table';

/* ── TableHeader ─────────────────────────────────────────────── */
export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </thead>
    );
  }
);
TableHeader.displayName = 'TableHeader';

/* ── TableBody ───────────────────────────────────────────────── */
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <tbody ref={ref} className={className} {...props}>
        {children}
      </tbody>
    );
  }
);
TableBody.displayName = 'TableBody';

/* ── TableRow ────────────────────────────────────────────────── */
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={`transition-colors ${className}`}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
        {...props}
      >
        {children}
      </tr>
    );
  }
);
TableRow.displayName = 'TableRow';

/* ── TableHead ───────────────────────────────────────────────── */
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={`px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest ${className}`}
        style={{
          color: 'var(--foreground-subtle)',
          background: 'rgba(255,255,255,0.015)',
        }}
        {...props}
      >
        {children}
      </th>
    );
  }
);
TableHead.displayName = 'TableHead';

/* ── TableCell ───────────────────────────────────────────────── */
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={`px-6 py-4 whitespace-nowrap ${className}`}
        style={{ color: 'var(--foreground)' }}
        {...props}
      >
        {children}
      </td>
    );
  }
);
TableCell.displayName = 'TableCell';

export { TableWrapper, Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
