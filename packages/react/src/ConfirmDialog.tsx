import { useRef, type ReactNode } from 'react';
import { Button } from './Button';
import { Dialog } from './Overlays';

export interface ConfirmDialogProps {
  /** 受控打开状态。 */
  open: boolean;
  /** 取消、Escape 与遮罩的关闭请求；loading 时被拦截。 */
  onOpenChange(open: boolean): void;
  /** 确认标题。 */
  title: ReactNode;
  /** 补充说明，关联到 aria-describedby。 */
  description?: ReactNode;
  /** 需要用户确认的正文。 */
  children?: ReactNode;
  /** 确认按钮文案。 */
  confirmLabel: string;
  /** 取消按钮文案。 */
  cancelLabel: string;
  /** 确认动作的危险级别；danger 使用危险按钮。 */
  tone?: 'default' | 'danger';
  /** 确认中：拦截关闭、禁用取消与头部关闭按钮。 */
  loading?: boolean;
  /** 头部关闭按钮的可访问名称。 */
  closeLabel?: string;
  /** 确认回调；加载状态由调用方维护。 */
  onConfirm(): void;
}

export function ConfirmDialog({ open, onOpenChange, title, description, children, confirmLabel, cancelLabel, tone = 'default', loading = false, closeLabel, onConfirm }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const change = (next: boolean) => {
    if (!next && loading) return;
    onOpenChange(next);
  };
  return <Dialog open={open} onOpenChange={change} title={title} description={description} closeLabel={closeLabel} closeDisabled={loading} initialFocusRef={cancelRef} role="alertdialog"
    footer={<>
      <Button ref={cancelRef} variant="secondary" disabled={loading} onClick={() => onOpenChange(false)}>{cancelLabel}</Button>
      <Button variant={tone === 'danger' ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
    </>}>
    <div className="rd-confirm">{children}</div>
  </Dialog>;
}
