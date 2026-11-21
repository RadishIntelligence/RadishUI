import { createContext, useContext, useId, useRef, useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { RadioGroup as RadioGroupPrimitive, Select as SelectPrimitive } from 'radix-ui';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface FieldState { id: string; labelId: string; describedBy?: string; invalid: boolean; required?: boolean }
export type FieldSurface = 'outline' | 'filled';
const FieldContext = createContext<FieldState | undefined>(undefined);

export interface FormFieldProps {
  /** 控件 id；未传时生成稳定 id。 */
  id?: string;
  /** 字段标签；通过 htmlFor 关联字段内控件。 */
  label: ReactNode;
  /** 补充说明；error 存在时不显示。 */
  hint?: ReactNode;
  /** 错误文本；role=alert，并把 aria-invalid 传给字段内控件。 */
  error?: ReactNode;
  /** 显示必填标记，并把 required 传给字段内控件。 */
  required?: boolean;
  /** 附加类名，不改变字段结构。 */
  className?: string;
  /** 字段控件；Input / Textarea / Select 自动读取标签、说明、错误与必填。 */
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
  /** 受控当前值。 */
  value: string;
  /** 选择或方向键移动时回传。 */
  onValueChange(value: string): void;
  /** 选项列表；label 为字符串，保证可访问名称。 */
  options: readonly RadioOption[];
  /** 独立使用时的可访问名称；FormField 内由字段标签关联。 */
  label?: string;
  /** 表单提交字段名。 */
  name?: string;
  /** 禁用整组；禁用项不进入方向键顺序。 */
  disabled?: boolean;
  /** 未传时继承 FormField 的 required。 */
  required?: boolean;
  /** 排列方向；水平用于紧凑选项。 */
  orientation?: 'vertical' | 'horizontal';
  /** 附加类名。 */
  className?: string;
  /** 组内第一项的 id 基准；FormField 内自动继承。 */
  id?: string;
}
export function RadioGroup({ value, onValueChange, options, label, name, disabled, required, orientation = 'vertical', className = '', id: suppliedId }: RadioGroupProps) {
  const field = useContext(FieldContext);
  const generatedId = useId();
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const groupId = suppliedId ?? field?.id ?? generatedId;
  const selectedIndex = options.findIndex(option => option.value === value);
  const anchorIndex = selectedIndex === -1 ? 0 : selectedIndex;
  return <RadioGroupPrimitive.Root value={value} onValueChange={onValueChange} name={name} disabled={disabled}
    required={required ?? field?.required} orientation={orientation}
    aria-label={field ? undefined : label} aria-labelledby={field?.labelId}
    aria-describedby={field?.describedBy} aria-invalid={field?.invalid || undefined}
    data-keyboard-focus={keyboardFocus || undefined}
    onKeyDownCapture={event => { if (event.key.startsWith('Arrow')) setKeyboardFocus(true); }}
    onPointerDownCapture={() => setKeyboardFocus(false)}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false); }}
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

export interface InputProps extends ComponentPropsWithRef<'input'> {
  /** 输入表面；filled 用于强调或分组背景。 */
  surface?: FieldSurface;
}
export function Input({ className = '', surface = 'outline', id, required, 'aria-describedby': description, 'aria-invalid': invalid, ...props }: InputProps) {
  const field = useContext(FieldContext);
  return <input {...props} id={id ?? field?.id} required={required ?? field?.required}
    aria-describedby={[description, field?.describedBy].filter(Boolean).join(' ') || undefined}
    aria-invalid={invalid ?? (field?.invalid || undefined)} data-surface={surface} className={`rd-input ${className}`} />;
}

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  /** 输入表面；与 Input 使用同一组语义。 */
  surface?: FieldSurface;
}
export function Textarea({ className = '', surface = 'outline', id, required, 'aria-describedby': description, 'aria-invalid': invalid, ...props }: TextareaProps) {
  const field = useContext(FieldContext);
  return <textarea {...props} id={id ?? field?.id} required={required ?? field?.required}
    aria-describedby={[description, field?.describedBy].filter(Boolean).join(' ') || undefined}
    aria-invalid={invalid ?? (field?.invalid || undefined)} data-surface={surface} className={`rd-input rd-textarea ${className}`} />;
}

export interface SelectOption { value: string; label: string; disabled?: boolean }
export interface SelectProps {
  /** 受控当前值；空字符串表示未选择。 */
  value: string;
  /** 选择变化回调；由调用方保存状态。 */
  onValueChange(value: string): void;
  /** 选项列表；禁用项会跳过键盘移动。 */
  options: readonly SelectOption[];
  /** 触发器 id；在 FormField 内自动生成。 */
  id?: string;
  /** 表单提交用的隐藏字段名。 */
  name?: string;
  /** 独立使用时的可访问名称；在 FormField 内由字段标签关联。 */
  label?: string;
  /** 未选择时的触发器文案。 */
  placeholder?: string;
  /** 触发器不可用，不进入 Tab 顺序。 */
  disabled?: boolean;
  /** 未传时继承 FormField 的 required。 */
  required?: boolean;
  /** 附加类名，不改变浮层行为。 */
  className?: string;
  /** 触发器表面；filled 只作为可选形态。 */
  surface?: FieldSurface;
  /** sm 用于页面 chrome，md 用于表单字段。 */
  size?: 'sm' | 'md';
}

export function Select({ value, onValueChange, options, id, name, label, placeholder, disabled, required, className = '', surface = 'outline', size = 'md' }: SelectProps) {
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
      aria-invalid={field?.invalid || undefined} data-surface={surface} data-size={size} className={`rd-select ${className}`}>
      <SelectPrimitive.Value placeholder={placeholder} />
      <SelectPrimitive.Icon><ChevronDown size={16} /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className="rd-select-content" data-size={size} position="popper" sideOffset={6} collisionPadding={12}
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
