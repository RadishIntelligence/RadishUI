import { useState, type ComponentProps, type ComponentPropsWithRef, type ComponentPropsWithoutRef, type FocusEvent, type ReactNode } from 'react';
import { Accordion as AccordionPrimitive, Switch as SwitchPrimitive, Tabs as TabsPrimitive, ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { Check, ChevronDown } from 'lucide-react';

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  /** 可见标签文字；无文字时必须提供可访问名称。 */
  children?: ReactNode;
}
export function Checkbox({ children, className = '', ...props }: CheckboxProps) {
  return <label className={`rd-checkbox ${className}`}>
    <input {...props} type="checkbox" />
    <span className="rd-checkbox-box" aria-hidden="true"><Check size={12} /></span>
    {children && <span>{children}</span>}
  </label>;
}

export interface SwitchProps extends ComponentProps<typeof SwitchPrimitive.Root> {}
export function Switch({ className = '', ...props }: SwitchProps) {
  return <SwitchPrimitive.Root {...props} className={`rd-switch ${className}`}>
    <SwitchPrimitive.Thumb className="rd-switch-thumb" />
  </SwitchPrimitive.Root>;
}

export interface TabsProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {}
export function Tabs({ className = '', ...props }: TabsProps) {
  return <TabsPrimitive.Root {...props} className={`rd-tabs ${className}`} />;
}

export interface TabOption { value: string; label: ReactNode; disabled?: boolean }
export interface TabsListProps {
  /** 标签组的可访问名称。 */
  label: string;
  /** 标签定义；禁用项跳过键盘移动。 */
  items: readonly TabOption[];
  /** 标签轨道尺寸；默认随站点尺度。 */
  size?: 'sm' | 'md' | 'lg';
  /** 附加类名。 */
  className?: string;
}
export function TabsList({ label, items, size, className = '' }: TabsListProps) {
  // Radix focuses the trigger on pointerdown, which Chrome reports as :focus-visible.
  // Track pointer-driven focus so mouse clicks don't leave a ring that the toolbar
  // ToggleGroup does not show; keyboard focus still gets the regular ring.
  const [pointerFocus, setPointerFocus] = useState(false);
  return <TabsPrimitive.List aria-label={label} className={`rd-tabs-list ${className}`} data-size={size}
    data-pointer-focus={pointerFocus || undefined}
    onPointerDownCapture={() => setPointerFocus(true)}
    onKeyDownCapture={() => setPointerFocus(false)}
    onFocus={event => {
      const list = event.currentTarget;
      if (event.target !== list) return;
      // Radix usually forwards entry focus. After a click on a focused trigger,
      // its pointer flag can still be set when the user tabs back to the list.
      queueMicrotask(() => {
        if (list.ownerDocument.activeElement !== list || !list.matches(':focus-visible')) return;
        const trigger = list.querySelector<HTMLButtonElement>('.rd-tab[aria-selected="true"]:enabled')
          ?? list.querySelector<HTMLButtonElement>('.rd-tab[tabindex="0"]:enabled')
          ?? list.querySelector<HTMLButtonElement>('.rd-tab:enabled');
        trigger?.focus();
      });
    }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPointerFocus(false); }}>
    {items.map(item => <TabsPrimitive.Trigger key={item.value} className="rd-tab" value={item.value} disabled={item.disabled}>{item.label}</TabsPrimitive.Trigger>)}
  </TabsPrimitive.List>;
}

export interface TabsContentProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {}
export function TabsContent({ className = '', ...props }: TabsContentProps) {
  return <TabsPrimitive.Content {...props} className={`rd-tabs-content ${className}`} />;
}

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export interface StatusBadgeProps {
  /** 状态语义；由文字与图标共同表达时不要只靠颜色。 */
  tone?: StatusTone;
  /** 状态文字；图标由调用方提供。 */
  children: ReactNode;
  /** 附加类名。 */
  className?: string;
}
export function StatusBadge({ tone = 'neutral', children, className = '' }: StatusBadgeProps) {
  return <span className={`rd-badge rd-badge--${tone} ${className}`}>{children}</span>;
}

export interface ToggleGroupItem { value: string; label: ReactNode; disabled?: boolean }
interface ToggleGroupBase { label: string; items: readonly ToggleGroupItem[]; disabled?: boolean; size?: 'sm' | 'md' | 'lg'; className?: string }
export interface ToggleGroupSingleProps extends ToggleGroupBase { type?: 'single'; value: string; onValueChange(value: string): void }
export interface ToggleGroupMultipleProps extends ToggleGroupBase { type: 'multiple'; value: string[]; onValueChange(value: string[]): void }
export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

export function ToggleGroup(props: ToggleGroupProps) {
  const { label, items, disabled = false, className = '', size } = props;
  // Keep pointer-driven focus from leaving a ring that keyboard focus would also get.
  const [pointerFocus, setPointerFocus] = useState(false);
  const focusProps = {
    'data-pointer-focus': pointerFocus || undefined,
    onPointerDownCapture: () => setPointerFocus(true),
    onKeyDownCapture: () => setPointerFocus(false),
    onBlur: (event: FocusEvent<HTMLDivElement>) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPointerFocus(false); },
  };
  const isMultiple = props.type === 'multiple';
  const content = items.map(item => {
    // A single ToggleGroup exposes radio roles. Radix moves focus with the arrow keys but
    // does not check the focused item, so align it with the radio-group contract here.
    const selectOnFocus = !isMultiple && !disabled && !item.disabled && (props as ToggleGroupSingleProps).value !== item.value
      ? () => (props as ToggleGroupSingleProps).onValueChange(item.value)
      : undefined;
    return <ToggleGroupPrimitive.Item key={item.value} value={item.value} disabled={item.disabled || disabled}
      className="rd-toggle-group__item" onFocus={selectOnFocus}>
      {item.label}
    </ToggleGroupPrimitive.Item>;
  });
  const cls = `rd-toggle-group ${className}`.trim();
  if (isMultiple) return <ToggleGroupPrimitive.Root type="multiple" value={props.value} onValueChange={props.onValueChange} disabled={disabled} aria-label={label} className={cls} data-size={size} {...focusProps}>{content}</ToggleGroupPrimitive.Root>;
  return <ToggleGroupPrimitive.Root type="single" value={props.value} onValueChange={value => { if (value) props.onValueChange(value); }} disabled={disabled} aria-label={label} className={cls} data-size={size} {...focusProps}>{content}</ToggleGroupPrimitive.Root>;
}

export interface AccordionItem { value: string; label: ReactNode; content: ReactNode; disabled?: boolean }
interface AccordionBase { items: readonly AccordionItem[]; label?: string; className?: string }
export interface AccordionSingleProps extends AccordionBase { type?: 'single'; value?: string; defaultValue?: string; onValueChange?(value: string): void; collapsible?: boolean }
export interface AccordionMultipleProps extends AccordionBase { type: 'multiple'; value?: string[]; defaultValue?: string[]; onValueChange?(value: string[]): void }
export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

function accordionItems(items: readonly AccordionItem[]) {
  return items.map(item => <AccordionPrimitive.Item key={item.value} value={item.value} disabled={item.disabled} className="rd-accordion__item">
    <AccordionPrimitive.Header className="rd-accordion__header">
      <AccordionPrimitive.Trigger className="rd-accordion__trigger">{item.label}<ChevronDown size={16} aria-hidden="true" /></AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
    <AccordionPrimitive.Content className="rd-accordion__content"><div className="rd-accordion__content-inner">{item.content}</div></AccordionPrimitive.Content>
  </AccordionPrimitive.Item>);
}

export function Accordion(props: AccordionProps) {
  const { items, label, className = '' } = props;
  const cls = `rd-accordion ${className}`.trim();
  if (props.type === 'multiple') return <AccordionPrimitive.Root type="multiple" value={props.value} defaultValue={props.defaultValue} onValueChange={props.onValueChange} aria-label={label} className={cls}>{accordionItems(items)}</AccordionPrimitive.Root>;
  return <AccordionPrimitive.Root type="single" value={props.value} defaultValue={props.defaultValue} onValueChange={props.onValueChange} collapsible={props.collapsible} aria-label={label} className={cls}>{accordionItems(items)}</AccordionPrimitive.Root>;
}
