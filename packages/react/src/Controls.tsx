import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ReactNode } from 'react';
import { Switch as SwitchPrimitive, Tabs as TabsPrimitive, ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { Check } from 'lucide-react';

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
export interface TabsListProps { label: string; items: readonly TabOption[]; className?: string }
export function TabsList({ label, items, className = '' }: TabsListProps) {
  return <TabsPrimitive.List aria-label={label} className={`rd-tabs-list ${className}`}>
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
interface ToggleGroupBase { label: string; items: readonly ToggleGroupItem[]; disabled?: boolean; className?: string }
export interface ToggleGroupSingleProps extends ToggleGroupBase { type?: 'single'; value: string; onValueChange(value: string): void }
export interface ToggleGroupMultipleProps extends ToggleGroupBase { type: 'multiple'; value: string[]; onValueChange(value: string[]): void }
export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

export function ToggleGroup(props: ToggleGroupProps) {
  const { label, items, disabled = false, className = '' } = props;
  const content = items.map(item => <ToggleGroupPrimitive.Item key={item.value} value={item.value} disabled={item.disabled || disabled} className="rd-toggle-group__item">
    {item.label}
  </ToggleGroupPrimitive.Item>);
  const cls = `rd-toggle-group ${className}`.trim();
  if (props.type === 'multiple') return <ToggleGroupPrimitive.Root type="multiple" value={props.value} onValueChange={props.onValueChange} disabled={disabled} aria-label={label} className={cls}>{content}</ToggleGroupPrimitive.Root>;
  return <ToggleGroupPrimitive.Root type="single" value={props.value} onValueChange={value => { if (value) props.onValueChange(value); }} disabled={disabled} aria-label={label} className={cls}>{content}</ToggleGroupPrimitive.Root>;
}
