import { useState, type CSSProperties, type ReactNode } from 'react';
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

const toastDuration = 4500;

export interface ToastProps { open: boolean; onOpenChange(open: boolean): void; message: string; label?: string; closeLabel?: string }
export function Toast({ open, onOpenChange, message, label = '通知', closeLabel = '关闭通知' }: ToastProps) {
  const [paused, setPaused] = useState(false);
  return <ToastPrimitive.Provider duration={toastDuration} label={label} swipeDirection="up">
    <ToastPrimitive.Root open={open} onOpenChange={onOpenChange} className="rd-toast" type="foreground"
      onPause={() => setPaused(true)} onResume={() => setPaused(false)}
      data-paused={paused ? '' : undefined}
      style={{ '--rd-toast-duration': `${toastDuration}ms` } as CSSProperties}>
      <CircleCheck size={16} aria-hidden="true" />
      <ToastPrimitive.Title>{message}</ToastPrimitive.Title>
      <span className="rd-toast-close-wrap">
        <svg className="rd-toast-ring" viewBox="0 0 30 30" aria-hidden="true">
          <rect className="rd-toast-ring-track" x="0.75" y="0.75" width="28.5" height="28.5" rx="8.25" pathLength="1" />
          <rect className="rd-toast-ring-progress" x="0.75" y="0.75" width="28.5" height="28.5" rx="8.25" pathLength="1" />
        </svg>
        <ToastPrimitive.Close asChild><IconButton className="rd-toast-close" label={closeLabel} size="sm"><X size={14} /></IconButton></ToastPrimitive.Close>
      </span>
    </ToastPrimitive.Root>
    <ToastPrimitive.Viewport className="rd-toast-viewport" />
  </ToastPrimitive.Provider>;
}
