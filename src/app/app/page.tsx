'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet, apiPost, type Assessment } from '@/lib/api';
import { SignOut } from '@/components/sign-out';
import { useRouter } from 'next/navigation';

function money(n: number | null, currency: string): string | null {
  if (n === null) return null;
  const symbols: Record<string, string> = {
    GBP: '£',
    USD: '$',
    EUR: '€',
    TRY: '₺',
  };
  const symbol = symbols[currency] ?? currency + ' ';
  return symbol + Math.round(n).toLocaleString();
}

export default function Home() {
  const [items, setItems] = useState<Assessment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [openDraft, setOpenDraft] = useState<string | null>(null);
  const [showHandled, setShowHandled] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    apiGet('/me/preferences')
      .then(() =>
        apiGet<Assessment[]>('/me/assessments')
          .then(setItems)
          .catch((e: Error) => setError(e.message)),
      )
      .catch(() => router.replace('/welcome'));
  }, [router]);

  async function decide(jobId: string, decision: 'approved' | 'rejected') {
    setBusy(jobId);
    try {
      await apiPost('/me/assessments/' + jobId + '/' + decision);
      const fresh = await apiGet<Assessment[]>('/me/assessments');
      setItems(fresh);
      if (decision === 'approved') setOpenDraft(jobId);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16 sm:px-6 sm:py-20">
        <p className="meta mb-3">Something went wrong</p>
        <p className="assessment">{error}</p>
      </main>
    );
  }

  if (!items) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16 sm:px-6 sm:py-20">
        <p className="meta">Loading</p>
      </main>
    );
  }

  const isHandled = (a: Assessment) =>
    a.alert !== null &&
    (a.alert.status === 'approved' || a.alert.status === 'rejected');

  const open = items.filter((a) => !isHandled(a));
  const handled = items.filter(isHandled);

  const heading =
    open.length === 0
      ? 'Nothing waiting on you'
      : open.length === 1
        ? 'One worth your time'
        : open.length + ' worth your time';

  function renderCard(a: Assessment) {
    const job = a.jobs;
    const min = money(job.budget_min, job.currency);
    const max = money(job.budget_max, job.currency);
    const pay = min === max ? min : min + '–' + max;
    const decided = isHandled(a);
    const rejected = a.alert !== null && a.alert.status === 'rejected';
    const approved = a.alert !== null && a.alert.status === 'approved';
    const draft = a.alert ? a.alert.proposal_draft : null;
    const showing = openDraft === job.id;

    return (
      <article
        key={a.id}
        className="border-t py-8 sm:grid sm:grid-cols-[4.5rem_1fr] sm:gap-6 sm:py-10"
        style={{
          borderColor: 'var(--color-rule)',
          opacity: rejected ? 0.5 : 1,
        }}
      >
        <div
          className="numeral mb-3 text-4xl sm:mb-0 sm:text-5xl"
          style={{ color: 'var(--color-signal)' }}
        >
          {a.score}
        </div>

        <div className="min-w-0">
          <h2
            className="numeral mb-1 text-xl sm:text-2xl"
            style={{ fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            {job.title}
          </h2>
          <p className="meta mb-5">
            {job.platform} &middot; {job.client_country ?? 'Location not stated'}
            {approved && ' · Approved'}
            {rejected && ' · Not interested'}
          </p>

          <p className="assessment mb-6">{a.reasoning}</p>

          <dl className="mb-6 space-y-3 text-sm">
            {a.matched_skills.length > 0 && (
              <div className="sm:flex sm:gap-3">
                <dt className="meta mb-1 sm:mb-0 sm:w-24 sm:shrink-0 sm:pt-0.5">
                  Matches
                </dt>
                <dd>{a.matched_skills.join(', ')}</dd>
              </div>
            )}
            {a.concerns.length > 0 && (
              <div className="sm:flex sm:gap-3">
                <dt className="meta mb-1 sm:mb-0 sm:w-24 sm:shrink-0 sm:pt-0.5">
                  Watch for
                </dt>
                <dd>{a.concerns.join('; ')}</dd>
              </div>
            )}
            {pay !== null && (
              <div className="sm:flex sm:gap-3">
                <dt className="meta mb-1 sm:mb-0 sm:w-24 sm:shrink-0 sm:pt-0.5">
                  Pay
                </dt>
                <dd>
                  {pay}
                  {job.salary_is_estimate && (
                    <span style={{ color: 'var(--color-ink-soft)' }}>
                      {' '}
                      &mdash; estimated, not employer-stated
                    </span>
                  )}
                </dd>
              </div>
            )}
          </dl>

          {draft !== null && !showing && (
            <button
              onClick={() => setOpenDraft(job.id)}
              className="mb-6 block text-sm underline underline-offset-4"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-signal)',
              }}
            >
              Read the draft
            </button>
          )}

          {draft !== null && showing && (
            <div
              className="mb-6 border-l-2 pl-4 sm:pl-5"
              style={{ borderColor: 'var(--color-signal)' }}
            >
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <p className="meta">Draft &mdash; review before sending</p>
                <button
                  onClick={() => setOpenDraft(null)}
                  className="meta underline underline-offset-4"
                >
                  Hide
                </button>
              </div>
              <p className="assessment whitespace-pre-wrap">{draft}</p>
              {a.alert && a.alert.submission_instructions && (
                <div>
                  <p className="meta mb-2 mt-5">How to submit</p>
                  <p className="assessment">{a.alert.submission_instructions}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {!decided && (
              <button
                onClick={() => decide(job.id, 'approved')}
                disabled={busy === job.id}
                className="px-4 py-2.5 text-sm disabled:opacity-40"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: 'var(--color-ink)',
                  color: 'var(--color-paper)',
                }}
              >
                {busy === job.id ? 'Drafting' : 'Draft a proposal'}
              </button>
            )}
            {!decided && (
              <button
                onClick={() => decide(job.id, 'rejected')}
                disabled={busy === job.id}
                className="text-sm underline underline-offset-4 disabled:opacity-40"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-ink-soft)',
                }}
              >
                Not interested
              </button>
            )}
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm underline underline-offset-4"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-ink-soft)',
              }}
            >
              View posting
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-16 sm:px-6 sm:py-20">
      <header className="mb-12 sm:mb-16">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <p className="meta">
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
          <span className="flex gap-5">
            <Link
              href="/preferences"
              className="meta underline underline-offset-4"
            >
              Preferences
            </Link>
            <SignOut />
          </span>
        </div>
        <h1
          className="numeral text-4xl sm:text-5xl"
          style={{ fontWeight: 500, letterSpacing: '-0.04em' }}
        >
          {heading}
        </h1>
        {open.length === 0 && (
          <p className="assessment mt-6">
            GeegLot checks your sources each morning. When something matches, it
            appears here.
          </p>
        )}
      </header>

      {open.map(renderCard)}

      {handled.length > 0 && (
        <section className="mt-16">
          <button
            onClick={() => setShowHandled(!showHandled)}
            className="meta underline underline-offset-4"
          >
            {showHandled
              ? 'Hide the ' + handled.length + ' you have handled'
              : handled.length + ' you have already handled'}
          </button>

          {showHandled && <div className="mt-8">{handled.map(renderCard)}</div>}
        </section>
      )}
    </main>
  );
}