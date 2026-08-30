'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost, type Assessment } from '@/lib/api';

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

  useEffect(() => {
    apiGet<Assessment[]>('/me/assessments')
      .then(setItems)
      .catch((e: Error) => setError(e.message));
  }, []);

  async function decide(jobId: string, decision: 'approved' | 'rejected') {
    setBusy(jobId);
    try {
      await apiPost('/me/assessments/' + jobId + '/' + decision);
      const fresh = await apiGet<Assessment[]>('/me/assessments');
      setItems(fresh);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="meta mb-3">Something went wrong</p>
        <p className="assessment">{error}</p>
      </main>
    );
  }

  if (!items) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="meta">Loading</p>
      </main>
    );
  }

  const open = items.filter((i) => !i.alert || i.alert.status === 'pending');

  const heading =
    open.length === 0
      ? 'Nothing new today'
      : open.length === 1
        ? 'One worth your time'
        : open.length + ' worth your time';

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-16">
        <p className="meta mb-3">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
        <h1
          className="numeral text-5xl"
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

      {items.map((a) => {
        const job = a.jobs;
        const min = money(job.budget_min, job.currency);
        const max = money(job.budget_max, job.currency);
        const pay = min === max ? min : min + '–' + max;
        const decided = a.alert !== null && a.alert.status !== 'pending';
        const rejected = a.alert !== null && a.alert.status === 'rejected';

        return (
          <article
            key={a.id}
            className="grid grid-cols-[4.5rem_1fr] gap-6 border-t py-10"
            style={{
              borderColor: 'var(--color-rule)',
              opacity: rejected ? 0.45 : 1,
            }}
          >
            <div
              className="numeral text-5xl"
              style={{ color: 'var(--color-signal)' }}
            >
              {a.score}
            </div>

            <div>
              <h2
                className="numeral mb-1 text-2xl"
                style={{ fontWeight: 500, letterSpacing: '-0.02em' }}
              >
                {job.title}
              </h2>
              <p className="meta mb-5">
                {job.platform} · {job.client_country ?? 'Location not stated'}
              </p>

              <p className="assessment mb-6">{a.reasoning}</p>

              <dl className="mb-6 space-y-2 text-sm">
                {a.matched_skills.length > 0 && (
                  <div className="flex gap-3">
                    <dt className="meta w-24 shrink-0 pt-0.5">Matches</dt>
                    <dd>{a.matched_skills.join(', ')}</dd>
                  </div>
                )}
                {a.concerns.length > 0 && (
                  <div className="flex gap-3">
                    <dt className="meta w-24 shrink-0 pt-0.5">Watch for</dt>
                    <dd>{a.concerns.join('; ')}</dd>
                  </div>
                )}
                {pay !== null && (
                  <div className="flex gap-3">
                    <dt className="meta w-24 shrink-0 pt-0.5">Pay</dt>
                    <dd>
                      {pay}
                      {job.salary_is_estimate && (
                        <span style={{ color: 'var(--color-ink-soft)' }}>
                          {' '}
                          — estimated, not employer-stated
                        </span>
                      )}
                    </dd>
                  </div>
                )}
              </dl>

              {a.alert !== null && a.alert.proposal_draft !== null && (
                <div
                  className="mb-6 border-l-2 pl-5"
                  style={{ borderColor: 'var(--color-signal)' }}
                >
                  <p className="meta mb-3">Draft — review before sending</p>
                  <p className="assessment whitespace-pre-wrap">
                    {a.alert.proposal_draft}
                  </p>
                  {a.alert.submission_instructions !== null && (
                    <div>
                      <p className="meta mb-2 mt-5">How to submit</p>
                      <p className="assessment">
                        {a.alert.submission_instructions}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4">
                {!decided && (
                  <button
                    onClick={() => decide(job.id, 'approved')}
                    disabled={busy === job.id}
                    className="px-4 py-2 text-sm disabled:opacity-40"
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
      })}
    </main>
  );
}