import { createContext, useContext, useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { Select as SelectPrimitive } from 'radix-ui';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface FieldState { id: string; describedBy?: string; invalid: boolean; required?: boolean }
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
  return <FieldContext.Provider value={{ id, describedBy, invalid: Boolean(error), required }}>
    <div className={`rd-field ${className}`}>
      <label className="rd-label" htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      {children}
      {error ? <p className="rd-field-error" id={`${id}-error`} role="alert">{error}</p>
        : hint ? <p className="rd-field-hint" id={`${id}-hint`}>{hint}</p> : null}
    </div>
  </FieldContext.Provider>;
}

export function Input({ className = '', id, required, 'aria-describedby': description, 'aria-invalid': invalid, ...props }: ComponentPropsWithRef<'input'>) {
  const field = useContext(FieldContext);
  return <input {...props} id={id ?? field?.id} required={required ?? field?.required}
    aria-describedby={[description, field?.describedBy].filter(Boolean).join(' ') || undefined}
    aria-invalid={invalid ?? (field?.invalid || undefined)} className={`rd-input ${className}`} />;
}

export function Textarea({ className = '', id, required, 'aria-describedby': description, 'aria-invalid': invalid, ...props }: ComponentPropsWithRef<'textarea'>) {
  const field = useContext(FieldContext);
  return <textarea {...props} id={id ?? field?.id} required={required ?? field?.required}
    aria-describedby={[description, field?.describedBy].filter(Boolean).join(' ') || undefined}
    aria-invalid={invalid ?? (field?.invalid || undefined)} className={`rd-input rd-textarea ${className}`} />;
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
}

export function Select({ value, onValueChange, options, id, name, label, placeholder, disabled, required, className = '' }: SelectProps) {
  const field = useContext(FieldContext);
  return <SelectPrimitive.Root value={value} onValueChange={onValueChange} name={name} disabled={disabled} required={required ?? field?.required}>
    <SelectPrimitive.Trigger id={id ?? field?.id} aria-label={label} aria-describedby={field?.describedBy}
      aria-invalid={field?.invalid || undefined} className={`rd-select ${className}`}>
      <SelectPrimitive.Value placeholder={placeholder} />
      <SelectPrimitive.Icon><ChevronDown size={16} /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className="rd-select-content" position="popper" sideOffset={6} collisionPadding={12}>
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
