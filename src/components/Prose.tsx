import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

// Markdown → React elements, on the server. Raw HTML in the markdown is
// ignored (react-markdown's default) and rehype-sanitize strips anything
// dangerous (javascript: links, on* attributes): an author can't inject a
// script into a reader's browser. No dangerouslySetInnerHTML anywhere.
export function Prose({ body }: { body: string }) {
  return (
    <div className="prose">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ href, children }) =>
            href?.startsWith('http') ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ) : (
              <a href={href}>{children}</a>
            ),
          table: ({ children }) => (
            <div className="table-scroll">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {body}
      </Markdown>
    </div>
  );
}
