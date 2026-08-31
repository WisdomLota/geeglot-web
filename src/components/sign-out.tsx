'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function SignOut() {
  const router = useRouter();

  async function out() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/sign-in');
    router.refresh();
  }

  return (
    <button
      onClick={out}
      className="meta underline underline-offset-4"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      Sign out
    </button>
  );
}