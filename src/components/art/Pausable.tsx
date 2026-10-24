'use client';

import { useEffect, useRef } from 'react';

// Pauses every CSS animation inside while it's off-screen, so decorative
// motion never costs CPU or battery when nobody can see it.
export function Pausable({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      el.dataset.paused = String(!entry.isIntersecting);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  );
}
