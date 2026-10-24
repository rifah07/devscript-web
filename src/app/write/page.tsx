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

      <nav aria-label="On this page" style={{ marginTop: '2rem' }}>
        <p className="kicker">on this page</p>
        <ol>
          <li><a href="#steps">From idea to published</a></li>
          <li><a href="#writing">{isMisk ? 'Writing poems here' : 'Formatting (Markdown)'}</a></li>
          <li><a href="#images">Adding images</a></li>
          <li><a href="#organise">Type, tags, category and series</a></li>
          <li><a href="#publish">Publishing, scheduling and editing</a></li>
          <li><a href="#ai">AI helpers</a></li>
          <li><a href="#reading">Reading, saving and following</a></li>
          <li><a href="#rules">House rules and your data</a></li>
        </ol>
      </nav>

      <section id="steps">
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
              <strong>Open the Studio.</strong> After logging in, choose <em>Studio</em> in the top bar, then{' '}
              <em>New {site.postTypes[0].label.toLowerCase()}</em>.
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
        <section id="writing">
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
        <section id="writing">
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

      <section id="images">
        <h2>Adding images</h2>
        <ol className="steps">
          <li>
            <div>
              <strong>Save the draft first.</strong> Images can be added once the piece has a title and a few lines of text,
              because they belong to a saved draft. The <em>Images</em> panel then appears in the editor.
            </div>
          </li>
          <li>
            <div>
              <strong>Choose Add images.</strong> Up to 10 per piece, in JPEG, PNG or WebP. Large photos are shrunk in your
              browser before uploading, so phone pictures are fine.
            </div>
          </li>
          <li>
            <div>
              <strong>Describe each one.</strong> Type what the picture shows in <em>Describe this image</em>. That is what
              someone using a screen reader hears, and it shows if the picture can’t load.
            </div>
          </li>
          <li>
            <div>
              <strong>Arrange them.</strong> Use ↑ and ↓ to change the order, <em>Make cover</em> to choose the picture shown{' '}
              {isMisk ? 'when the piece is shared' : 'at the top of the article and when it is shared'}, and <em>Remove</em> to delete one.
            </div>
          </li>
          {!isMisk && (
            <li>
              <div>
                <strong>Put one inside the article.</strong> Press <em>Copy Markdown</em> next to the image, then paste it into
                your text where it should appear. Pictures from other websites won’t load; upload them here instead.
              </div>
            </li>
          )}
        </ol>
        <p>
          {isMisk
            ? 'Your images appear after the poem as a small photo essay, one after another with their descriptions. Readers can tap one to see it large and move through them.'
            : 'All images also appear at the end of the article as a photo essay. Readers can click one to see it large, move with the arrow keys and download it.'}
        </p>
        {isMisk && (
          <p className="muted">
            Writing under a pen name? Avoid photos you have posted elsewhere; they can link your accounts.
          </p>
        )}
      </section>

      <section id="organise">
        <h2>Type, tags, category and series</h2>
        <p>These sit in the <em>Details</em> panel beside the editor.</p>
        <div className="cheat">
          <code>Type</code>
          <span>{site.postTypes.map((t) => t.label).join(', ')}. It decides where the piece is listed.</span>
          <code>Tags</code>
          <span>Up to 10, separated by commas. Readers find pieces by tag.</span>
          <code>Category</code>
          <span>Optional. The list is kept by the site’s editors.</span>
          <code>Series</code>
          <span>Link pieces that belong together. Choose + New series… to start one; it appears after the first save.</span>
        </div>
      </section>

      <section id="publish">
        <h2>Publishing, scheduling and editing</h2>
        <div className="cheat">
          <code>Publish now</code>
          <span>Goes live straight away. Followers and newsletter readers hear about it once.</span>
          <code>Schedule</code>
          <span>Pick a date and time; it goes live on its own. Cancel schedule turns it back into a draft.</span>
          <code>View live ↗</code>
          <span>Opens the published piece.</span>
          <code>Editing later</code>
          <span>Open it from the Studio and change anything; edits save on their own, as with a draft.</span>
          <code>Delete this piece</code>
          <span>At the bottom of the editor. This cannot be undone.</span>
        </div>
        <p className="muted">
          The Studio lists everything you have written with its status: draft, scheduled or published. <em>Preview</em> in the
          editor shows the piece as readers will see it.
        </p>
      </section>

      <section id="ai">
        <h2>AI helpers (you stay the author)</h2>
        <p>
          In the Studio you can ask for {isMisk ? 'title ideas, tag ideas and gentle feedback on imagery and rhythm' : 'title ideas, tag ideas, a short summary and editor-style feedback on clarity'}
          {isMisk ? ', and a calm spoken narration of your piece' : ''}. They are <strong>suggestions only</strong>: nothing is
          changed until you choose it, and the AI never rewrites your words. Each account gets a daily allowance.
        </p>
      </section>

      <section id="reading">
        <h2>Reading, saving and following</h2>
        <div className="cheat">
          <code>Reactions</code>
          <span>Under each piece. Tap one to tell the writer it {isMisk ? 'stayed with you' : 'helped'}; tap again to take it back.</span>
          <code>Comments</code>
          <span>Log in and confirm your email to join the conversation.</span>
          <code>Save</code>
          <span>Keeps a piece for later. Find them under Studio → Saved.</span>
          <code>Follow</code>
          <span>On a writer’s page. You get a note in your Inbox when they publish.</span>
          {!isMisk && (
            <>
              <code>Ask this article</code>
              <span>Ask a question about the article you are reading; the answer comes only from its text.</span>
            </>
          )}
          <code>Newsletter, RSS</code>
          <span>At the bottom of every page, to get new pieces without visiting.</span>
          <code>Report</code>
          <span>Flags a piece or comment for a person to review.</span>
        </div>
      </section>

      <section id="rules">
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
