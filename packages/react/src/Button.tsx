import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
}

export function Button({ variant = 'primary', loading = false, disabled, className = '', type = 'button', children, ...props }: ButtonProps) {
  return (
    <button {...props} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
      className={`rd-button rd-button--${variant} ${className}`.trim()}>
      {loading && <span className="rd-button__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}
