import { useEffect, useId, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';

function sanitizeDigits(value: string) {
  return value.replace(/\D/g, '');
}

export interface InputOTPProps {
  value: string;
  onValueChange(value: string): void;
  label: string;
  length?: number;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  name?: string;
  id?: string;
  className?: string;
  onEnterPress?(): void;
}

export function InputOTP({ value, onValueChange, label, length = 6, hint, error, disabled = false, required = false, autoFocus = false, autoComplete = 'one-time-code', name, id, className = '', onEnterPress }: InputOTPProps) {
  const count = Math.max(1, Math.floor(length));
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const descriptionId = `${generatedId}-description`;
  const firstId = id ?? `${generatedId}-0`;
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [editedSlots, setEditedSlots] = useState<string[]>();
  const code = sanitizeDigits(value).slice(0, count);
  // Keep empty slots for local edits while the controlled value stays a digit string.
  const matchesEdit = editedSlots && editedSlots.length === count && editedSlots.join('') === code;
  if (editedSlots && !matchesEdit) setEditedSlots(undefined);
  const digits = matchesEdit ? editedSlots : Array.from({ length: count }, (_, index) => code[index] ?? '');
  const currentDigits = () => Array.from({ length: count }, (_, index) => inputRefs.current[index]?.value ?? digits[index]);

  useEffect(() => {
    if (!autoFocus || disabled) return;
    const firstEmpty = digits.findIndex(digit => digit === '');
    const target = inputRefs.current[firstEmpty >= 0 ? firstEmpty : count - 1];
    target?.focus();
    target?.select();
  }, [autoFocus, disabled, count]);

  const focusInput = (index: number) => {
    if (index < 0 || index >= count) return;
    const target = inputRefs.current[index];
    target?.focus();
    target?.select();
  };

  const emit = (nextDigits: string[]) => {
    setEditedSlots(nextDigits);
    onValueChange(nextDigits.join(''));
  };

  const fillDigits = (startIndex: number, rawValue: string) => {
    const incoming = sanitizeDigits(rawValue).slice(0, count - startIndex).split('');
    if (incoming.length === 0) return;
    const nextDigits = currentDigits();
    incoming.forEach((digit, offset) => { nextDigits[startIndex + offset] = digit; });
    emit(nextDigits);
    focusInput(Math.min(startIndex + incoming.length, count - 1));
  };

  const handleChange = (index: number, nextValue: string) => {
    const incoming = sanitizeDigits(nextValue);
    if (incoming.length === 0) {
      const nextDigits = currentDigits();
      nextDigits[index] = '';
      emit(nextDigits);
      return;
    }
    if (incoming.length > 1) {
      fillDigits(index, incoming);
      return;
    }
    const nextDigits = currentDigits();
    nextDigits[index] = incoming;
    emit(nextDigits);
    if (index < count - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.nativeEvent.isComposing) return;
    if (event.key === 'Backspace') {
      event.preventDefault();
      const nextDigits = currentDigits();
      if (nextDigits[index]) {
        nextDigits[index] = '';
        emit(nextDigits);
      } else if (index > 0) {
        nextDigits[index - 1] = '';
        emit(nextDigits);
        focusInput(index - 1);
      }
      return;
    }
    if (event.key === 'Delete') {
      event.preventDefault();
      const nextDigits = currentDigits();
      nextDigits[index] = '';
      emit(nextDigits);
      return;
    }
    if (event.key === 'ArrowLeft') { event.preventDefault(); focusInput(index - 1); return; }
    if (event.key === 'ArrowRight') { event.preventDefault(); focusInput(index + 1); return; }
    if (event.key === 'Home') { event.preventDefault(); focusInput(0); return; }
    if (event.key === 'End') { event.preventDefault(); focusInput(count - 1); return; }
    if (event.key === 'Enter') { onEnterPress?.(); return; }
    if (event.key.length === 1 && !/\d/.test(event.key)) event.preventDefault();
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    fillDigits(index, event.clipboardData.getData('text'));
  };

  return <div className={`rd-field rd-otp ${className}`.trim()}>
    <label className="rd-label" id={labelId} htmlFor={firstId}>{label}{required && <span className="rd-label__required" aria-hidden="true"> *</span>}</label>
    <div className="rd-otp__digits" role="group" aria-labelledby={labelId} aria-describedby={error || hint ? descriptionId : undefined} aria-invalid={error ? true : undefined} aria-required={required || undefined}>
      {digits.map((digit, index) => <input
        key={index}
        ref={element => { inputRefs.current[index] = element; }}
        id={index === 0 ? firstId : undefined}
        className="rd-otp__input"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        autoComplete={index === 0 ? autoComplete : undefined}
        value={digit}
        disabled={disabled}
        aria-label={`${label}，第 ${index + 1} 位`}
        aria-invalid={error ? true : undefined}
        onChange={event => handleChange(index, event.target.value)}
        onKeyDown={event => handleKeyDown(index, event)}
        onPaste={event => handlePaste(index, event)}
        onFocus={event => event.currentTarget.select()}
      />)}
    </div>
    {name && <input type="hidden" name={name} value={digits.join('')} disabled={disabled} />}
    {error ? <p className="rd-field-error" id={descriptionId}>{error}</p> : hint ? <p className="rd-field-hint" id={descriptionId}>{hint}</p> : null}
  </div>;
}
