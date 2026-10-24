'use client';

import { useState } from 'react';
import { clientGql } from '@/lib/session';

// "Ask this article": Gemini answers only from this post's text. Rate
// limited and cached on the server; when AI is unavailable the box says so
// calmly instead of failing.
export function AskArticle({ postId }: { postId: string }) {
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);

  async function ask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const question = String(new FormData(e.currentTarget).get('q') ?? '').trim();
    if (question.length < 3) return;
    setBusy(true);
    try {
      const d = await clientGql<{ askPost: string }>(`query($p: ID!, $q: String!){ askPost(postId:$p, question:$q) }`, {
        p: postId,
        q: question,
      });
      setAnswer(d.askPost || 'The assistant is resting right now. Try again later.');
    } catch (err) {
      setAnswer((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="ask" aria-labelledby="ask-title">
      <h2 id="ask-title" className="kicker" style={{ margin: 0 }}>
        ask this article
      </h2>
      <p className="meta" style={{ margin: '0.3rem 0 0' }}>
        Answers come only from the text above, written by AI. Check anything important.
      </p>
      <form onSubmit={ask}>
        <label className="sr-only" htmlFor="ask-q">
          Your question
        </label>
        <input id="ask-q" name="q" minLength={3} maxLength={300} placeholder="e.g. Why does the refresh need to be single-flight?" required />
        <button type="submit" className="btn small" disabled={busy}>
          {busy ? 'Thinking…' : 'Ask'}
        </button>
      </form>
      <p className="answer" aria-live="polite">
        {answer}
      </p>
    </section>
  );
}
