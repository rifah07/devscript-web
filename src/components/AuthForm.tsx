'use client';

import { useState } from 'react';

type Field = {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  minLength?: number;
};

// One form for login, register, forgot and reset password. Each page only
// supplies its fields and what to do on submit. Errors from the server are
// shown as-is (they're written for users); `aria-live` announces them.
export function AuthForm({
  title,
  fields,
  submitLabel,
  onSubmit,
  footer,
}: {
  title: React.ReactNode;
  fields: Field[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<string | void>;
  footer?: React.ReactNode;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const values = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
      const message = await onSubmit(values);
      if (message) setNotice(message);
    } catch (err) {
      const code = (err as { code?: number }).code;
      setError(code === 429 ? 'Slow down a little and try again in a minute.' : (err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth">
      <h1>{title}</h1>
      {notice ? (
        <p role="status">{notice}</p>
      ) : (
        <form onSubmit={handle} noValidate={false}>
          {fields.map((f) => (
            <label key={f.name}>
              {f.label}
              <input
                name={f.name}
                type={f.type ?? 'text'}
                autoComplete={f.autoComplete}
                minLength={f.minLength}
                required
                aria-describedby={error ? 'form-error' : undefined}
              />
            </label>
          ))}
          <p id="form-error" className="error" aria-live="polite">
            {error}
          </p>
          <button type="submit" disabled={busy}>
            {busy ? 'Working…' : submitLabel}
          </button>
        </form>
      )}
      {footer}
    </section>
  );
}
