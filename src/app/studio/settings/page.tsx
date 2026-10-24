'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Avatar as AvatarImage } from '@/components/Avatar';
import { RequireLogin } from '@/components/RequireLogin';
import { ResendButton } from '@/components/VerifyBanner';
import { shrinkImage } from '@/lib/image';
import { clientGql, clientRest, useSession } from '@/lib/session';
import { isMisk } from '@/site/config';

export default function SettingsPage() {
  return (
    <RequireLogin>
      <div className="stack">
        <p className="kicker">studio · settings</p>
        <h1>Your account</h1>
        <Email />
        <Profile />
        <Avatar />
        <Data />
        <Danger />
      </div>
    </RequireLogin>
  );
}

function Email() {
  const { user } = useSession();
  return (
    <div className="card row">
      <span className="muted">Email</span>
      <strong>{user!.email}</strong>
      {user!.emailVerified ? (
        <span className="chip live">confirmed</span>
      ) : (
        <>
          <span className="chip pending">not confirmed</span>
          <span className="meta">
            <ResendButton />
          </span>
        </>
      )}
    </div>
  );
}

const PROFILE_FIELDS = ['name', 'bio', 'website', 'github', 'leetcode', 'twitter'] as const;

function Profile() {
  const { user, reload } = useSession();
  const [status, setStatus] = useState('');

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await clientGql(`mutation($i: UpdateProfileInput!){ updateProfile(input:$i){ _id } }`, {
        i: Object.fromEntries(PROFILE_FIELDS.map((f) => [f, String(form.get(f) ?? '')])),
      });
      await reload();
      setStatus('Saved.');
    } catch (err) {
      setStatus((err as Error).message);
    }
  }

  return (
    <form className="card form" onSubmit={save}>
      <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Profile</h2>
      {PROFILE_FIELDS.map((f) =>
        f === 'bio' ? (
          <label key={f}>
            Bio
            <textarea name="bio" rows={3} maxLength={300} defaultValue={user!.bio ?? ''} />
          </label>
        ) : (
          <label key={f}>
            {f === 'name' ? (isMisk ? 'Name or pen name' : 'Name') : f[0].toUpperCase() + f.slice(1)}
            <input name={f} defaultValue={user![f] ?? ''} required={f === 'name'} />
          </label>
        ),
      )}
      <div className="row">
        <button type="submit">Save profile</button>
        <span className="meta" role="status">
          {status}
        </span>
      </div>
    </form>
  );
}

function Avatar() {
  const { user, reload } = useSession();
  const [status, setStatus] = useState('');

  async function upload(file: File) {
    setStatus('Uploading…');
    try {
      const form = new FormData();
      form.append('file', await shrinkImage(file), 'avatar.jpg');
      await clientRest('/users/me/avatar', { method: 'POST', body: form });
      await reload();
      setStatus('Updated.');
    } catch (err) {
      setStatus((err as Error).message);
    }
  }

  return (
    <div className="card stack">
      <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Photo</h2>
      {user!.avatarUrl && <AvatarImage key={user!.avatarUrl} src={user!.avatarUrl} name={user!.name} size={80} own />}
      {isMisk && <p className="meta">If you write under a pen name, don’t reuse a photo from your other accounts.</p>}
      <label className="btn quiet small" style={{ width: 'fit-content', cursor: 'pointer' }}>
        Choose a photo
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0])} />
      </label>
      <span className="meta" role="status">
        {status}
      </span>
    </div>
  );
}

function Data() {
  async function exportData() {
    const d = await clientGql<{ exportMyData: unknown }>(`{ exportMyData }`);
    const url = URL.createObjectURL(new Blob([JSON.stringify(d.exportMyData, null, 2)], { type: 'application/json' }));
    Object.assign(document.createElement('a'), { href: url, download: 'my-writing.json' }).click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card stack">
      <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Your data</h2>
      <p className="muted">Download everything you’ve written and your profile as one JSON file.</p>
      <div className="row">
        <button type="button" className="btn quiet small" onClick={() => void exportData()}>
          Export my data
        </button>
        <button
          type="button"
          className="btn quiet small"
          onClick={() => void clientGql(`mutation { logoutAllDevices }`).then(() => alert('Signed out on every other device.'))}
        >
          Sign out everywhere else
        </button>
      </div>
    </div>
  );
}

function Danger() {
  const { signOut } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');

  async function remove(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirm('Delete your account? Your posts will be unpublished and comments anonymised.')) return;
    try {
      await clientGql(`mutation($i: DeleteAccountInput!){ deleteMyAccount(input:$i) }`, {
        i: { password: new FormData(e.currentTarget).get('password') },
      });
      await signOut();
      router.replace('/');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form className="card form" onSubmit={remove}>
      <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Delete account</h2>
      <p className="muted">
        Your posts are unpublished (not deleted, so nobody’s links break), your comments are anonymised, and everything
        else about you is removed.
      </p>
      <label>
        Confirm with your password
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <p className="error" aria-live="polite">
        {error}
      </p>
      <div>
        <button type="submit" className="btn danger">
          Delete my account
        </button>
      </div>
    </form>
  );
}
