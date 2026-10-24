'use client';

import { useRef, useState } from 'react';
import { clientGql } from '@/lib/session';
import { useLoginGate } from '@/lib/use-login-gate';

const REASONS = ['SPAM', 'INAPPROPRIATE', 'MISINFORMATION', 'HARASSMENT', 'COPYRIGHT', 'OTHER'];

// Native <dialog>: the browser handles the focus trap, Escape to close and
// returning focus afterwards, so there's no modal library.
export function ReportButton({
  targetId,
  targetType,
  compact,
}: {
  targetId: string;
  targetType: 'POST' | 'COMMENT' | 'USER';
  compact?: boolean; // plain text link, for tight rows like comments
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const ensureLogin = useLoginGate();
  const [status, setStatus] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await clientGql(`mutation($i: CreateReportInput!){ reportContent(input:$i){ _id } }`, {
        i: { targetId, targetType, reason: form.get('reason'), description: form.get('description') || undefined },
      });
      setStatus('Thank you. A moderator will look at it.');
    } catch (err) {
      setStatus((err as { code?: number }).code === 409 ? 'You already reported this. Thank you.' : (err as Error).message);
    }
  }

  return (
    <>
      <button type="button" className={compact ? 'link-button' : 'toggle'} onClick={() => ensureLogin() && dialog.current?.showModal()}>
        Report
      </button>
      <dialog ref={dialog} aria-labelledby={`report-${targetId}`}>
        <h2 id={`report-${targetId}`} style={{ fontSize: '1.2rem', marginTop: 0 }}>
          Report this {targetType.toLowerCase()}
        </h2>
        {status ? (
          <p role="status">{status}</p>
        ) : (
          <form className="form" onSubmit={submit}>
            <label>
              Reason
              <select name="reason" required defaultValue="SPAM">
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Anything else? (optional)
              <textarea name="description" maxLength={500} rows={3} />
            </label>
            <button type="submit">Send report</button>
          </form>
        )}
        <form method="dialog">
          <button className="btn quiet small" style={{ marginTop: '1rem' }}>
            Close
          </button>
        </form>
      </dialog>
    </>
  );
}
