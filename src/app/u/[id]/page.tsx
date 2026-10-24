import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Avatar } from '@/components/Avatar';
import { Listing } from '@/components/listing/Listing';
import { FollowButton } from '@/components/post/FollowButton';
import { getUser } from '@/lib/queries';

export async function generateMetadata({ params }: PageProps<'/u/[id]'>): Promise<Metadata> {
  const user = await getUser((await params).id);
  return user ? { title: user.name, description: user.bio ?? undefined } : {};
}

export default function ProfilePage(props: PageProps<'/u/[id]'>) {
  return (
    <Suspense>
      <Profile {...props} />
    </Suspense>
  );
}

const LINKS = [
  ['website', 'Website'],
  ['github', 'GitHub'],
  ['leetcode', 'LeetCode'],
  ['twitter', 'X'],
] as const;

async function Profile({ params, searchParams }: PageProps<'/u/[id]'>) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();
  return (
    <>
      <header className="stack">
        {user.avatarUrl && <Avatar src={user.avatarUrl} name={user.name} size={72} />}
        <h1 style={{ margin: 0 }}>{user.name}</h1>
        {user.bio && <p className="muted">{user.bio}</p>}
        <p className="row meta">
          {LINKS.filter(([k]) => user[k]).map(([k, label]) => (
            <a key={k} href={safeUrl(user[k]!)} rel="noopener noreferrer me" target="_blank">
              {label}
            </a>
          ))}
        </p>
        <FollowButton userId={user._id} />
      </header>
      <Listing filter={{ authorId: user._id }} base={`/u/${user._id}`} searchParams={searchParams} empty="No published writing yet." />
    </>
  );
}

// Profile links are user input: only http(s) URLs become links, so nobody
// can plant a javascript: link on their profile.
function safeUrl(value: string): string {
  const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(url).protocol.startsWith('http') ? url : '#';
  } catch {
    return '#';
  }
}
