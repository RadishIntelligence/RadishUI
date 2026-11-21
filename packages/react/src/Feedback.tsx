import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Toast as ToastPrimitive } from 'radix-ui';
import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { IconButton } from './Button';

export interface InlineAlertProps {
  /** 状态层级；决定图标、颜色与播报角色。 */
  tone?: 'info' | 'success' | 'warning' | 'danger';
  /** 提示正文；可包含必要的操作入口，但不替代字段错误。 */
  children: ReactNode;
  /** 可选的加粗标题。 */
  title?: string;
  /** 附加类名。 */
  className?: string;
}
export function InlineAlert({ tone = 'info', children, title, className = '' }: InlineAlertProps) {
  const Icon = tone === 'danger' || tone === 'warning' ? TriangleAlert : tone === 'success' ? CircleCheck : Info;
  return <div className={`rd-alert rd-alert--${tone} ${className}`} role={tone === 'danger' ? 'alert' : 'status'}>
    <Icon size={18} aria-hidden="true" /><div>{title && <strong>{title}</strong>}{children}</div>
  </div>;
}

const toastDuration = 4500;
const activationWindow = 5000;
const interactiveSelector = 'button, a[href], input, select, textarea, [role="menuitem"], [role="tab"], [role="switch"], [role="checkbox"], [role="radio"]';

// A click does not always focus its button (for example macOS Chrome), and the app can
// remount the Toast by key to restart its timer. Track the last pointer target at module
// level so the opener survives that remount. Stale targets expire via activationWindow.
let lastActivation: HTMLElement | null = null;
let lastActivationAt = 0;
let activationTracked = false;
function trackActivation() {
  if (activationTracked || typeof document === 'undefined') return;
  activationTracked = true;
  document.addEventListener('pointerdown', event => {
    const target = event.target;
    lastActivation = target instanceof Element ? target.closest<HTMLElement>(interactiveSelector) : null;
    lastActivationAt = performance.now();
  }, true);
}
function focusable(element: HTMLElement | null | undefined): element is HTMLElement {
  return Boolean(element?.isConnected && element.getClientRects().length > 0
    && !element.matches(':disabled') && element.getAttribute('aria-disabled') !== 'true');
}

export interface ToastProps {
  /** 受控显示状态；挂载后自动计时关闭。 */
  open: boolean;
  /** 关闭请求回调；超时、Esc 与关闭按钮都会触发。 */
  onOpenChange(open: boolean): void;
  /** 单行提示文案。 */
  message: string;
  /** 区域名，同时用于 F8 快捷键提示。 */
  label?: string;
  /** 关闭按钮的可访问名称。 */
  closeLabel?: string;
}
export function Toast({ open, onOpenChange, message, label = '通知', closeLabel = '关闭通知' }: ToastProps) {
  const [paused, setPaused] = useState(false);
  const viewport = useRef<HTMLOListElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const preToastFocus = useRef<HTMLElement | null>(null);
  const focusEntered = useRef(false);
  const wasOpen = useRef(false);

  useEffect(() => { trackActivation(); }, []);

  // A toast is non-modal: restore focus only when it was entered via F8 / Tab before
  // closing. Auto-dismissal while the user is elsewhere must not steal focus. Prefer the
  // opener, then the position focus came from, and never leave focus on an empty viewport.
  useEffect(() => {
    if (open && !wasOpen.current) {
      const active = document.activeElement;
      const recentActivation = performance.now() - lastActivationAt <= activationWindow ? lastActivation : null;
      const candidate = active instanceof HTMLElement && active !== document.body && active !== document.documentElement ? active : recentActivation;
      opener.current = candidate && !viewport.current?.contains(candidate) ? candidate : null;
      preToastFocus.current = null;
      focusEntered.current = false;
      lastActivation = null;
    } else if (!open && wasOpen.current) {
      const active = document.activeElement;
      const focusInsideToast = !active || active === document.body || Boolean(viewport.current?.contains(active));
      if (focusEntered.current && focusInsideToast) {
        const target = [opener.current, preToastFocus.current].find(focusable);
        if (target) target.focus({ preventScroll: true });
        else if (document.activeElement instanceof HTMLElement && document.activeElement !== document.body) document.activeElement.blur();
      }
      opener.current = null;
      preToastFocus.current = null;
      focusEntered.current = false;
      lastActivation = null;
    }
    wasOpen.current = open;
  }, [open]);

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
    <ToastPrimitive.Viewport ref={viewport} className="rd-toast-viewport" label={`${label} ({hotkey})`}
      onFocus={event => {
        focusEntered.current = true;
        const from = event.relatedTarget;
        const region = viewport.current?.parentElement;
        if (!preToastFocus.current && from instanceof HTMLElement && from !== document.body && !region?.contains(from)) preToastFocus.current = from;
      }} />
  </ToastPrimitive.Provider>;
}
