import type { ReactNode } from 'react';
import { Toast as ToastPrimitive } from 'radix-ui';
import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { IconButton } from './Button';

export interface InlineAlertProps { tone?: 'info' | 'success' | 'warning' | 'danger'; children: ReactNode; title?: string; className?: string }
export function InlineAlert({ tone = 'info', children, title, className = '' }: InlineAlertProps) {
  const Icon = tone === 'danger' || tone === 'warning' ? TriangleAlert : tone === 'success' ? CircleCheck : Info;
  return <div className={`rd-alert rd-alert--${tone} ${className}`} role={tone === 'danger' ? 'alert' : 'status'}>
    <Icon size={18} aria-hidden="true" /><div>{title && <strong>{title}</strong>}{children}</div>
  </div>;
}

export interface ToastProps { open: boolean; onOpenChange(open: boolean): void; message: string; label?: string; closeLabel?: string }
export function Toast({ open, onOpenChange, message, label = '通知', closeLabel = '关闭通知' }: ToastProps) {
  return <ToastPrimitive.Provider duration={4500} label={label} swipeDirection="right">
    <ToastPrimitive.Root open={open} onOpenChange={onOpenChange} className="rd-toast" type="foreground">
      <CircleCheck size={18} aria-hidden="true" />
      <ToastPrimitive.Title>{message}</ToastPrimitive.Title>
      <ToastPrimitive.Close asChild><IconButton label={closeLabel} size="sm"><X /></IconButton></ToastPrimitive.Close>
    </ToastPrimitive.Root>
    <ToastPrimitive.Viewport className="rd-toast-viewport" />
  </ToastPrimitive.Provider>;
}
