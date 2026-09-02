'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignIn() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [notice, setNotice] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    setNotice(null);

    if (mode === 'up') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setBusy(false);

      if (error) return setError(error.message);

      if (!data.session) {
        setNotice(`Check ${email} for a link to confirm your account.`);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setError(error.message);
    }

    router.push('/app');
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <p className="meta mb-3">GeegLot</p>
      <h1
        className="numeral mb-10 text-4xl"
        style={{ fontWeight: 500, letterSpacing: '-0.03em' }}
      >
        {mode === 'in' ? 'Welcome back' : 'Set up your account'}
      </h1>

      <div className="space-y-5">
        <div>
          <label className="meta mb-2 block" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b bg-transparent py-2 text-lg outline-none focus:border-current"
            style={{ borderColor: 'var(--color-rule)' }}
          />
        </div>

        <div>
          <label className="meta mb-2 block" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="w-full border-b bg-transparent py-2 text-lg outline-none focus:border-current"
            style={{ borderColor: 'var(--color-rule)' }}
          />
        </div>

        {notice && <p className="text-sm">{notice}</p>}

        {error && (
          <p className="text-sm" style={{ color: 'var(--color-signal)' }}>
            {error}
          </p>
        )}

        <button
          onClick={submit}
          disabled={busy || !email || !password}
          className="w-full px-4 py-3 text-sm disabled:opacity-40"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'var(--color-ink)',
            color: 'var(--color-paper)',
          }}
        >
          {busy ? 'One moment' : mode === 'in' ? 'Sign in' : 'Create account'}
        </button>

        <button
          onClick={() => {
            setMode(mode === 'in' ? 'up' : 'in');
            setError(null);
          }}
          className="text-sm underline underline-offset-4"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-ink-soft)',
          }}
        >
          {mode === 'in'
            ? 'No account yet? Create one'
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </main>
  );
}