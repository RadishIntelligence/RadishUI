import { createContext, useContext, useId, useRef, useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { RadioGroup as RadioGroupPrimitive, Select as SelectPrimitive } from 'radix-ui';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface FieldState { id: string; labelId: string; describedBy?: string; invalid: boolean; required?: boolean }
export type FieldSurface = 'outline' | 'filled';
const FieldContext = createContext<FieldState | undefined>(undefined);

export interface FormFieldProps {
  id?: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function FormField({ id: suppliedId, label, hint, error, required, className = '', children }: FormFieldProps) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const labelId = `${id}-label`;
  return <FieldContext.Provider value={{ id, labelId, describedBy, invalid: Boolean(error), required }}>
    <div className={`rd-field ${className}`}>
      <label className="rd-label" id={labelId} htmlFor={id}>{label}{required && <span className="rd-label__required" aria-hidden="true"> *</span>}</label>
      {children}
      {error ? <p className="rd-field-error" id={`${id}-error`} role="alert">{error}</p>
        : hint ? <p className="rd-field-hint" id={`${id}-hint`}>{hint}</p> : null}
    </div>
  </FieldContext.Provider>;
}

export interface RadioOption { value: string; label: string; disabled?: boolean }
export interface RadioGroupProps {
  value: string;
  onValueChange(value: string): void;
  options: readonly RadioOption[];
  label?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  id?: string;
}
export function RadioGroup({ value, onValueChange, options, label, name, disabled, required, orientation = 'vertical', className = '', id: suppliedId }: RadioGroupProps) {
  const field = useContext(FieldContext);
  const generatedId = useId();
  const groupId = suppliedId ?? field?.id ?? generatedId;
  const selectedIndex = options.findIndex(option => option.value === value);
  const anchorIndex = selectedIndex === -1 ? 0 : selectedIndex;
  return <RadioGroupPrimitive.Root value={value} onValueChange={onValueChange} name={name} disabled={disabled}
    required={required ?? field?.required} orientation={orientation}
    aria-label={field ? undefined : label} aria-labelledby={field?.labelId}
    aria-describedby={field?.describedBy} aria-invalid={field?.invalid || undefined}
    className={`rd-radio-group ${orientation === 'horizontal' ? 'rd-radio-group--horizontal' : ''} ${className}`.trim()}>
    {options.map((option, index) => {
      const itemId = index === anchorIndex ? groupId : `${groupId}-${index + 1}`;
      return <div className="rd-radio" key={option.value}>
        <RadioGroupPrimitive.Item id={itemId} value={option.value} disabled={option.disabled}
          aria-label={option.label} className="rd-radio__item"
          onFocus={() => { if (value !== option.value) onValueChange(option.value); }}>
          <RadioGroupPrimitive.Indicator className="rd-radio__indicator" />
        </RadioGroupPrimitive.Item>
        <label className="rd-radio__label" htmlFor={itemId}>{option.label}</label>
      </div>;
    })}
  </RadioGroupPrimitive.Root>;
}

export function Input({ className = '', surface = 'outline', id, required, 'aria-describedby': description, 'aria-invalid': invalid, ...props }: ComponentPropsWithRef<'input'> & { surface?: FieldSurface }) {
  const field = useContext(FieldContext);
  return <input {...props} id={id ?? field?.id} required={required ?? field?.required}
    aria-describedby={[description, field?.describedBy].filter(Boolean).join(' ') || undefined}
    aria-invalid={invalid ?? (field?.invalid || undefined)} data-surface={surface} className={`rd-input ${className}`} />;
}

export function Textarea({ className = '', surface = 'outline', id, required, 'aria-describedby': description, 'aria-invalid': invalid, ...props }: ComponentPropsWithRef<'textarea'> & { surface?: FieldSurface }) {
  const field = useContext(FieldContext);
  return <textarea {...props} id={id ?? field?.id} required={required ?? field?.required}
    aria-describedby={[description, field?.describedBy].filter(Boolean).join(' ') || undefined}
    aria-invalid={invalid ?? (field?.invalid || undefined)} data-surface={surface} className={`rd-input rd-textarea ${className}`} />;
}

export interface SelectOption { value: string; label: string; disabled?: boolean }
export interface SelectProps {
  value: string;
  onValueChange(value: string): void;
  options: readonly SelectOption[];
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  surface?: FieldSurface;
}

export function Select({ value, onValueChange, options, id, name, label, placeholder, disabled, required, className = '', surface = 'outline' }: SelectProps) {
  const field = useContext(FieldContext);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeOnClick = useRef(false);
  return <SelectPrimitive.Root open={open} onOpenChange={setOpen} value={value} onValueChange={onValueChange} name={name} disabled={disabled} required={required ?? field?.required}>
    <SelectPrimitive.Trigger ref={triggerRef} id={id ?? field?.id} aria-label={label} aria-describedby={field?.describedBy}
      onPointerDown={event => { closeOnClick.current = open && event.pointerType !== 'mouse'; }}
      onPointerCancel={() => { closeOnClick.current = false; }}
      onClick={event => {
        if (closeOnClick.current) {
          closeOnClick.current = false;
          event.preventDefault();
          setOpen(false);
        }
      }}
      aria-invalid={field?.invalid || undefined} data-surface={surface} className={`rd-select ${className}`}>
      <SelectPrimitive.Value placeholder={placeholder} />
      <SelectPrimitive.Icon><ChevronDown size={16} /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className="rd-select-content" position="popper" sideOffset={6} collisionPadding={12}
        onPointerDownOutside={event => {
          const { pointerType, target } = event.detail.originalEvent;
          // Keep the popup open until the touch click can toggle it closed.
          if (pointerType !== 'mouse' && target instanceof Node && triggerRef.current?.contains(target)) {
            event.preventDefault();
          }
        }}>
        <SelectPrimitive.ScrollUpButton className="rd-select-scroll"><ChevronUp size={16} /></SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="rd-select-viewport">
          {options.map(option => <SelectPrimitive.Item className="rd-select-item" key={option.value} value={option.value} disabled={option.disabled}>
            <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator><Check size={16} /></SelectPrimitive.ItemIndicator>
          </SelectPrimitive.Item>)}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="rd-select-scroll"><ChevronDown size={16} /></SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  </SelectPrimitive.Root>;
}
