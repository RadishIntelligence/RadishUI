import { useRef, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Button, IconButton } from './Button';
import { Tag } from './Display';
import { Input } from './Fields';

export interface TagInputProps {
  /** 已保存的标签；渲染与删除都以此为准。 */
  value: readonly string[];
  /** 删除标签时回传新数组；添加由 onAdd 处理。 */
  onValueChange(value: string[]): void;
  /** 输入框草稿；由调用方持有。 */
  draft: string;
  /** 草稿变化回调。 */
  onDraftChange(draft: string): void;
  /** Enter 或添加按钮触发；是否去重、限长由调用方决定。 */
  onAdd(): void;
  /** 添加按钮文案。 */
  addLabel: string;
  /** 每个删除按钮的可访问名称。 */
  removeLabel(tag: string): string;
  /** 独立使用时的可访问名称；在 FormField 内由字段标签关联。 */
  label?: string;
  /** 禁用输入、添加与删除。 */
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
