'use client';

// The theme is set before first paint by the inline script in layout.tsx;
// this button only flips it and remembers the choice (a UI preference, not
// a secret, so localStorage is fine here).
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {}
  };
  return (
    <button type="button" className="link-button" onClick={toggle} aria-label="Toggle colour theme">
      Theme
    </button>
  );
}
