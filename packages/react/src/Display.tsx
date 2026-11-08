import { useEffect, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';

function fallbackInitials(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  if (/[\u3400-\u9fff]/.test(trimmed)) return trimmed.slice(0, 1);
  const initials = trimmed.split(/\s+/).filter(Boolean).slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '').join('');
  return initials || '?';
}

export interface AvatarProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  name: string;
  src?: string;
  fallback?: ReactNode;
  shape?: 'circle' | 'square';
  size?: 'sm' | 'md' | 'lg';
  decorative?: boolean;
}

export function Avatar({ name, src, fallback, shape = 'circle', size = 'md', decorative = false, className = '', ...props }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const showImage = Boolean(src) && !failed;
  return <span {...props} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : name}
    aria-hidden={decorative ? true : undefined}
    className={`rd-avatar rd-avatar--${size} rd-avatar--${shape} ${className}`.trim()}>
    {showImage ? <img src={src} alt="" onError={() => setFailed(true)} /> : <span className="rd-avatar__fallback" aria-hidden="true">{fallback ?? fallbackInitials(name)}</span>}
  </span>;
}

export interface TagProps extends ComponentPropsWithoutRef<'span'> { children: ReactNode }

export function Tag({ className = '', children, ...props }: TagProps) {
  return <span {...props} className={`rd-tag ${className}`.trim()}>{children}</span>;
}

export interface SkeletonProps extends ComponentPropsWithoutRef<'div'> {
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ width, height, className = '', style, ...props }: SkeletonProps) {
  return <div {...props} aria-hidden="true" className={`rd-skeleton ${className}`.trim()} style={{ width, height, ...style }} />;
}
