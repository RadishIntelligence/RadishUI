import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  size?: 'sm' | 'md';
}

export function Button({ variant = 'primary', size = 'md', loading = false, disabled, className = '', type = 'button', children, ...props }: ButtonProps) {
  return (
    <button {...props} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
      className={`rd-button rd-button--${variant} rd-button--${size} ${className}`.trim()}>
      {loading && <span className="rd-button__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  label: string;
  children: ReactNode;
}

export function IconButton({ label, variant = 'ghost', className = '', ...props }: IconButtonProps) {
  return <Button {...props} variant={variant} aria-label={label} className={`rd-icon-button ${className}`} />;
}
