import { createContext, useContext, useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type ComponentPropsWithRef, type FormEvent, type ReactNode } from 'react';
import { RadioGroup as RadioGroupPrimitive, Select as SelectPrimitive } from 'radix-ui';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface FieldState { id: string; labelId: string; describedBy?: string; invalid: boolean; required?: boolean }
export type FieldSurface = 'outline' | 'filled';
const FieldContext = createContext<FieldState | undefined>(undefined);

/** 供字段内复合控件读取 FormField 的 id、说明、错误与必填关联；不对外导出。 */
export function useFieldContext() {
  return useContext(FieldContext);
}

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


export type FormErrors = Record<string, ReactNode>;

export interface FormProps extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit' | 'onInvalid' | 'noValidate'> {
  /** 提交前校验；返回以字段 id 为键的错误，全部通过时返回空对象或 undefined。 */
  validate?: () => FormErrors | undefined;
  /** 校验通过后提交；原生提交已被阻止。 */
  onValidSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  /** 校验未通过时回调，便于调用方同步错误状态。 */
  onInvalid?: (errors: FormErrors) => void;
  /** 字段与操作区。 */
  children: ReactNode;
}

/**
 * Caller-owned validation wrapper: it never computes rules and never renders error
 * text. Submitting asks `validate` for messages keyed by field id, then focuses the
 * first invalid field in DOM order (FormField still renders the error and alert).
 */
export function Form({ validate, onValidSubmit, onInvalid, className = '', children, ...props }: FormProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate?.() ?? {};
    const entries = Object.entries(errors).filter(([, message]) => message !== undefined && message !== null && message !== '');
    if (entries.length === 0) { onValidSubmit?.(event); return; }
    onInvalid?.(errors);
    const form = event.currentTarget;
    const target = entries
      .map(([id]) => form.querySelector<HTMLElement>(`#${CSS.escape(id)}`))
      .filter((element): element is HTMLElement => Boolean(element))
      .sort((first, second) => first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1)[0];
    (target ?? form.querySelector<HTMLElement>('[aria-invalid="true"]'))?.focus();
  }
  return <form {...props} noValidate className={`rd-form ${className}`.trim()} onSubmit={submit}>{children}</form>;
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

export interface InputNumberProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'> {
  /** 受控数值；null 显示为空，失焦时回到最近一次有效值。 */
  value: number | null;
  /** 数值变化回调；输入非法文本时不调用，失焦 / 步进时钳制到 min / max 内。 */
  onValueChange(value: number | null): void;
  /** 允许的最小值；未传时不限制。 */
  min?: number;
  /** 允许的最大值；未传时不限制。 */
  max?: number;
  /** 方向键与步进按钮的增量，默认 1；小数步进按步长精度显示。 */
  step?: number;
  /** 输入表面；filled 用于强调或分组背景。 */
  surface?: FieldSurface;
  /** 是否显示上下步进按钮，默认显示；按钮不进入 Tab 顺序，粗指针 / 触屏隐藏，用数字键盘与方向键输入。 */
  controls?: boolean;
  /** 增加按钮的可访问名称。 */
  increaseLabel?: string;
  /** 减少按钮的可访问名称。 */
  decreaseLabel?: string;
}

function numberPrecision(step: number) {
  const text = String(step);
  const dot = text.indexOf('.');
  return dot === -1 ? 0 : text.length - dot - 1;
}

function roundToStep(value: number, step: number) {
  return Number(value.toFixed(Math.min(12, numberPrecision(step))));
}

function clampNumber(value: number, min?: number, max?: number) {
  return Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min ?? Number.NEGATIVE_INFINITY, value));
}

function formatNumber(value: number | null, step: number) {
  if (value === null) return '';
  const precision = Math.min(12, numberPrecision(step));
  return precision ? value.toFixed(precision).replace(/\.?0+$/, '') : String(value);
}

function parseNumber(text: string): number | null | undefined {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function InputNumber({
  value, onValueChange, min, max, step = 1, surface = 'outline', controls = true,
  increaseLabel = '增加', decreaseLabel = '减少', className = '', id, required, disabled, readOnly,
  ref, onBlur, onKeyDown, 'aria-describedby': description, 'aria-invalid': invalid, ...props
}: InputNumberProps) {
  const field = useContext(FieldContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const increment = step > 0 ? step : 1;
  const [draft, setDraft] = useState(() => formatNumber(value, increment));
  const lastValue = useRef(value);
  const assignRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
  };
  useEffect(() => {
    lastValue.current = value;
    if (document.activeElement === inputRef.current) return;
    setDraft(formatNumber(value, increment));
  }, [value, increment]);
  const commit = (next: number | null) => {
    lastValue.current = next;
    setDraft(formatNumber(next, increment));
    onValueChange(next);
  };
  const normalize = (raw: number) => clampNumber(roundToStep(raw, increment), min, max);
  const stepBy = (direction: 1 | -1) => {
    if (disabled || readOnly) return;
    const base = lastValue.current ?? min ?? 0;
    commit(normalize(base + direction * increment));
  };
  const commitDraft = () => {
    const parsed = parseNumber(draft);
    if (parsed === null || parsed === undefined) { setDraft(formatNumber(value, increment)); return; }
    commit(normalize(parsed));
  };
  const atMin = value !== null && min !== undefined && value <= min;
  const atMax = value !== null && max !== undefined && value >= max;
  return <div className={`rd-input-number ${className}`.trim()} data-surface={surface} data-controls={controls || undefined} data-disabled={disabled || undefined} data-readonly={readOnly || undefined}>
    <input {...props} ref={assignRef} id={id ?? field?.id} required={required ?? field?.required}
      type="text" inputMode="decimal" autoComplete="off" role="spinbutton"
      aria-valuenow={value ?? undefined} aria-valuemin={min} aria-valuemax={max}
      aria-describedby={[description, field?.describedBy].filter(Boolean).join(' ') || undefined}
      aria-invalid={invalid ?? (field?.invalid || undefined)}
      disabled={disabled} readOnly={readOnly} value={draft}
      onChange={event => {
        const text = event.target.value;
        setDraft(text);
        const parsed = parseNumber(text);
        if (parsed === null) { lastValue.current = null; onValueChange(null); }
        else if (parsed !== undefined) { const rounded = roundToStep(parsed, increment); lastValue.current = rounded; onValueChange(rounded); }
      }}
      onBlur={event => { onBlur?.(event); if (!event.defaultPrevented) commitDraft(); }}
      onKeyDown={event => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.nativeEvent.isComposing) return;
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          stepBy(event.key === 'ArrowUp' ? 1 : -1);
        }
      }}
      data-surface={surface} className="rd-input rd-input-number__input" />
    {controls && <span className="rd-input-number__controls">
      <button type="button" tabIndex={-1} aria-label={increaseLabel} disabled={disabled || readOnly || atMax}
        onClick={() => stepBy(1)}><ChevronUp size={14} aria-hidden="true" /></button>
      <button type="button" tabIndex={-1} aria-label={decreaseLabel} disabled={disabled || readOnly || atMin}
        onClick={() => stepBy(-1)}><ChevronDown size={14} aria-hidden="true" /></button>
    </span>}
  </div>;
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
