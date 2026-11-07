import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  size?: 'sm' | 'md';
}

export function Button({ variant = 'primary', size = 'md', loading = false, disabled, className = '', type = 'button', children, onClick, ...props }: ButtonProps) {
  return (
    <button {...props} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
      onClick={event => {
        // Safari 点击按钮时不自动聚焦；先建立焦点，浮层关闭后才能回到真实入口。
        event.currentTarget.focus({ preventScroll: true });
        onClick?.(event);
      }}
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

export function IconButton({ label, variant = 'ghost', className = '', loading = false, children, ...props }: IconButtonProps) {
  return <Button {...props} loading={loading} variant={variant} aria-label={label} className={`rd-icon-button ${className}`}>{loading ? null : children}</Button>;
}
