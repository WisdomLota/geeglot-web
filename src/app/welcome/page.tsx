'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPut, apiPost, apiUpload } from '@/lib/api';

type Step = 'name' | 'cv' | 'review' | 'channel' | 'telegram';

interface Proposal {
  profession_context: string;
  search_queries: string[];
  skills: string[];
  seeking: string[];
  country: string;
  residence_country: string | null;
}

const COUNTRIES = [
  { id: 'gb', label: 'United Kingdom' },
  { id: 'us', label: 'United States' },
  { id: 'de', label: 'Germany' },
  { id: 'nl', label: 'Netherlands' },
  { id: 'ca', label: 'Canada' },
  { id: 'au', label: 'Australia' },
];

const RESIDENCE = [
  { id: 'cy', label: 'Cyprus' },
  { id: 'tr', label: 'Türkiye' },
  { id: 'ng', label: 'Nigeria' },
  { id: 'gb', label: 'United Kingdom' },
  { id: 'us', label: 'United States' },
  { id: 'de', label: 'Germany' },
  { id: 'nl', label: 'Netherlands' },
  { id: 'ca', label: 'Canada' },
  { id: 'au', label: 'Australia' },
  { id: 'za', label: 'South Africa' },
  { id: 'in', label: 'India' },
  { id: 'br', label: 'Brazil' },
];

function toList(s: string): string[] {
  return s
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('name');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [cyprus, setCyprus] = useState(false);
  const [channel, setChannel] = useState('email');
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Anyone who already has preferences doesn't need this flow.
  useEffect(() => {
    apiGet('/me/preferences')
      .then(() => router.replace('/app'))
      .catch(() => {});
  }, [router]);

  async function saveName() {
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await apiPut('/me/profile', { full_name: name.trim() });
      setStep('cv');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function uploadCv(file: File) {
    setBusy(true);
    setError(null);
    try {
      await apiUpload('/me/cv', file);
      const p = await apiPost<Proposal>('/me/cv/propose');
      setProposal(p);
      setStep('review');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  /** No CV: start from a blank set the user fills in themselves. */
  function skipCv() {
    setProposal({
      profession_context: '',
      search_queries: [],
      skills: [],
      seeking: ['employment'],
      country: 'gb',
      residence_country: null,
    });
    setStep('review');
  }

  async function connectTelegram() {
    setBusy(true);
    setError(null);
    try {
      const { url } = await apiPost<{ url: string }>('/me/telegram/link');
      setLinkUrl(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function goToDashboard() {
    router.push('/app');
    router.refresh();
  }

  async function finish() {
    if (!proposal) return;
    setBusy(true);
    setError(null);
    try {
      await apiPut('/me/preferences', {
        skills: proposal.skills,
        search_queries: proposal.search_queries,
        excluded_keywords: [],
        preferred_platforms: cyprus
          ? ['adzuna', 'iskibris', 'himalayas', 'remotive']
          : ['adzuna', 'himalayas', 'remotive'],
        country: proposal.country,
        min_score: 60,
        max_alerts_per_day: 5,
        min_hourly_rate: null,
        profession_context: proposal.profession_context,
        seeking: proposal.seeking,
        residence_country: proposal.residence_country,
      });
      await apiPut('/me/profile', { alert_channel: channel });

      // Telegram needs a chat link, so don't drop them at the dashboard yet.
      if (channel === 'telegram' || channel === 'both') {
        setBusy(false);
        setStep('telegram');
        return;
      }

      goToDashboard();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  function set<K extends keyof Proposal>(key: K, value: Proposal[K]) {
    if (!proposal) return;
    setProposal({ ...proposal, [key]: value });
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-24">
      {step === 'name' && (
        <div>
          <p className="meta mb-3">Setting up</p>
          <h1
            className="numeral mb-6 text-3xl sm:text-4xl"
            style={{ fontWeight: 500, letterSpacing: '-0.03em' }}
          >
            What should we call you?
          </h1>
          <p className="assessment mb-8">
            This goes on the applications GeegLot drafts for you, so use the
            name you&rsquo;d put on a CV.
          </p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveName()}
            placeholder="Your full name"
            className="mb-8 w-full border-b bg-transparent py-2 text-lg outline-none focus:border-current"
            style={{ borderColor: 'var(--color-rule)' }}
          />

          <Primary onClick={saveName} disabled={busy || !name.trim()}>
            {busy ? 'One moment' : 'Continue'}
          </Primary>
        </div>
      )}

      {step === 'cv' && (
        <div>
          <p className="meta mb-3">Step 2 of 3</p>
          <h1
            className="numeral mb-6 text-3xl sm:text-4xl"
            style={{ fontWeight: 500, letterSpacing: '-0.03em' }}
          >
            Upload your CV
          </h1>
          <p className="assessment mb-4">
            This is the quickest way to set GeegLot up. It reads your CV and
            works out what to search for, what you&rsquo;re good at, and what
            kind of work suits you. You&rsquo;ll see everything it suggests and
            can change any of it.
          </p>
          <p
            className="assessment mb-8"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            It also means the applications it drafts reference your real
            experience rather than leaving gaps for you to fill in. PDF or Word,
            up to 5MB.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadCv(f);
            }}
          />

          <div className="flex flex-wrap items-center gap-5">
            <Primary onClick={() => inputRef.current?.click()} disabled={busy}>
              {busy ? 'Reading your CV' : 'Choose a file'}
            </Primary>
            <button
              onClick={skipCv}
              disabled={busy}
              className="text-sm underline underline-offset-4 disabled:opacity-40"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-ink-soft)',
              }}
            >
              I don&rsquo;t have one to hand
            </button>
          </div>

          {busy && (
            <p
              className="assessment mt-6"
              style={{ color: 'var(--color-ink-soft)' }}
            >
              This takes about twenty seconds.
            </p>
          )}
        </div>
      )}

      {step === 'review' && proposal && (
        <div>
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <p className="meta">Step 3 of 3</p>
            <button
              onClick={() => setStep('cv')}
              className="meta underline underline-offset-4"
            >
              Upload a CV instead
            </button>
          </div>

          <h1
            className="numeral mb-6 text-3xl sm:text-4xl"
            style={{ fontWeight: 500, letterSpacing: '-0.03em' }}
          >
            Does this look right?
          </h1>
          <p className="assessment mb-10">
            Change anything that&rsquo;s wrong. You can come back and adjust it
            whenever you like.
          </p>

          <div className="space-y-8">
            <div>
              <p className="meta mb-2">About your work</p>
              <textarea
                value={proposal.profession_context}
                onChange={(e) => set('profession_context', e.target.value)}
                rows={4}
                placeholder="Registered nurse, community settings, prefer day shifts."
                className="w-full resize-y border-b bg-transparent py-2 outline-none focus:border-current"
                style={{ borderColor: 'var(--color-rule)' }}
              />
            </div>

            <div>
              <p className="meta mb-2">What to search for</p>
              <p
                className="mb-3 text-sm"
                style={{ color: 'var(--color-ink-soft)' }}
              >
                Job titles, comma separated.
              </p>
              <input
                value={proposal.search_queries.join(', ')}
                onChange={(e) => set('search_queries', toList(e.target.value))}
                placeholder="registered nurse, staff nurse"
                className="w-full border-b bg-transparent py-2 text-lg outline-none focus:border-current"
                style={{ borderColor: 'var(--color-rule)' }}
              />
            </div>

            <div>
              <p className="meta mb-2">Your skills</p>
              <input
                value={proposal.skills.join(', ')}
                onChange={(e) => set('skills', toList(e.target.value))}
                className="w-full border-b bg-transparent py-2 text-lg outline-none focus:border-current"
                style={{ borderColor: 'var(--color-rule)' }}
              />
            </div>

            <div>
              <p className="meta mb-2">What kind of work</p>
              <div className="space-y-3">
                {[
                  {
                    id: 'employment',
                    label: 'Jobs',
                    note: 'Permanent and fixed-term roles',
                  },
                  {
                    id: 'gig',
                    label: 'Gigs',
                    note: 'Freelance and contract work',
                  },
                ].map((s) => (
                  <label
                    key={s.id}
                    className="flex cursor-pointer items-start gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={proposal.seeking.includes(s.id)}
                      onChange={(e) =>
                        set(
                          'seeking',
                          e.target.checked
                            ? [...proposal.seeking, s.id]
                            : proposal.seeking.filter((x) => x !== s.id),
                        )
                      }
                      className="mt-1.5"
                    />
                    <span>
                      <span className="block">{s.label}</span>
                      <span
                        className="text-sm"
                        style={{ color: 'var(--color-ink-soft)' }}
                      >
                        {s.note}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="meta mb-2">Where you live</p>
              <p
                className="mb-3 text-sm"
                style={{ color: 'var(--color-ink-soft)' }}
              >
                Some jobs restrict who can apply. This helps me tell you when
                that affects you.
              </p>
              <select
                value={proposal.residence_country ?? ''}
                onChange={(e) =>
                  set('residence_country', e.target.value || null)
                }
                className="w-full border-b bg-transparent py-2 text-lg outline-none focus:border-current"
                style={{ borderColor: 'var(--color-rule)' }}
              >
                <option value="">Prefer not to say</option>
                {RESIDENCE.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="meta mb-2">Where to look</p>
              <select
                value={proposal.country}
                onChange={(e) => set('country', e.target.value)}
                className="w-full border-b bg-transparent py-2 text-lg outline-none focus:border-current"
                style={{ borderColor: 'var(--color-rule)' }}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={cyprus}
                  onChange={(e) => setCyprus(e.target.checked)}
                  className="mt-1.5"
                />
                <span>
                  <span className="block">Also search North Cyprus</span>
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-ink-soft)' }}
                  >
                    Local listings from İşkıbrıs
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="mt-10">
            <Primary onClick={() => setStep('channel')} disabled={busy}>
              Continue
            </Primary>
          </div>
        </div>
      )}

      {step === 'channel' && (
        <div>
          <p className="meta mb-3">Last thing</p>
          <h1
            className="numeral mb-6 text-3xl sm:text-4xl"
            style={{ fontWeight: 500, letterSpacing: '-0.03em' }}
          >
            How should we reach you?
          </h1>
          <p className="assessment mb-8">
            GeegLot checks your sources each morning and only gets in touch when
            something is genuinely worth your time. At most five a day.
          </p>

          <div className="mb-10 space-y-4">
            {[
              {
                id: 'email',
                label: 'Email',
                note: 'Sent to the address you signed up with',
              },
              {
                id: 'telegram',
                label: 'Telegram',
                note: 'Approve straight from the chat',
              },
              { id: 'both', label: 'Both', note: '' },
            ].map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-start gap-3"
              >
                <input
                  type="radio"
                  name="channel"
                  checked={channel === c.id}
                  onChange={() => setChannel(c.id)}
                  className="mt-1.5"
                />
                <span>
                  <span className="block">{c.label}</span>
                  {c.note && (
                    <span
                      className="text-sm"
                      style={{ color: 'var(--color-ink-soft)' }}
                    >
                      {c.note}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>

          <Primary onClick={finish} disabled={busy}>
            {busy ? 'Setting things up' : 'Start finding work'}
          </Primary>
        </div>
      )}

      {step === 'telegram' && (
        <div>
          <p className="meta mb-3">One last step</p>
          <h1
            className="numeral mb-6 text-3xl sm:text-4xl"
            style={{ fontWeight: 500, letterSpacing: '-0.03em' }}
          >
            Connect your Telegram
          </h1>
          <p className="assessment mb-8">
            Open the chat and press Start. That links this account so I know
            where to send your alerts.
          </p>

          {linkUrl === null && (
            <Primary onClick={connectTelegram} disabled={busy}>
              {busy ? 'One moment' : 'Get my link'}
            </Primary>
          )}

          {linkUrl !== null && (
            <div>
              <a
                href={linkUrl}
                target="_blank"
                rel="noreferrer"
                className="mb-6 inline-block px-5 py-3 text-sm"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: 'var(--color-ink)',
                  color: 'var(--color-paper)',
                }}
              >
                Open Telegram
              </a>
              <p>
                <button
                  onClick={goToDashboard}
                  className="text-sm underline underline-offset-4"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-ink-soft)',
                  }}
                >
                  Done &mdash; take me to my dashboard
                </button>
              </p>
            </div>
          )}

          <p
            className="assessment mt-8 text-sm"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            You can also do this later from Preferences.
          </p>
        </div>
      )}

      {error && (
        <p className="mt-6 text-sm" style={{ color: 'var(--color-signal)' }}>
          {error}
        </p>
      )}
    </main>
  );
}

function Primary({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-5 py-3 text-sm disabled:opacity-40"
      style={{
        fontFamily: 'var(--font-display)',
        background: 'var(--color-ink)',
        color: 'var(--color-paper)',
      }}
    >
      {children}
    </button>
  );
}