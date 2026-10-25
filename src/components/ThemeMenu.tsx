'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent } from 'react';
import { site } from '@/site/config';

// <html data-theme> is the single source of truth; React just watches it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}
const readTheme = () => document.documentElement.dataset.theme;

// The theme is set before first paint by the inline script in layout.tsx;
// this menu only changes it and remembers the choice (a UI preference, not
// a secret, so localStorage is fine here).
export function ThemeMenu() {
  const current = useSyncExternalStore(subscribe, readTheme, () => undefined);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // Close on a click outside or Escape; focus the chosen theme when opening
  useEffect(() => {
    if (!open) return;
    const menu = root.current;
    (menu?.querySelector<HTMLElement>('[aria-checked="true"]') ?? menu?.querySelector<HTMLElement>('[role="menuitemradio"]'))?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  function choose(id: string, e: MouseEvent) {
    const html = document.documentElement;
    // Keyboard "clicks" have no position: spread from the menu button instead
    const from = e.clientX || e.clientY ? e : root.current!.getBoundingClientRect();
    html.style.setProperty('--reveal-x', `${'clientX' in from ? from.clientX : from.x + from.width / 2}px`);
    html.style.setProperty('--reveal-y', `${'clientY' in from ? from.clientY : from.y + from.height / 2}px`);

    const apply = () => html.setAttribute('data-theme', id);
    // View Transitions paint the new theme growing out of the click; other browsers just switch
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(apply);
    } else apply();

    try {
      localStorage.setItem('theme', id);
    } catch {}
    setOpen(false);
  }

  function onMenuKey(e: KeyboardEvent<HTMLDivElement>) {
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitemradio"]')];
    const at = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'Escape') {
      setOpen(false);
      root.current?.querySelector<HTMLElement>('.theme-button')?.focus();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      items[(at + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
    }
  }

  const theme = site.themes.find((t) => t.id === current);
  return (
    <div className="theme-menu" ref={root}>
      <button
        type="button"
        className="icon-button theme-button"
        aria-label={theme ? `Theme: ${theme.label}` : 'Theme'}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="swatch" style={{ background: theme?.swatch }} />
      </button>
      {open && (
        <div className="theme-popover" role="menu" aria-label="Choose a theme" onKeyDown={onMenuKey}>
          {site.themes.map((t) => (
            <button
              key={t.id}
              type="button"
              role="menuitemradio"
              aria-checked={t.id === current}
              onClick={(e) => choose(t.id, e)}
            >
              <span className="swatch" style={{ background: t.swatch }} />
              <span>
                <strong>{t.label}</strong>
                <small>{t.hint}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
