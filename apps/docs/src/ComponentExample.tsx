import type { ReactNode } from 'react';
import { Section } from '@radish-ui/react';

export interface ComponentExampleProps {
  name: string;
  contract: string;
  keyboard: string;
  code: string;
  children: ReactNode;
}

/**
 * One component reference entry: bounded preview, API notes, then the code sample.
 * The preview is a surface so tall demos stay visually separate from the API text.
 */
export function ComponentExample({ name, contract, keyboard, code, children }: ComponentExampleProps) {
  return <Section className="component-example" size="sm" title={name}>
    <div className="component-demo">{children}</div>
    <dl className="component-contract"><div><dt>Props / Events</dt><dd>{contract}</dd></div><div><dt>键盘 / 状态</dt><dd>{keyboard}</dd></div></dl>
    <details className="component-code"><summary>用法代码</summary><pre><code>{code}</code></pre></details>
  </Section>;
}
