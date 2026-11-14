import type { ComponentPropsWithoutRef, ElementType } from 'react';
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
