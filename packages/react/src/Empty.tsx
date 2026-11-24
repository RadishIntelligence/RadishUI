import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface EmptyProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** 主文案；通常是空结果或首次使用的说明。 */
  title: ReactNode;
  /** 补充说明；不替代 title。 */
  description?: ReactNode;
  /** 装饰图标；组件统一对辅助技术隐藏。 */
  icon?: ReactNode;
  /** 操作入口，通常是 Button 或链接。 */
  action?: ReactNode;
  /** start 用于工具栏下方的行内空态；center 用于占满列表区域。 */
  align?: 'start' | 'center';
  /** 占满父容器高度；用于表格 / 列表滚动区。 */
  fill?: boolean;
}

export function Empty({ title, description, icon, action, align = 'center', fill = false, className = '', ...props }: EmptyProps) {
  return <div {...props} className={`rd-empty ${className}`.trim()} data-align={align} data-fill={fill || undefined}>
    {icon && <span className="rd-empty__icon" aria-hidden="true">{icon}</span>}
    <h2 className="rd-empty__title">{title}</h2>
    {description && <p className="rd-empty__description">{description}</p>}
    {action && <div className="rd-empty__action">{action}</div>}
  </div>;
}
