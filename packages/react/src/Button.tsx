import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** 操作层级；一个区域只保留一个主要操作。 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** 保留焦点，设置 aria-disabled / aria-busy，并拦截重复激活。 */
  loading?: boolean;
  /** sm 用于工具栏与紧凑行，md 用于页面和表单操作。 */
  size?: 'sm' | 'md';
}

export function Button({ variant = 'primary', size = 'md', loading = false, disabled, className = '', type = 'button', children, onClick, ...props }: ButtonProps) {
  return (
    <button {...props} type={type} disabled={disabled} aria-disabled={loading || undefined} aria-busy={loading || undefined}
      onClick={event => {
        // Loading stays focusable so an async action cannot drop keyboard focus. Keep the
        // click guarded, including implicit form submission from a focused submit button.
        if (loading) { event.preventDefault(); event.stopPropagation(); return; }
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
  /** 可访问名称；没有可见文字时必须提供。 */
  label: string;
  /** 图标内容；通常为 lucide 图标并设置尺寸。 */
  children: ReactNode;
}

export function IconButton({ label, variant = 'ghost', className = '', loading = false, children, ...props }: IconButtonProps) {
  return <Button {...props} loading={loading} variant={variant} aria-label={label} className={`rd-icon-button ${className}`}>{loading ? null : children}</Button>;
}
