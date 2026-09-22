import { Link } from 'react-router-dom'

const GETTING_STARTED = [
  {
    title: 'Search for a Property',
    description:
      'Use the Property Search page and enter an account or parcel number, e.g. R0601732.',
    to: '/',
  },
  {
    title: 'Reading Assessed Values',
    description:
      'The Overview tab breaks down land vs. improvement value and shows the current vs. prior year side by side.',
  },
  {
    title: 'Understanding Sales History',
    description:
      'Sales History lists every recorded deed transfer, including grantor, grantee, and recording number. "Not Qualified" sales are excluded from market-value analysis (e.g. transfers between family, trusts, or for $0).',
  },
  {
    title: 'Taxing Authorities & Mill Levies',
    description:
      'The Property Details tab lists every taxing district covering the parcel and the mill levy each one certifies.',
  },
]

const FAQS = [
  {
    q: 'Where does this data come from?',
    a: 'This is a demo app that ships with a small set of sample properties stored locally — it does not fetch live data from any county or government system.',
  },
  {
    q: 'Why are current-year values marked as estimates?',
    a: 'The sample data mirrors how a real county assessor labels current-year figures: actual values are typically published every May 1st, but assessment rates and mill levies aren’t finalized until later in the year, so current-year taxes are shown as estimates.',
  },
  {
    q: 'Can I search by address or owner name?',
    a: 'Not yet — search currently supports account/parcel number only, and only for the sample properties included in this demo.',
  },
]

export function HelpPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Getting Started
          </h1>
          <ul className="mt-4 divide-y divide-slate-100">
            {GETTING_STARTED.map((item) => (
              <li key={item.title} className="py-3">
                {item.to ? (
                  <Link to={item.to} className="text-sm font-semibold text-teal-700 hover:underline">
                    {item.title}
                  </Link>
                ) : (
                  <p className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </p>
                )}
                <p className="mt-0.5 text-sm text-slate-600">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-4 space-y-4">
            {FAQS.map((item) => (
              <div key={item.q}>
                <p className="text-sm font-semibold text-slate-900">
                  {item.q}
                </p>
                <p className="mt-0.5 text-sm text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          About This Demo
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          SearchYourProperty is a sample application built to demonstrate a
          property-lookup experience. It isn't affiliated with any county or
          government agency, and the data shown is a small, locally-stored
          sample set — not a live public-records feed.
        </p>
      </aside>
    </div>
  )
}
