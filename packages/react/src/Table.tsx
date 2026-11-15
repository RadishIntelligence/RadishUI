import type { ComponentPropsWithoutRef } from 'react';

export interface TableProps extends ComponentPropsWithoutRef<'table'> {
  /** Accessible name, rendered as a visually hidden caption. */
  label: string;
  /** Turn off when the page falls back to page-level scrolling. */
  stickyHeader?: boolean;
}

export function Table({ label, stickyHeader = true, className = '', children, ...props }: TableProps) {
  return <table {...props} className={`rd-table ${stickyHeader ? 'rd-table--sticky' : ''} ${className}`.trim()}>
    <caption className="rd-table__caption">{label}</caption>
    {children}
  </table>;
}
