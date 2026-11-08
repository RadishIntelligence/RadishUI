import { useRef, type ReactNode } from 'react';
import { Button } from './Button';
import { Dialog } from './Overlays';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  tone?: 'default' | 'danger';
  loading?: boolean;
  closeLabel?: string;
  onConfirm(): void;
}

export function ConfirmDialog({ open, onOpenChange, title, description, children, confirmLabel, cancelLabel, tone = 'default', loading = false, closeLabel, onConfirm }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const change = (next: boolean) => {
    if (!next && loading) return;
    onOpenChange(next);
  };
  return <Dialog open={open} onOpenChange={change} title={title} description={description} closeLabel={closeLabel} initialFocusRef={cancelRef} role="alertdialog"
    footer={<>
      <Button ref={cancelRef} variant="secondary" disabled={loading} onClick={() => onOpenChange(false)}>{cancelLabel}</Button>
      <Button variant={tone === 'danger' ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
    </>}>
    <div className="rd-confirm">{children}</div>
  </Dialog>;
}
