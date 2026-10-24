import { PoemBody } from './PoemBody';
import { Prose } from './Prose';

export function PostBody({ body, format }: { body: string; format: 'MARKDOWN' | 'PLAINTEXT' }) {
  return format === 'PLAINTEXT' ? <PoemBody body={body} /> : <Prose body={body} />;
}
