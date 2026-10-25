'use client';

import type { KeyboardEvent, ReactNode, RefObject } from 'react';
import { formatEdit, type Format } from '@/lib/markdown-format';

const svg = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {path}
  </svg>
);

const TOOLS: { format: Format; label: string; keys?: string; icon: ReactNode }[] = [
  { format: 'codeBlock', label: 'Code block', keys: 'Ctrl+Alt+C', icon: svg(<><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9.5 9.5 7 12l2.5 2.5M14.5 9.5 17 12l-2.5 2.5" /></>) },
  { format: 'code', label: 'Inline code', keys: 'Ctrl+E', icon: svg(<path d="m8 7-5 5 5 5M16 7l5 5-5 5" />) },
  { format: 'bold', label: 'Bold', keys: 'Ctrl+B', icon: svg(<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />) },
  { format: 'italic', label: 'Italic', keys: 'Ctrl+I', icon: svg(<path d="M14 5h-4M14 19h-4M14 5l-4 14" />) },
  { format: 'heading', label: 'Heading', icon: svg(<path d="M6 5v14M18 5v14M6 12h12" />) },
  { format: 'link', label: 'Link', keys: 'Ctrl+K', icon: svg(<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />) },
  { format: 'quote', label: 'Quote', icon: svg(<path d="M6 7h4v4c0 3-2 5-4 6M14 7h4v4c0 3-2 5-4 6" />) },
  { format: 'list', label: 'Bulleted list', icon: svg(<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />) },
];

export function applyFormat(el: HTMLTextAreaElement, format: Format) {
  const edit = formatEdit(el.value, el.selectionStart, el.selectionEnd, format);
  el.focus();
  el.setSelectionRange(edit.from, edit.to);
  // insertText keeps the browser's own undo (Ctrl+Z); setRangeText is the fallback
  if (!document.execCommand('insertText', false, edit.insert)) {
    el.setRangeText(edit.insert, edit.from, edit.to);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  el.setSelectionRange(...edit.select);
}

const SHORTCUTS: Record<string, Format> = { b: 'bold', i: 'italic', k: 'link', e: 'code' };

export function onFormatShortcut(e: KeyboardEvent<HTMLTextAreaElement>) {
  if (!(e.ctrlKey || e.metaKey) || e.shiftKey) return;
  const key = e.key.toLowerCase();
  const format = e.altKey ? (key === 'c' ? 'codeBlock' : undefined) : SHORTCUTS[key];
  if (!format) return;
  e.preventDefault();
  applyFormat(e.currentTarget, format);
}

export function MarkdownToolbar({ target }: { target: RefObject<HTMLTextAreaElement | null> }) {
  return (
    <div className="md-toolbar" role="toolbar" aria-label="Formatting">
      {TOOLS.map((tool) => (
        <button
          key={tool.format}
          type="button"
          className="icon-button"
          aria-label={tool.keys ? `${tool.label} (${tool.keys})` : tool.label}
          // keep the selection in the textarea while clicking
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => target.current && applyFormat(target.current, tool.format)}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}
