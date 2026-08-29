const SAMPLE = [
  {
    score: 78,
    title: 'Fullstack JavaScript Developer',
    company: 'Opus Recruitment Solutions',
    platform: 'Adzuna',
    location: 'London, UK',
    pay: '£65,000–£80,000',
    estimated: false,
    assessment:
      'Strong alignment across the stack — React and TypeScript are central to the role, and the backend work maps onto your NestJS experience. The remote arrangement is stated explicitly, which is unusual for this listing type.',
    matched: ['React', 'TypeScript', 'Node.js'],
    concerns: ['Permanent role rather than contract'],
  },
  {
    score: 72,
    title: 'Frontend Developer — React / Next.js',
    company: 'Standard 8',
    platform: 'Adzuna',
    location: 'Manchester, UK',
    pay: '£55,000',
    estimated: true,
    assessment:
      'Next.js is named directly in the requirements, which is rare. The salary figure comes from the aggregator rather than the employer, so treat it as indicative until confirmed.',
    matched: ['Next.js', 'React', 'Tailwind CSS'],
    concerns: ['Salary not employer-stated', 'On-site two days a week'],
  },
  {
    score: 42,
    title: 'Junior AI Software Engineer',
    company: 'Accenture',
    platform: 'Adzuna',
    location: 'UK',
    pay: '£60,668',
    estimated: true,
    assessment:
      'Full-stack skills are relevant, but the role is pitched at junior level and centres on agentic AI tooling rather than your core stack. No mention of NestJS or Supabase.',
    matched: ['TypeScript', 'React'],
    concerns: ['Junior level', 'Not explicitly remote'],
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-16">
        <p className="meta mb-3">Friday, 28 August</p>
        <h1
          className="numeral text-5xl"
          style={{ fontWeight: 500, letterSpacing: '-0.04em' }}
        >
          Three worth your time
        </h1>
      </header>

      <div>
        {SAMPLE.map((job, i) => (
          <article
            key={i}
            className="grid grid-cols-[4.5rem_1fr] gap-6 border-t py-10"
            style={{ borderColor: 'var(--color-rule)' }}
          >
            <div
              className="numeral text-5xl"
              style={{ color: 'var(--color-signal)' }}
            >
              {job.score}
            </div>

            <div>
              <h2
                className="numeral mb-1 text-2xl"
                style={{ fontWeight: 500, letterSpacing: '-0.02em' }}
              >
                {job.title}
              </h2>
              <p className="mb-5 text-lg" style={{ color: 'var(--color-ink-soft)' }}>
                {job.company}
              </p>

              <p className="assessment mb-6">{job.assessment}</p>

              <dl className="mb-6 space-y-2 text-sm">
                <div className="flex gap-3">
                  <dt className="meta w-24 shrink-0 pt-0.5">Matches</dt>
                  <dd>{job.matched.join(', ')}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="meta w-24 shrink-0 pt-0.5">Watch for</dt>
                  <dd>{job.concerns.join('; ')}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="meta w-24 shrink-0 pt-0.5">Pay</dt>
                  <dd>
                    {job.pay}
                    {job.estimated && (
                      <span style={{ color: 'var(--color-ink-soft)' }}>
                        {' '}— estimated, not employer-stated
                      </span>
                    )}
                  </dd>
                </div>
              </dl>

              <div className="flex items-center gap-4">
                <button
                  className="px-4 py-2 text-sm"
                  style={{
                    fontFamily: 'var(--font-display)',
                    background: 'var(--color-ink)',
                    color: 'var(--color-paper)',
                  }}
                >
                  Draft a proposal
                </button>
                <button
                  className="text-sm underline underline-offset-4"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-ink-soft)',
                  }}
                >
                  Not interested
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}