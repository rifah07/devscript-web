import type { Metadata } from 'next';
import Link from 'next/link';
import { isMisk } from '@/site/config';

export const metadata: Metadata = { title: 'About' };

// Static page. Edit the text freely; it's your voice.
export default function AboutPage() {
  return isMisk ? (
    <div className="stack" style={{ textAlign: 'center' }}>
      <p className="kicker">about</p>
      <h1>A lamp left on</h1>
      <p>
        The Misk Journal is a small, quiet place for poems, Islamic reflections and short notes. It replaced an old blog
        and a habit of posting pictures of poems; here the words come first.
      </p>
      <p className="muted">
        Reading is always free. There are no ads, no trackers and no popularity games. If something here stays with you,
        you can say so, quietly.
      </p>
      <p>
        <Link href="/write">Write with us</Link> · <Link href="/subscribe">Get new pieces by email</Link>
      </p>
    </div>
  ) : (
    <div className="stack">
      <p className="kicker">about</p>
      <h1>Hi, I’m Rifah.</h1>
      <p>
        I’m a full-stack engineer with a backend focus. I work at Periscale AI on a commerce platform used by online
        sellers, building Django REST APIs, React/TypeScript screens and parts of the LangGraph AI agent. I studied
        Computer Science at Jagannath University, Dhaka.
      </p>
      <p>
        I built DevScript end to end: a NestJS, GraphQL and MongoDB API serving two sites, with rotating refresh tokens,
        draft privacy, per-user AI quotas, and Gemini features like semantic related posts and “ask this article”. This
        site is where I write about what building it taught me, and it’s open for other developers to write too.
      </p>
      <p>
        <Link href="/cv">CV</Link> · <Link href="/projects">Projects</Link> · <a href="https://github.com/rifah07">GitHub</a> ·{' '}
        <a href="https://www.linkedin.com/in/rifah-sajida-deya-1011/">LinkedIn</a>
      </p>
    </div>
  );
}
