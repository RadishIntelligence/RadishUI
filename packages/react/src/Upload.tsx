import { useId, useRef, useState, type DragEvent } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { IconButton } from './Button';
import { useFieldContext } from './Fields';

export interface UploadFile {
  /** 调用方持有的稳定 id，用于列表 key 与进度更新。 */
  id: string;
  /** 原始文件名。 */
  name: string;
  /** 字节数。 */
  size: number;
  /** MIME 类型；浏览器未提供时由调用方回退为空串。 */
  type: string;
  /** 0–100 的进度；提供时在文件行显示进度条。 */
  progress?: number;
}

export interface UploadProps {
  /** 已选文件；渲染、进度与删除都以此为准。 */
  files: readonly UploadFile[];
  /** 选择或拖入文件后回传浏览器 File；校验、去重与数量限制由调用方决定。 */
  onFilesSelected(files: readonly File[]): void;
  /** 删除文件回调。 */
  onRemove(file: UploadFile): void;
  /** 每个删除按钮的可访问名称。 */
  removeLabel(file: UploadFile): string;
  /** 拖放区的可见提示文案，例如「拖入文件，或点击选择」。 */
  prompt: string;
  /** 独立使用时的可访问名称；在 FormField 内由字段标签关联。 */
  label?: string;
  /** 系统文件选择器的 accept 提示；类型校验仍由调用方负责。 */
  accept?: string;
  /** 一次是否可以选择多个文件。 */
  multiple?: boolean;
  /** 禁用选择、拖入与删除。 */
  disabled?: boolean;
  /** 未传时继承 FormField 的 required。 */
  required?: boolean;
  /** 附加类名，不改变字段结构。 */
  className?: string;
}

function formatSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) return '';
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  const units = ['KB', 'MB', 'GB'] as const;
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit += 1; }
  return `${value >= 10 ? Math.round(value) : Number(value.toFixed(1))} ${units[unit]}`;
}

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function Upload({ files, onFilesSelected, onRemove, removeLabel, prompt, label, accept, multiple = true, disabled = false, required, className = '' }: UploadProps) {
  const field = useFieldContext();
  const generatedId = useId();
  const inputId = field?.id ?? generatedId;
  const input = useRef<HTMLInputElement>(null);
  const removeButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);

  function pick(list: FileList | null) {
    if (!list || list.length === 0) return;
    const picked = multiple ? [...list] : [...list].slice(0, 1);
    onFilesSelected(picked);
    // Reset so choosing the same file again still fires a change event.
    if (input.current) input.current.value = '';
  }
  function removeAt(index: number) {
    const file = files[index];
    if (!file) return;
    onRemove(file);
    // Keep keyboard focus predictable: next remove button, previous one, then the picker.
    requestAnimationFrame(() => {
      const target = removeButtons.current[index] ?? removeButtons.current[index - 1] ?? input.current;
      target?.focus();
    });
  }
  function enter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current += 1;
    setDragging(true);
  }
  function over(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!disabled) event.dataTransfer.dropEffect = 'copy';
  }
  function leave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  }
  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (!disabled) pick(event.dataTransfer.files);
  }

  return <div className={`rd-upload ${className}`.trim()} data-disabled={disabled || undefined}>
    <div className="rd-upload__dropzone" data-dragging={dragging || undefined} data-invalid={field?.invalid || undefined}
      onDragEnter={enter} onDragOver={over} onDragLeave={leave} onDrop={drop}>
      <input ref={input} id={inputId} className="rd-upload__input" type="file" accept={accept} multiple={multiple} disabled={disabled}
        required={required ?? field?.required} aria-label={label} aria-describedby={field?.describedBy}
        aria-invalid={field?.invalid || undefined} onChange={event => pick(event.currentTarget.files)} />
      <FileText className="rd-upload__icon" size={20} aria-hidden="true" />
      <span className="rd-upload__prompt">{prompt}</span>
    </div>
    {files.length > 0 && <ul className="rd-upload__list" aria-label={field ? undefined : label}>
      {files.map((file, index) => <li key={file.id} className="rd-upload__item">
        <FileText className="rd-upload__item-icon" size={16} aria-hidden="true" />
        <span className="rd-upload__name">{file.name}</span>
        <span className="rd-upload__size">{formatSize(file.size)}</span>
        {file.progress !== undefined && <span className="rd-upload__progress" role="progressbar" aria-label={file.name}
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={clamp(file.progress)}>
          <span className="rd-upload__progress-bar" style={{ width: `${clamp(file.progress)}%` }} />
        </span>}
        <IconButton className="rd-upload__remove" size="sm" label={removeLabel(file)} disabled={disabled}
          ref={element => { removeButtons.current[index] = element; }} onClick={() => removeAt(index)}><Trash2 size={14} aria-hidden="true" /></IconButton>
      </li>)}
    </ul>}
  </div>;
}
