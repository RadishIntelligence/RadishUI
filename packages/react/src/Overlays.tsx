import { useId, useRef, type ReactElement, type ReactNode, type RefObject } from 'react';
import { Dialog as DialogPrimitive, DropdownMenu, Tooltip as TooltipPrimitive } from 'radix-ui';
import { X } from 'lucide-react';
import { IconButton } from './Button';

export interface DialogProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  role?: 'dialog' | 'alertdialog';
  className?: string;
}

function DialogSurface({ open, onOpenChange, title, description, children, footer, initialFocusRef, role = 'dialog', closeLabel = '关闭', className = '', drawer = false }: DialogProps & { drawer?: boolean }) {
  const descriptionId = useId();
  const previousFocus = useRef<HTMLElement | null>(null);
  return <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="rd-dialog-overlay" />
      <DialogPrimitive.Content role={role} className={`rd-dialog ${drawer ? 'rd-drawer' : ''} ${className}`}
        aria-describedby={description ? descriptionId : undefined}
        onOpenAutoFocus={event => {
          previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          if (initialFocusRef?.current) { event.preventDefault(); initialFocusRef.current.focus(); }
        }}
        onCloseAutoFocus={event => {
          if (previousFocus.current?.isConnected) { event.preventDefault(); previousFocus.current.focus(); }
        }}>
        <header className="rd-dialog-header">
          <div><DialogPrimitive.Title className="rd-dialog-title">{title}</DialogPrimitive.Title>
            {description && <DialogPrimitive.Description id={descriptionId} className="rd-dialog-description">{description}</DialogPrimitive.Description>}
          </div>
          <DialogPrimitive.Close asChild><IconButton className="rd-dialog-close" label={closeLabel}><X /></IconButton></DialogPrimitive.Close>
        </header>
        <div className="rd-dialog-body">{children}</div>
        {footer && <footer className="rd-dialog-footer">{footer}</footer>}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>;
}

export function Dialog(props: DialogProps) { return <DialogSurface {...props} />; }
export function Drawer(props: DialogProps) { return <DialogSurface {...props} drawer />; }

export interface MenuItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  onSelect?: () => void;
  href?: string;
  disabled?: boolean;
  danger?: boolean;
  separatorBefore?: boolean;
}
export interface MenuProps { trigger: ReactElement; items: readonly MenuItem[]; label?: string; align?: 'start' | 'center' | 'end' }
export function Menu({ trigger, items, label, align = 'end' }: MenuProps) {
  return <DropdownMenu.Root><DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
    <DropdownMenu.Portal><DropdownMenu.Content className="rd-menu" align={align} sideOffset={6} collisionPadding={12}>
      {label && <DropdownMenu.Label className="rd-menu-label">{label}</DropdownMenu.Label>}
      {items.map(item => <div key={item.id}>
        {item.separatorBefore && <DropdownMenu.Separator className="rd-menu-separator" />}
        <DropdownMenu.Item className={`rd-menu-item ${item.danger ? 'rd-menu-item--danger' : ''}`} disabled={item.disabled}
          onSelect={item.onSelect} asChild={Boolean(item.href && !item.disabled)}>
          {item.href && !item.disabled ? <a href={item.href}>{item.icon}{item.label}</a> : <>{item.icon}{item.label}</>}
        </DropdownMenu.Item>
      </div>)}
    </DropdownMenu.Content></DropdownMenu.Portal>
  </DropdownMenu.Root>;
}

export function Tooltip({ content, children }: { content: string; children: ReactElement }) {
  return <TooltipPrimitive.Provider delayDuration={400}><TooltipPrimitive.Root>
    <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
    <TooltipPrimitive.Portal><TooltipPrimitive.Content className="rd-tooltip" sideOffset={7} collisionPadding={12}>
      {content}<TooltipPrimitive.Arrow className="rd-tooltip-arrow" />
    </TooltipPrimitive.Content></TooltipPrimitive.Portal>
  </TooltipPrimitive.Root></TooltipPrimitive.Provider>;
}
