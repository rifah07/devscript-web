import { langOf } from '@/lib/lang';
import { splitStanzas } from '@/lib/poem';

// white-space: pre-wrap (in .stanza) keeps each line exactly as the poet
// typed it. No markdown, no reflowing: the easiest way to ruin a poem.
export function PoemBody({ body }: { body: string }) {
  return (
    <div className="poem" lang={langOf(body)}>
      {splitStanzas(body).map((stanza, i) => (
        <p key={i} className="stanza">
          {stanza}
        </p>
      ))}
    </div>
  );
}
