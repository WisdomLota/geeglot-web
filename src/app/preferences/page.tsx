'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet, apiPut, apiPost, apiDelete } from '@/lib/api';
import { CvUpload } from '@/components/cv-upload';
import { SignOut } from '@/components/sign-out';

interface Preferences {
  skills: string[];
  search_queries: string[];
  excluded_keywords: string[];
  preferred_platforms: string[];
  country: string;
  min_score: number;
  max_alerts_per_day: number;
  min_hourly_rate: number | null;
  profession_context: string | null;
  seeking: string[];
  residence_country: string | null;
}

interface Profile {
  email: string | null;
  alert_channel: string;
  telegram_chat_id: string | null;
}

const PLATFORMS = [
  { id: 'adzuna', label: 'Adzuna', note: 'Employers across most professions' },
  { id: 'iskibris', label: 'İşkıbrıs', note: 'North Cyprus' },
  { id: 'himalayas', label: 'Himalayas', note: 'Remote jobs worldwide' },
  { id: 'remotive', label: 'Remotive', note: 'Remote roles, states who can apply' },
];

const COUNTRIES = [
  { id: 'gb', label: 'United Kingdom' },
  { id: 'us', label: 'United States' },
  { id: 'de', label: 'Germany' },
  { id: 'nl', label: 'Netherlands' },
  { id: 'ca', label: 'Canada' },
  { id: 'au', label: 'Australia' },
];

function toList(s: string): string[] {
  return s
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [linking, setLinking] = useState(false);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Profile>('/me/profile')
      .then(setProfile)
      .catch(() => {});

    apiGet<Preferences>('/me/preferences')
      .then(setPrefs)
      .catch(() => {
        setPrefs({
          skills: [],
          search_queries: [],
          excluded_keywords: [],
          preferred_platforms: ['adzuna'],
          country: 'gb',
          min_score: 70,
          max_alerts_per_day: 10,
          min_hourly_rate: null,
          profession_context: '',
          seeking: ['employment'],
          residence_country: null,
        });
      });
  }, []);

  function set<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    if (!prefs) return;
    setPrefs({ ...prefs, [key]: value });
    setSaved(false);
  }

  async function setChannel(channel: string) {
    if (!profile) return;
    setProfile({ ...profile, alert_channel: channel });
    try {
      await apiPut('/me/profile', { alert_channel: channel });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  /**
   * We fetch the link and render it as an anchor rather than calling
   * window.open, which mobile browsers block when it follows an await.
   */
  async function connectTelegram() {
    setLinking(true);
    setError(null);
    try {
      const { url } = await apiPost<{ url: string }>('/me/telegram/link');
      setLinkUrl(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLinking(false);
    }
  }

  async function disconnectTelegram() {
    try {
      await apiDelete('/me/telegram');
      const fresh = await apiGet<Profile>('/me/profile');
      setProfile(fresh);
      setLinkUrl(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function save() {
    if (!prefs) return;
    setBusy(true);
    setError(null);
    try {
      await apiPut('/me/preferences', {
        skills: prefs.skills,
        search_queries: prefs.search_queries,
        excluded_keywords: prefs.excluded_keywords,
        preferred_platforms: prefs.preferred_platforms,
        country: prefs.country,
        min_score: prefs.min_score,
        max_alerts_per_day: prefs.max_alerts_per_day,
        min_hourly_rate: prefs.min_hourly_rate,
        profession_context: prefs.profession_context,
        seeking: prefs.seeking,
        residence_country: prefs.residence_country,
      });
      setSaved(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!prefs) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-20">
        <p className="meta">Loading</p>
      </main>
    );
  }

  const linked = profile?.telegram_chat_id != null;
  const wantsTelegram =
    profile?.alert_channel === 'telegram' || profile?.alert_channel === 'both';

  return (
    <main className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-20">
      <header className="mb-12 sm:mb-16">
        <div className="mb-6 flex justify-between gap-4">
          <Link href="/app" className="meta underline underline-offset-4">
            Back to assessments
          </Link>
          <SignOut />
        </div>
        <h1
          className="numeral text-4xl sm:text-5xl"
          style={{ fontWeight: 500, letterSpacing: '-0.04em' }}
        >
          What you&rsquo;re looking for
        </h1>
        <p className="assessment mt-5">
          GeegLot uses this to search each morning and to judge what it finds.
          The more specific you are, the better the assessments.
        </p>
      </header>

      <div className="space-y-10">
        <CvUpload />

        <Field
          label="About your work"
          help="A sentence or two in your own words. Your profession, how you like to work, anything that matters."
        >
          <textarea
            value={prefs.profession_context ?? ''}
            onChange={(e) => set('profession_context', e.target.value)}
            rows={4}
            className="w-full resize-y border-b bg-transparent py-2 outline-none focus:border-current"
            style={{ borderColor: 'var(--color-rule)' }}
          />
        </Field>

        <Field
          label="Search terms"
          help="What GeegLot types into job boards for you. Comma separated."
        >
          <input
            value={prefs.search_queries.join(', ')}
            onChange={(e) => set('search_queries', toList(e.target.value))}
            className="w-full border-b bg-transparent py-2 text-lg outline-none focus:border-current"
            style={{ borderColor: 'var(--color-rule)' }}
          />
        </Field>

        <Field label="Your skills" help="Comma separated.">
          <input
            value={prefs.skills.join(', ')}
            onChange={(e) => set('skills', toList(e.target.value))}
            className="w-full border-b bg-transparent py-2 text-lg outline-none focus:border-current"
            style={{ borderColor: 'var(--color-rule)' }}
          />
        </Field>

        <Field
          label="Never show me"
          help="Postings containing these words are dropped before they cost you anything."
        >
          <input
            value={prefs.excluded_keywords.join(', ')}
            onChange={(e) => set('excluded_keywords', toList(e.target.value))}
            className="w-full border-b bg-transparent py-2 text-lg outline-none focus:border-current"
            style={{ borderColor: 'var(--color-rule)' }}
          />
        </Field>

        <Field label="Where to look">
          <div className="space-y-3">
            {PLATFORMS.map((p) => (
              <label
                key={p.id}
                className="flex cursor-pointer items-start gap-3"
              >
                <input
                  type="checkbox"
                  checked={prefs.preferred_platforms.includes(p.id)}
                  onChange={(e) =>
                    set(
                      'preferred_platforms',
                      e.target.checked
                        ? [...prefs.preferred_platforms, p.id]
                        : prefs.preferred_platforms.filter((x) => x !== p.id),
                    )
                  }
                  className="mt-1.5"
                />
                <span>
                  <span className="block">{p.label}</span>
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-ink-soft)' }}
                  >
                    {p.note}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </Field>

        <Field
          label="Where you live"
          help="Used to judge whether you can actually apply — some postings restrict candidates by country, citizenship, or clearance."
        >
          <select
            value={prefs.residence_country ?? ''}
            onChange={(e) =>
              set('residence_country', e.target.value || null)
            }
            className="w-full border-b bg-transparent py-2 text-lg outline-none focus:border-current"
            style={{ borderColor: 'var(--color-rule)' }}
          >
            <option value="">Prefer not to say</option>
            <option value="cy">Cyprus</option>
            <option value="tr">Türkiye</option>
            <option value="ng">Nigeria</option>
            <option value="gb">United Kingdom</option>
            <option value="us">United States</option>
            <option value="de">Germany</option>
            <option value="nl">Netherlands</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="za">South Africa</option>
            <option value="in">India</option>
            <option value="br">Brazil</option>
          </select>
        </Field>

        <Field
          label="Where to search"
          help="Which country's job market to search. Applies to Adzuna; remote sources search worldwide."
        >
          <select
            value={prefs.country}
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
        </Field>

        <Field label="What kind of work">
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
                  checked={prefs.seeking.includes(s.id)}
                  onChange={(e) =>
                    set(
                      'seeking',
                      e.target.checked
                        ? [...prefs.seeking, s.id]
                        : prefs.seeking.filter((x) => x !== s.id),
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
        </Field>

        <Field
          label="How selective"
          help="Only postings scoring at or above this reach you."
        >
          <div className="flex items-center gap-5">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={prefs.min_score}
              onChange={(e) => set('min_score', Number(e.target.value))}
              className="flex-1"
            />
            <span
              className="numeral text-3xl"
              style={{ color: 'var(--color-signal)', minWidth: '2.5ch' }}
            >
              {prefs.min_score}
            </span>
          </div>
        </Field>

        <Field label="Most alerts in a day">
          <input
            type="number"
            min={1}
            max={50}
            value={prefs.max_alerts_per_day}
            onChange={(e) => set('max_alerts_per_day', Number(e.target.value))}
            className="w-24 border-b bg-transparent py-2 text-lg outline-none focus:border-current"
            style={{ borderColor: 'var(--color-rule)' }}
          />
        </Field>

        <Field
          label="Minimum hourly rate"
          help="Leave empty if it doesn't apply."
        >
          <input
            type="number"
            min={0}
            value={prefs.min_hourly_rate ?? ''}
            onChange={(e) =>
              set(
                'min_hourly_rate',
                e.target.value === '' ? null : Number(e.target.value),
              )
            }
            className="w-32 border-b bg-transparent py-2 text-lg outline-none focus:border-current"
            style={{ borderColor: 'var(--color-rule)' }}
          />
        </Field>
      </div>

      <div
        className="mt-12 flex flex-wrap items-center gap-4 border-t pt-8"
        style={{ borderColor: 'var(--color-rule)' }}
      >
        <button
          onClick={save}
          disabled={busy}
          className="px-5 py-3 text-sm disabled:opacity-40"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'var(--color-ink)',
            color: 'var(--color-paper)',
          }}
        >
          {busy ? 'Saving' : 'Save changes'}
        </button>
        {saved && <span className="meta">Saved</span>}
      </div>

      <section
        className="mt-16 border-t pt-10"
        style={{ borderColor: 'var(--color-rule)' }}
      >
        <h2
          className="numeral mb-6 text-2xl"
          style={{ fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          How we reach you
        </h2>

        <div className="mb-8 space-y-3">
          {[
            {
              id: 'email',
              label: 'Email',
              note: profile?.email ?? 'Your account address',
            },
            {
              id: 'telegram',
              label: 'Telegram',
              note: 'Tap to approve straight from the chat',
            },
            { id: 'both', label: 'Both', note: '' },
          ].map((c) => (
            <label key={c.id} className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="channel"
                checked={profile?.alert_channel === c.id}
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

        {wantsTelegram && (
          <div>
            <p className="meta mb-2">Telegram</p>

            {linked && (
              <div className="flex flex-wrap items-baseline gap-4">
                <span>Connected</span>
                <button
                  onClick={disconnectTelegram}
                  className="meta underline underline-offset-4"
                >
                  Disconnect
                </button>
              </div>
            )}

            {!linked && linkUrl === null && (
              <div>
                <p
                  className="mb-4 text-sm"
                  style={{ color: 'var(--color-ink-soft)' }}
                >
                  Connects this account to the GeegLot bot so alerts arrive in
                  your Telegram.
                </p>
                <button
                  onClick={connectTelegram}
                  disabled={linking}
                  className="px-4 py-2.5 text-sm disabled:opacity-40"
                  style={{
                    fontFamily: 'var(--font-display)',
                    background: 'var(--color-ink)',
                    color: 'var(--color-paper)',
                  }}
                >
                  {linking ? 'One moment' : 'Connect Telegram'}
                </button>
              </div>
            )}

            {!linked && linkUrl !== null && (
              <div>
                <p
                  className="mb-4 text-sm"
                  style={{ color: 'var(--color-ink-soft)' }}
                >
                  Open Telegram and press Start. Come back here afterwards and
                  reload to confirm.
                </p>
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-4 py-2.5 text-sm"
                  style={{
                    fontFamily: 'var(--font-display)',
                    background: 'var(--color-ink)',
                    color: 'var(--color-paper)',
                  }}
                >
                  Open Telegram
                </a>
              </div>
            )}
          </div>
        )}
      </section>

      {error && (
        <p className="mt-6 text-sm" style={{ color: 'var(--color-signal)' }}>
          {error}
        </p>
      )}
    </main>
  );
}

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="meta mb-2">{label}</p>
      {help && (
        <p className="mb-3 text-sm" style={{ color: 'var(--color-ink-soft)' }}>
          {help}
        </p>
      )}
      {children}
    </div>
  );
}