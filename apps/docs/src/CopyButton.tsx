import { useEffect, useRef, useState } from 'react';

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

export function CopyButton({ text, label }: { text: string; label: string }) {
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

  return <button type="button" className="doc-copy" onClick={onCopy} aria-label={copied ? '已复制' : label}>
    {copied ? '已复制' : '复制'}
    <span className="sr-only" aria-live="polite">{copied ? '代码已复制到剪贴板' : ''}</span>
  </button>;
}
