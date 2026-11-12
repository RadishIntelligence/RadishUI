import { useRef, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Button, IconButton } from './Button';
import { Tag } from './Display';
import { Input } from './Fields';

export interface TagInputProps {
  value: readonly string[];
  onValueChange(value: string[]): void;
  draft: string;
  onDraftChange(draft: string): void;
  onAdd(): void;
  addLabel: string;
  removeLabel(tag: string): string;
  label?: string;
  disabled?: boolean;
}

export function TagInput({ value, onValueChange, draft, onDraftChange, onAdd, addLabel, removeLabel, label, disabled }: TagInputProps) {
  const input = useRef<HTMLInputElement>(null);
  const canAdd = Boolean(draft.trim());

  function add() {
    onAdd();
    input.current?.focus();
  }
  function remove(index: number) {
    onValueChange(value.filter((_, position) => position !== index));
    input.current?.focus();
  }
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    // Safari can end composition before dispatching the confirming keydown.
    if (event.nativeEvent.isComposing || event.keyCode === 229 || event.altKey || event.metaKey || event.ctrlKey) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      if (canAdd) add();
    } else if (event.key === 'Backspace' && !draft && value.length) {
      event.preventDefault();
      if (!event.repeat) remove(value.length - 1);
    }
  }

  return <div className="rd-tag-input">
    <div className="rd-tag-input__entry">
      <Input ref={input} aria-label={label} disabled={disabled} value={draft} onKeyDown={handleKeyDown}
        onChange={event => onDraftChange(event.target.value)} />
      <Button variant="secondary" disabled={disabled || !canAdd} onClick={add}>{addLabel}</Button>
    </div>
    {value.length > 0 && <ul className="rd-tag-input__list" role="list">
      {value.map((tag, index) => <li key={index}>
        <Tag className="rd-tag-input__tag">
          <span className="rd-tag-input__text">{tag}</span>
          <IconButton label={removeLabel(tag)} disabled={disabled} onClick={() => remove(index)}><X aria-hidden="true" /></IconButton>
        </Tag>
      </li>)}
    </ul>}
  </div>;
}
