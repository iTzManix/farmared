'use client';

import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/* ── Wrapper ─────────────────────────────────────────────────── */
export interface TableWrapperProps extends HTMLAttributes<HTMLDivElement> {}

const TableWrapper = forwardRef<HTMLDivElement, TableWrapperProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm', className)}
      {...props}
    />
  )
);
TableWrapper.displayName = 'TableWrapper';

/* ── Table ───────────────────────────────────────────────────── */
export interface TableProps extends HTMLAttributes<HTMLTableElement> {}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full border-collapse text-sm', className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

/* ── TableHeader ─────────────────────────────────────────────── */
export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('[&_tr]:border-b [&_tr]:border-slate-100', className)}
      {...props}
    />
  )
);
TableHeader.displayName = 'TableHeader';

/* ── TableBody ───────────────────────────────────────────────── */
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
);
TableBody.displayName = 'TableBody';

/* ── TableRow ────────────────────────────────────────────────── */
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-slate-100 transition-colors hover:bg-slate-50/60',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

/* ── TableHead ───────────────────────────────────────────────── */
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'bg-slate-50/50 px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500',
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

/* ── TableCell ───────────────────────────────────────────────── */
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('px-6 py-4 whitespace-nowrap text-slate-700', className)}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

export { TableWrapper, Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
