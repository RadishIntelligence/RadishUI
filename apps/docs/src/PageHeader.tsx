import { ArrowLeft } from 'lucide-react';
import type { ReactNode, Ref } from 'react';

type PageHeaderProps = {
  title: string;
  titleRef?: Ref<HTMLHeadingElement>;
  back?: { href: string; label: string };
  actions?: ReactNode;
};

export function PageHeader({ title, titleRef, back, actions }: PageHeaderProps) {
  return <div className="page-title">
    <h1 ref={titleRef} tabIndex={-1}>{title}</h1>
    {(back || actions) && <div className="page-title-actions">
      {back && <a className="page-back" href={back.href}><ArrowLeft size={16} aria-hidden="true" />{back.label}</a>}
      {actions}
    </div>}
  </div>;
}
