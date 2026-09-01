'use client';

import { useEffect, useRef, useState } from 'react';
import { apiGet, apiUpload, apiDelete } from '@/lib/api';

interface Profile {
  cv_filename: string | null;
  cv_uploaded_at: string | null;
  cv_summary: string | null;
}

export function CvUpload() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiGet<Profile>('/me/profile').then(setProfile).catch(() => setProfile(null));
  }, []);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      await apiUpload('/me/cv', file);
      const fresh = await apiGet<Profile>('/me/profile');
      setProfile(fresh);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await apiDelete('/me/cv');
      const fresh = await apiGet<Profile>('/me/profile');
      setProfile(fresh);
      setShowSummary(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const has = profile?.cv_filename != null;

  return (
    <div>
      <p className="meta mb-2">Your CV</p>
      <p className="mb-3 text-sm" style={{ color: 'var(--color-ink-soft)' }}>
        {has
          ? 'GeegLot draws on this when writing your applications, so drafts reference your real experience instead of leaving blanks.'
          : 'Without a CV, drafts will contain [ADD: ...] gaps for you to fill in by hand. Upload one and GeegLot writes from your actual history. PDF, up to 5MB.'}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />

      {has ? (
        <div>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span>{profile?.cv_filename}</span>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="meta underline underline-offset-4"
            >
              {showSummary ? 'Hide what GeegLot read' : 'See what GeegLot read'}
            </button>
            <button
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="meta underline underline-offset-4 disabled:opacity-40"
            >
              Replace
            </button>
            <button
              onClick={remove}
              disabled={busy}
              className="meta underline underline-offset-4 disabled:opacity-40"
            >
              Remove
            </button>
          </div>

          {showSummary && profile?.cv_summary && (
            <div
              className="mt-4 border-l-2 pl-4"
              style={{ borderColor: 'var(--color-rule)' }}
            >
              <p className="assessment text-sm whitespace-pre-wrap">
                {profile.cv_summary}
              </p>
              <p className="mt-3 text-sm" style={{ color: 'var(--color-ink-soft)' }}>
                If anything here is wrong, upload a corrected CV — GeegLot writes
                from this summary, not the original file.
              </p>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="px-4 py-2.5 text-sm disabled:opacity-40"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'var(--color-ink)',
            color: 'var(--color-paper)',
          }}
        >
          {busy ? 'Reading your CV' : 'Upload a PDF'}
        </button>
      )}

      {busy && has && <p className="meta mt-3">Working</p>}
      {error && (
        <p className="mt-3 text-sm" style={{ color: 'var(--color-signal)' }}>
          {error}
        </p>
      )}
    </div>
  );
}