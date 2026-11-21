import { useState, type ComponentProps, type ComponentPropsWithoutRef, type ReactNode } from 'react';

function fallbackInitials(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  if (/[\u3400-\u9fff]/.test(trimmed)) return trimmed.slice(0, 1);
  const initials = trimmed.split(/\s+/).filter(Boolean).slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '').join('');
  return initials || '?';
}

export interface AvatarProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  /** 可访问名称与首字回退来源。 */
  name: string;
  /** 头像图片；加载失败回退到首字。 */
  src?: string;
  /** 自定义回退内容；未传时取名字首字。 */
  fallback?: ReactNode;
  /** 圆形或圆角方形。 */
  shape?: 'circle' | 'square';
  /** 三档尺寸。 */
  size?: 'sm' | 'md' | 'lg';
  /** 纯装饰：移除 role 与 aria-label 并 aria-hidden。 */
  decorative?: boolean;
}

export function Avatar({ name, src, fallback, shape = 'circle', size = 'md', decorative = false, className = '', ...props }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  if (failedSrc !== undefined && failedSrc !== src) setFailedSrc(undefined);
  const showImage = src && src !== failedSrc;
  return <span {...props} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : name}
    aria-hidden={decorative ? true : undefined}
    className={`rd-avatar rd-avatar--${size} rd-avatar--${shape} ${className}`.trim()}>
    {showImage ? <img key={src} src={src} alt="" onError={() => setFailedSrc(src)} /> : <span className="rd-avatar__fallback" aria-hidden="true">{fallback ?? fallbackInitials(name)}</span>}
  </span>;
}

export interface TagProps extends ComponentPropsWithoutRef<'span'> {
  /** 中性标签文本；状态语义改用 StatusBadge。 */
  children: ReactNode;
}

export function Tag({ className = '', children, ...props }: TagProps) {
  return <span {...props} className={`rd-tag ${className}`.trim()}>{children}</span>;
}

export interface SkeletonProps extends ComponentProps<'div'> {
  /** 占位宽度；数字按 px 处理。 */
  width?: string | number;
  /** 占位高度；数字按 px 处理。 */
  height?: string | number;
}

export function Skeleton({ width, height, className = '', style, ...props }: SkeletonProps) {
  return <div {...props} aria-hidden="true" className={`rd-skeleton ${className}`.trim()} style={{ width, height, ...style }} />;
}
