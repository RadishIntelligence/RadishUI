import { useRef, type ReactElement, type ReactNode, type RefObject } from 'react';
import { Dialog as DialogPrimitive, DropdownMenu, Tooltip as TooltipPrimitive } from 'radix-ui';
import { X } from 'lucide-react';
import { IconButton } from './Button';

export interface DialogProps {
  /** 受控打开状态。 */
  open: boolean;
  /** Escape、遮罩与关闭按钮的关闭请求。 */
  onOpenChange(open: boolean): void;
  /** 标题，作为对话框 / 抽屉的可访问名称。 */
  title: ReactNode;
  /** 补充说明，关联到 aria-describedby。 */
  description?: ReactNode;
  /** 正文内容。 */
  children: ReactNode;
  /** 底部操作区；按钮顺序由调用方决定。 */
  footer?: ReactNode;
  /** 头部关闭按钮的可访问名称。 */
  closeLabel?: string;
  /** 禁用头部关闭按钮但保留在 DOM。 */
  closeDisabled?: boolean;
  /** 打开时的初始焦点；关闭后回到打开它的入口。 */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** 语义角色；确认类使用 alertdialog。 */
  role?: 'dialog' | 'alertdialog';
  /** 附加类名。 */
  className?: string;
}

function DialogSurface({ open, onOpenChange, title, description, children, footer, initialFocusRef, closeDisabled = false, role = 'dialog', closeLabel = '关闭', className = '', drawer = false, side = 'right' }: DialogProps & { drawer?: boolean; side?: 'right' | 'bottom' }) {
  const previousFocus = useRef<HTMLElement | null>(null);
  // A menu item is removed when its menu closes. Remember the menu trigger too, so a
  // dialog opened from that item can return focus somewhere stable on close.
  const menuTriggerFocus = useRef<HTMLElement | null>(null);
  return <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="rd-dialog-overlay" />
      <DialogPrimitive.Content role={role} className={`rd-dialog ${drawer ? 'rd-drawer' : ''} ${drawer && side === 'bottom' ? 'rd-drawer--bottom' : ''} ${className}`.trim()}
        onOpenAutoFocus={event => {
          previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          menuTriggerFocus.current = document.querySelector<HTMLElement>('[aria-haspopup="menu"][aria-expanded="true"]');
          if (initialFocusRef?.current) { event.preventDefault(); initialFocusRef.current.focus(); }
        }}
        onCloseAutoFocus={event => {
          const target = menuTriggerFocus.current?.isConnected ? menuTriggerFocus.current : previousFocus.current;
          if (target?.isConnected) { event.preventDefault(); target.focus(); }
        }}>
        <header className="rd-dialog-header">
          <div><DialogPrimitive.Title className="rd-dialog-title">{title}</DialogPrimitive.Title>
            {description && <DialogPrimitive.Description className="rd-dialog-description">{description}</DialogPrimitive.Description>}
          </div>
          <DialogPrimitive.Close asChild><IconButton className="rd-dialog-close" label={closeLabel} disabled={closeDisabled}><X /></IconButton></DialogPrimitive.Close>
        </header>
        <div className="rd-dialog-body">{children}</div>
        {footer && <footer className="rd-dialog-footer">{footer}</footer>}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>;
}

export function Dialog(props: DialogProps) { return <DialogSurface {...props} />; }

export interface DrawerProps extends DialogProps {
  /** 出现方位；right 从侧边滑入（默认），bottom 为底部抽屉。 */
  side?: 'right' | 'bottom';
}
export function Drawer({ side = 'right', ...props }: DrawerProps) { return <DialogSurface {...props} drawer side={side} />; }

export interface MenuItem {
  /** 稳定标识。 */
  id: string;
  /** 菜单项文案。 */
  label: ReactNode;
  /** 前置图标。 */
  icon?: ReactNode;
  /** 选择回调；链接项由 href 导航。 */
  onSelect?: () => void;
  /** 提供时渲染为链接项。 */
  href?: string;
  /** 禁用；跳过键盘移动。 */
  disabled?: boolean;
  /** 危险操作样式。 */
  danger?: boolean;
  /** 在本项前插入分隔线。 */
  separatorBefore?: boolean;
}
export interface MenuProps {
  /** 菜单触发器；需要可聚焦且可访问名称。 */
  trigger: ReactElement;
  /** 菜单项定义；支持分隔、禁用、危险与链接。 */
  items: readonly MenuItem[];
  /** 菜单分组标题。 */
  label?: string;
  /** 相对触发器的对齐方式。 */
  align?: 'start' | 'center' | 'end';
}
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

export interface TooltipProps {
  /** 提示文案；不能承载必要说明或错误。 */
  content: string;
  /** 单个触发器；需可聚焦。 */
  children: ReactElement;
}
export function Tooltip({ content, children }: TooltipProps) {
  return <TooltipPrimitive.Provider delayDuration={400}><TooltipPrimitive.Root>
    <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
    <TooltipPrimitive.Portal><TooltipPrimitive.Content className="rd-tooltip" sideOffset={7} collisionPadding={12}>
      {content}<TooltipPrimitive.Arrow className="rd-tooltip-arrow" />
    </TooltipPrimitive.Content></TooltipPrimitive.Portal>
  </TooltipPrimitive.Root></TooltipPrimitive.Provider>;
}
