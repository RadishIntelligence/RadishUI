import { useEffect, useId, useState, type FormEvent, type MouseEvent, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, IconButton } from './Button';
import { Input, Select } from './Fields';
import { paginationRange, validatePage } from './pagination';

export interface PaginationLabels {
  nav: string;
  summary: (total: number) => string;
  pageSize: string;
  pageSizeOption: (size: number) => string;
  previous: string;
  next: string;
  page: (page: number) => string;
  position: (page: number, total: number) => string;
  jump: string;
  jumpUnit: string;
  jumpAction: string;
  jumpError: (total: number) => string;
}

export const defaultPaginationLabels: PaginationLabels = {
  nav: '分页',
  summary: total => `共 ${total} 项`,
  pageSize: '每页条数',
  pageSizeOption: size => `${size} 条/页`,
  previous: '上一页',
  next: '下一页',
  page: page => `第 ${page} 页`,
  position: (page, total) => `第 ${page} 页，共 ${total} 页`,
  jump: '前往',
  jumpUnit: '页',
  jumpAction: '跳转',
  jumpError: total => `请输入 1–${total} 之间的整数。`,
};

export interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  totalItems: number;
  onPageChange(page: number): void;
  onPageSizeChange(size: number): void;
  pageSizeOptions?: readonly number[];
  labels?: Partial<PaginationLabels>;
  className?: string;
}

export function Pagination({ page, pageCount, pageSize, totalItems, onPageChange, onPageSizeChange, pageSizeOptions = [5, 10, 20, 50], labels: labelOverrides, className = '' }: PaginationProps) {
  const labels = { ...defaultPaginationLabels, ...labelOverrides };
  const jumpId = useId();
  const errorId = useId();
  const [jump, setJump] = useState(String(page));
  const [invalid, setInvalid] = useState(false);
  // The page prop can change from outside (page size, filters); keep the input in sync.
  useEffect(() => { setJump(String(page)); setInvalid(false); }, [page]);
  function submit(event: FormEvent) {
    event.preventDefault();
    const value = validatePage(jump, pageCount);
    if (value === undefined) { setInvalid(true); return; }
    setInvalid(false);
    if (value !== page) onPageChange(value);
  }
  const position = <span className="rd-pagination__position" aria-label={labels.position(page, pageCount)}>{page} / {pageCount}</span>;
  const single = <span className="rd-pagination__single" aria-label={labels.position(page, pageCount)}>{page} / {pageCount}</span>;
  return <>
    <nav className={`rd-pagination ${className}`.trim()} aria-label={labels.nav}>
      <span className="rd-pagination__summary" role="status">{labels.summary(totalItems)}</span>
      <Select label={labels.pageSize} className="rd-pagination__size" value={String(pageSize)}
        onValueChange={value => onPageSizeChange(Number(value))}
        options={pageSizeOptions.map(size => ({ value: String(size), label: labels.pageSizeOption(size) }))} />
      {pageCount > 1 ? <>
        <div className="rd-pagination__buttons">
          <IconButton label={labels.previous} disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft /></IconButton>
          {paginationRange(page, pageCount).map((item, index) => item === 'gap'
            ? <span className="rd-pagination__gap" key={`gap-${index}`}>…</span>
            : <Button key={item} size="sm" className="rd-pagination__number" variant={item === page ? 'primary' : 'ghost'}
              aria-current={item === page ? 'page' : undefined} aria-label={labels.page(item)} onClick={() => onPageChange(item)}>{item}</Button>)}
          {position}
          <IconButton label={labels.next} disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}><ChevronRight /></IconButton>
        </div>
        <form className="rd-pagination__jump" onSubmit={submit} noValidate>
          <label htmlFor={jumpId}>{labels.jump}</label>
          <Input id={jumpId} inputMode="numeric" value={jump}
            onChange={event => { setJump(event.target.value); setInvalid(false); }}
            aria-invalid={invalid || undefined} aria-describedby={invalid ? errorId : undefined} />
          <span>{labels.jumpUnit}</span>
          <Button variant="secondary" size="sm" type="submit">{labels.jumpAction}</Button>
        </form>
      </> : single}
    </nav>
    {invalid && pageCount > 1 && <p id={errorId} className="rd-pagination__error" role="alert">{labels.jumpError(pageCount)}</p>}
  </>;
}

export interface TableOfContentsItem {
  id: string;
  level?: number;
  text: ReactNode;
}

export interface TableOfContentsProps {
  label: string;
  items: readonly TableOfContentsItem[];
  currentId?: string;
  hrefFor?(id: string): string;
  onNavigate?(id: string, event: MouseEvent<HTMLAnchorElement>): void;
  className?: string;
}

export function TableOfContents({ label, items, currentId, hrefFor = id => `#${id}`, onNavigate, className = '' }: TableOfContentsProps) {
  return <nav className={`rd-toc ${className}`.trim()} aria-label={label}>
    <ol>{items.map(item => <li key={item.id} data-level={item.level ?? 2}>
      <a href={hrefFor(item.id)} aria-current={currentId === item.id ? 'location' : undefined}
        onClick={event => onNavigate?.(item.id, event)}>{item.text}</a>
    </li>)}</ol>
  </nav>;
}
