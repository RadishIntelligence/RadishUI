import { useEffect, useRef, useState } from 'react';
import type { Translate } from './model';

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

export function CopyButton({ text, label, t }: { text: string; label: string; t: Translate }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => { if (timer.current !== undefined) window.clearTimeout(timer.current); }, []);

  async function onCopy() {
    try {
      await copyText(text);
      setCopied(true);
      if (timer.current !== undefined) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return <button type="button" className="doc-copy" onClick={onCopy} aria-label={copied ? t('已复制', 'Copied') : label}>
    {copied ? t('已复制', 'Copied') : t('复制', 'Copy')}
    <span className="sr-only" aria-live="polite">{copied ? t('代码已复制到剪贴板', 'Code copied to the clipboard') : ''}</span>
  </button>;
}
