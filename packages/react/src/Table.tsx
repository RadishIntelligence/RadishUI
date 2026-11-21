import type { ComponentPropsWithoutRef } from 'react';

export interface TableProps extends ComponentPropsWithoutRef<'table'> {
  /** 表格的可访问名称，渲染为视觉隐藏的 caption。 */
  label: string;
  /** 表头吸顶；页面级滚动退化时关闭。 */
  stickyHeader?: boolean;
}

export function Table({ label, stickyHeader = true, className = '', children, ...props }: TableProps) {
  return <table {...props} className={`rd-table ${stickyHeader ? 'rd-table--sticky' : ''} ${className}`.trim()}>
    <caption className="rd-table__caption">{label}</caption>
    {children}
  </table>;
}
