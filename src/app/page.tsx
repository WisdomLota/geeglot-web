import Link from 'next/link';

export default function Landing() {
  return (
    <main>
      {/* Opening statement */}
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
        <div className="mb-20 flex items-baseline justify-between gap-4 sm:mb-28">
          <span
            className="numeral text-lg"
            style={{ fontWeight: 600, letterSpacing: '-0.04em' }}
          >
            GeegLot
          </span>
          <Link href="/sign-in" className="meta underline underline-offset-4">
            Sign in
          </Link>
        </div>

        <h1
          className="numeral mb-8 text-[2.75rem] leading-[1.02] sm:text-7xl"
          style={{ fontWeight: 500, letterSpacing: '-0.045em' }}
        >
          I check the job
          <br />
          boards. You decide.
        </h1>

        <p className="assessment mb-12 text-lg sm:text-xl">
          GeegLot reads every new listing against what you&rsquo;re looking for,
          and gets in touch only when something is genuinely worth your time.
          Say yes, and it drafts the application for you to review.
        </p>

        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/sign-in"
            className="inline-block px-6 py-3.5 text-sm"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'var(--color-ink)',
              color: 'var(--color-paper)',
            }}
          >
            Start watching for me
          </Link>
          <span className="text-sm" style={{ color: 'var(--color-ink-soft)' }}>
            Free while it&rsquo;s new
          </span>
        </div>
      </section>

      {/* The product, shown rather than described */}
      <section
        className="border-t"
        style={{ borderColor: 'var(--color-rule)' }}
      >
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="meta mb-10">What arrives</p>

          <article className="border-t py-8 sm:grid sm:grid-cols-[5.5rem_1fr] sm:gap-8 sm:py-10"
            style={{ borderColor: 'var(--color-rule)' }}
          >
            <div
              className="numeral mb-3 text-5xl sm:mb-0 sm:text-6xl"
              style={{ color: 'var(--color-signal)' }}
            >
              78
            </div>

            <div className="min-w-0">
              <h2
                className="numeral mb-1 text-xl sm:text-2xl"
                style={{ fontWeight: 500, letterSpacing: '-0.02em' }}
              >
                Fullstack JavaScript Developer — Opus Recruitment
              </h2>
              <p className="meta mb-5">Adzuna · Telford, Shropshire</p>

              <p className="assessment mb-6">
                The posting is a strong technical match, requiring React,
                Next.js, TypeScript and Node.js — all core skills for this
                candidate. The rate of 500–550 GBP/day comfortably exceeds the
                candidate&rsquo;s minimum. The main concern is the location
                listed as Telford, which may imply some on-site presence despite
                the &lsquo;Remote&rsquo; label in the description.
              </p>

              <dl className="space-y-3 text-sm">
                <div className="sm:flex sm:gap-3">
                  <dt className="meta mb-1 sm:mb-0 sm:w-24 sm:shrink-0 sm:pt-0.5">
                    Matches
                  </dt>
                  <dd>Next.js, React, TypeScript, NestJS</dd>
                </div>
                <div className="sm:flex sm:gap-3">
                  <dt className="meta mb-1 sm:mb-0 sm:w-24 sm:shrink-0 sm:pt-0.5">
                    Watch for
                  </dt>
                  <dd>
                    Location may require on-site presence; 3-month contract,
                    though extension is likely
                  </dd>
                </div>
                <div className="sm:flex sm:gap-3">
                  <dt className="meta mb-1 sm:mb-0 sm:w-24 sm:shrink-0 sm:pt-0.5">
                    Pay
                  </dt>
                  <dd>£500–£550 per day</dd>
                </div>
              </dl>
            </div>
          </article>

          <p
            className="assessment mt-10 text-sm"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            A real assessment. The score, the reasoning, and the concerns —
            including the ones that argue against applying.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        className="border-t"
        style={{ borderColor: 'var(--color-rule)' }}
      >
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="meta mb-12">How it works</p>

          <ol className="space-y-12">
            {[
              {
                n: '01',
                h: 'Tell me what you do',
                p: 'Upload your CV and I work out what to search for, what you\u2019re good at, and what kind of work suits you. Change anything I get wrong.',
              },
              {
                n: '02',
                h: 'I check every morning',
                p: 'Job boards across most professions and most countries. You don\u2019t open them. You don\u2019t refresh anything.',
              },
              {
                n: '03',
                h: 'You hear from me only when it matters',
                p: 'A score out of 100, why it scored that way, and what to watch out for. By email or Telegram, capped at however many a day you want.',
              },
              {
                n: '04',
                h: 'Say yes and I write the draft',
                p: 'A tailored application in your voice, drawing on your real experience, with instructions on where to send it. You read it, change it, and send it yourself.',
              },
            ].map((step) => (
              <li
                key={step.n}
                className="border-t pt-8 sm:grid sm:grid-cols-[5.5rem_1fr] sm:gap-8"
                style={{ borderColor: 'var(--color-rule)' }}
              >
                <div
                  className="numeral mb-3 text-2xl sm:mb-0"
                  style={{ color: 'var(--color-ink-soft)', fontWeight: 500 }}
                >
                  {step.n}
                </div>
                <div>
                  <h3
                    className="numeral mb-3 text-xl sm:text-2xl"
                    style={{ fontWeight: 500, letterSpacing: '-0.02em' }}
                  >
                    {step.h}
                  </h3>
                  <p className="assessment">{step.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The principle — the one place the page raises its voice */}
      <section style={{ background: 'var(--color-ink)' }}>
        <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
          <h2
            className="numeral mb-8 text-4xl leading-[1.1] sm:text-6xl"
            style={{
              color: 'var(--color-paper)',
              fontWeight: 500,
              letterSpacing: '-0.04em',
            }}
          >
            I never apply
            <br />
            on your behalf.
          </h2>
          <p
            className="assessment text-lg"
            style={{ color: 'var(--color-rule)' }}
          >
            Plenty of tools will fire off applications for you. GeegLot stops
            one step short, on purpose. I find the work and write the draft. The
            decision to send it, and the words that go out under your name, stay
            yours.
          </p>
        </div>
      </section>

      {/* Honest limits */}
      <section
        className="border-t"
        style={{ borderColor: 'var(--color-rule)' }}
      >
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="meta mb-10">Worth knowing</p>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h3
                className="numeral mb-3 text-lg"
                style={{ fontWeight: 500, letterSpacing: '-0.02em' }}
              >
                Some salaries are estimates
              </h3>
              <p className="assessment text-sm">
                Job aggregators often guess at pay. Where a figure isn&rsquo;t
                the employer&rsquo;s own, I say so rather than letting you
                assume it&rsquo;s real.
              </p>
            </div>

            <div>
              <h3
                className="numeral mb-3 text-lg"
                style={{ fontWeight: 500, letterSpacing: '-0.02em' }}
              >
                A low score is still useful
              </h3>
              <p className="assessment text-sm">
                I won&rsquo;t inflate a match to keep you applying. If something
                scores 42, the reasoning tells you exactly which gaps put it
                there.
              </p>
            </div>

            <div>
              <h3
                className="numeral mb-3 text-lg"
                style={{ fontWeight: 500, letterSpacing: '-0.02em' }}
              >
                Drafts leave gaps on purpose
              </h3>
              <p className="assessment text-sm">
                If a posting asks for experience you haven&rsquo;t listed, the
                draft leaves a marked blank instead of inventing something. Your
                application should be true.
              </p>
            </div>

            <div>
              <h3
                className="numeral mb-3 text-lg"
                style={{ fontWeight: 500, letterSpacing: '-0.02em' }}
              >
                Coverage varies by country
              </h3>
              <p className="assessment text-sm">
                Listings come from public job boards, so how much I find depends
                on where you are and what you do. More sources are being added.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Close */}
      <section
        className="border-t"
        style={{ borderColor: 'var(--color-rule)' }}
      >
        <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <h2
            className="numeral mb-8 text-3xl sm:text-5xl"
            style={{ fontWeight: 500, letterSpacing: '-0.04em' }}
          >
            Stop refreshing job boards.
          </h2>
          <Link
            href="/sign-in"
            className="inline-block px-6 py-3.5 text-sm"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'var(--color-ink)',
              color: 'var(--color-paper)',
            }}
          >
            Start watching for me
          </Link>
        </div>
      </section>

      <footer
        className="border-t"
        style={{ borderColor: 'var(--color-rule)' }}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-between gap-4 px-5 py-10 sm:px-8">
          <span className="meta">
            GeegLot — I check the job boards. You decide.
          </span>
          <span className="meta">
            Job data from Adzuna and İşkıbrıs
          </span>
        </div>
      </footer>
    </main>
  );
}