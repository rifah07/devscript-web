import type { Metadata } from 'next';
import { WriteCta } from '@/components/WriteCta';
import { isMisk, site } from '@/site/config';

export const metadata: Metadata = {
  title: 'Write with us',
  description: `How to write and publish on ${site.name}: free, simple, and yours.`,
};

// A plain-language manual for new writers. Static: no API calls.
export default function WritePage() {
  return (
    <article className="manual">
      <p className="kicker">a guide for writers</p>
      <h1>Write with us</h1>
      <p className="muted" style={{ fontSize: '1.1rem' }}>
        {isMisk
          ? 'The Misk Journal is a quiet place for poems, reflections and short notes, in Bangla or English. Reading is free, writing is free, and there are no ads, no trackers and no follower counts on the front page.'
          : 'DevScript is open to every developer who wants to explain something well: a bug you fixed, a concept you finally understood, a project you shipped. Free, no ads, no paywall.'}
      </p>
      <WriteCta className="btn" label="Create a free account" style={{ marginTop: '1rem' }} />

      <section>
        <h2>From idea to published, in five steps</h2>
        <ol className="steps">
          <li>
            <div>
              <strong>Create an account.</strong> An email and a password, or continue with Google. Each site has its own
              accounts, so your {isMisk ? 'poems never appear next to your work profile' : 'technical writing stays separate from anything personal'}.
            </div>
          </li>
          <li>
            <div>
              <strong>Open the Studio.</strong> After logging in, choose <em>Studio</em> in the top bar, then <em>New piece</em>.
            </div>
          </li>
          <li>
            <div>
              <strong>Write.</strong> Your draft saves itself every few seconds. Nobody can see a draft except you.
            </div>
          </li>
          <li>
            <div>
              <strong>Add the details.</strong> A few tags, a category if one fits, and images with a short description of each
              (for readers who use screen readers).
            </div>
          </li>
          <li>
            <div>
              <strong>Publish, or schedule.</strong> Publish now, or pick a date and time and it goes live on its own. Followers
              and newsletter readers hear about it once.
            </div>
          </li>
        </ol>
      </section>

      {isMisk ? (
        <section>
          <h2>Writing poems here</h2>
          <p>
            Poems are kept <strong>exactly as you type them</strong>. Every line break stays where you put it; nothing is
            reflowed or justified. Leave one empty line between stanzas. Spaces at the start of a line are kept too, so you
            can indent.
          </p>
          <p>
            Bangla and English both work, and you can mix them. Bangla is shown in a font made for it, with the extra line
            height it needs.
          </p>
          <p>
            Choose <em>Poem</em>, <em>Reflection</em> or <em>Note</em> when you write. Reflections and notes are kept as plain
            text too.
          </p>
          <p>
            <strong>Writing under a pen name?</strong> Make a separate account with the name you want, and use a different
            photo (or none). Using the same photo on two accounts can link them.
          </p>
        </section>
      ) : (
        <section>
          <h2>Formatting (Markdown)</h2>
          <p>Articles use Markdown, the same format as GitHub READMEs. The Studio shows a live preview.</p>
          <div className="cheat">
            <code># Heading</code>
            <span>Section title (use ## and ### for smaller)</span>
            <code>**bold**, *italic*</code>
            <span>Emphasis</span>
            <code>`code`</code>
            <span>Inline code</span>
            <code>```ts … ```</code>
            <span>A code block (put the language after the backticks)</span>
            <code>[text](https://…)</code>
            <span>A link</span>
            <code>![description](…)</code>
            <span>An image. Upload it under Images and press Copy Markdown; pictures from other sites won’t load</span>
            <code>- item</code>
            <span>A bullet list</span>
            <code>| a | b |</code>
            <span>A table</span>
            <code>&gt; quote</code>
            <span>A quotation</span>
          </div>
          <p className="muted">Raw HTML is ignored, for everyone’s safety.</p>
        </section>
      )}

      <section>
        <h2>AI helpers (you stay the author)</h2>
        <p>
          In the Studio you can ask for {isMisk ? 'title ideas, tag ideas and gentle feedback on imagery and rhythm' : 'title ideas, tag ideas, a short summary and editor-style feedback on clarity'}
          {isMisk ? ', and a calm spoken narration of your piece' : ''}. They are <strong>suggestions only</strong>: nothing is
          changed until you choose it, and the AI never rewrites your words. Each account gets a daily allowance.
        </p>
      </section>

      <section>
        <h2>House rules</h2>
        <p>
          Write your own work, credit what you quote, and be kind in the comments. Spam, harassment and copied work are
          removed. Anyone can report a post or comment; a person reviews every report.
        </p>
      </section>

      <section>
        <h2>Your words stay yours</h2>
        <p>
          You can export everything you’ve written as a file, or delete your account, from <em>Studio → Settings</em>. If you
          delete it, your posts are unpublished and your comments anonymised.
        </p>
        <WriteCta className="btn quiet" label="Start writing" />
      </section>
    </article>
  );
}
