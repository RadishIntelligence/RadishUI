import { useId, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import { Slot } from 'radix-ui';

export type CardTone = 'surface' | 'muted' | 'app';
export type CardPadding = 'none' | 'sm' | 'md';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Surface role: default content surface, muted inset, or app canvas (for previews). */
  tone?: CardTone;
  /** `sm` = 12px, `md` = 16px page spacing; `none` when the card manages its own sections. */
  padding?: CardPadding;
  /** Attach the surface to the single child element, e.g. a link card. */
  asChild?: boolean;
}

export function Card({ tone = 'surface', padding = 'md', asChild = false, className = '', ...props }: CardProps) {
  const Component: ElementType = asChild ? Slot.Slot : 'div';
  return <Component {...props} className={`rd-card rd-card--${tone} rd-card--pad-${padding} ${className}`.trim()} />;
}

export interface SectionProps extends Omit<ComponentPropsWithoutRef<'section'>, 'title'> {
  title: ReactNode;
  eyebrow?: ReactNode;
  /** Reserved for documentation sections; product pages keep control help to DR-18. */
  description?: ReactNode;
  /** `md` = reading sections (18px heading, 24px block padding); `sm` = dense reference sections (16px, 20px). */
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
