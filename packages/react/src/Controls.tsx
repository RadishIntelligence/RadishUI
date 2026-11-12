import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ReactNode } from 'react';
import { Accordion as AccordionPrimitive, Switch as SwitchPrimitive, Tabs as TabsPrimitive, ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { Check, ChevronDown } from 'lucide-react';

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> { children?: ReactNode }
export function Checkbox({ children, className = '', ...props }: CheckboxProps) {
  return <label className={`rd-checkbox ${className}`}>
    <input {...props} type="checkbox" />
    <span className="rd-checkbox-box" aria-hidden="true"><Check size={12} /></span>
    {children && <span>{children}</span>}
  </label>;
}

export function Switch({ className = '', ...props }: ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>) {
  return <SwitchPrimitive.Root {...props} className={`rd-switch ${className}`}>
    <SwitchPrimitive.Thumb className="rd-switch-thumb" />
  </SwitchPrimitive.Root>;
}

export function Tabs({ className = '', ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root {...props} className={`rd-tabs ${className}`} />;
}

export interface TabOption { value: string; label: ReactNode; disabled?: boolean }
export interface TabsListProps { label: string; items: readonly TabOption[]; size?: 'sm' | 'md' | 'lg'; className?: string }
export function TabsList({ label, items, size, className = '' }: TabsListProps) {
  return <TabsPrimitive.List aria-label={label} className={`rd-tabs-list ${className}`} data-size={size}>
    {items.map(item => <TabsPrimitive.Trigger key={item.value} className="rd-tab" value={item.value} disabled={item.disabled}>{item.label}</TabsPrimitive.Trigger>)}
  </TabsPrimitive.List>;
}

export function TabsContent({ className = '', ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content {...props} className={`rd-tabs-content ${className}`} />;
}

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export function StatusBadge({ tone = 'neutral', children, className = '' }: { tone?: StatusTone; children: ReactNode; className?: string }) {
  return <span className={`rd-badge rd-badge--${tone} ${className}`}>{children}</span>;
}

export interface ToggleGroupItem { value: string; label: ReactNode; disabled?: boolean }
interface ToggleGroupBase { label: string; items: readonly ToggleGroupItem[]; disabled?: boolean; size?: 'sm' | 'md' | 'lg'; className?: string }
export interface ToggleGroupSingleProps extends ToggleGroupBase { type?: 'single'; value: string; onValueChange(value: string): void }
export interface ToggleGroupMultipleProps extends ToggleGroupBase { type: 'multiple'; value: string[]; onValueChange(value: string[]): void }
export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

export function ToggleGroup(props: ToggleGroupProps) {
  const { label, items, disabled = false, className = '', size } = props;
  const content = items.map(item => <ToggleGroupPrimitive.Item key={item.value} value={item.value} disabled={item.disabled || disabled} className="rd-toggle-group__item">
    {item.label}
  </ToggleGroupPrimitive.Item>);
  const cls = `rd-toggle-group ${className}`.trim();
  if (props.type === 'multiple') return <ToggleGroupPrimitive.Root type="multiple" value={props.value} onValueChange={props.onValueChange} disabled={disabled} aria-label={label} className={cls} data-size={size}>{content}</ToggleGroupPrimitive.Root>;
  return <ToggleGroupPrimitive.Root type="single" value={props.value} onValueChange={value => { if (value) props.onValueChange(value); }} disabled={disabled} aria-label={label} className={cls} data-size={size}>{content}</ToggleGroupPrimitive.Root>;
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
