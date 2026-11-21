import { useId, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import { Slot } from 'radix-ui';

export type CardTone = 'surface' | 'muted' | 'app';
export type CardPadding = 'none' | 'sm' | 'md';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** 表面角色：内容卡、弱化内嵌或预览画布。 */
  tone?: CardTone;
  /** 内边距：sm 12px、md 16px；none 由内部分区自管。 */
  padding?: CardPadding;
  /** 把表面挂到唯一子元素，例如链接卡片，保留原有语义。 */
  asChild?: boolean;
}

export function Card({ tone = 'surface', padding = 'md', asChild = false, className = '', ...props }: CardProps) {
  const Component: ElementType = asChild ? Slot.Slot : 'div';
  return <Component {...props} className={`rd-card rd-card--${tone} rd-card--pad-${padding} ${className}`.trim()} />;
}

export interface SectionProps extends Omit<ComponentPropsWithoutRef<'section'>, 'title'> {
  /** 区块标题；默认生成 id 并关联 aria-labelledby。 */
  title: ReactNode;
  /** 标题上方的短标签，用于流程或分组。 */
  eyebrow?: ReactNode;
  /** 文档区块的说明；产品页面按 DR-18 保持克制。 */
  description?: ReactNode;
  /** md 阅读区块；sm 密集参考区。 */
  size?: 'sm' | 'md';
}

export function Section({ title, eyebrow, description, size = 'md', className = '', children, 'aria-labelledby': labelledBy, ...props }: SectionProps) {
  const titleId = useId();
  return <section {...props} aria-labelledby={labelledBy ?? titleId} className={`rd-section rd-section--${size} ${className}`.trim()}>
    <header className="rd-section__header">
      {eyebrow && <span className="rd-section__eyebrow">{eyebrow}</span>}
      <h2 id={titleId}>{title}</h2>
      {description && <p className="rd-section__description">{description}</p>}
    </header>
    {children}
  </section>;
}
