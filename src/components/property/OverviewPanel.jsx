import { formatCurrency, formatDate, getNeighborhoodLabel } from '../../format'

function classifyAssessedValues(rows) {
  let land = 0
  let improvements = 0
  let total = 0
  for (const row of rows) {
    total += row.actualValue
    if (row.abstractCodeDescription?.toUpperCase().includes('LAND')) {
      land += row.actualValue
    } else {
      improvements += row.actualValue
    }
  }
  return { land, improvements, total }
}

function buildActivityFeed(data) {
  const events = []

  for (const sale of data.sales) {
    events.push({
      date: sale.date,
      label: sale.price > 0 ? 'Sale Recorded' : 'Deed Recorded',
      detail: `${sale.deedType} — ${sale.grantor} → ${sale.grantee}${
        sale.price > 0 ? ` — ${formatCurrency(sale.price)}` : ''
      }`,
    })
  }

  for (const appeal of data.appeals) {
    events.push({
      date: `${appeal.taxYear}-06-30`,
      label: `Appeal ${appeal.decision ?? 'Filed'}`,
      detail: `Tax year ${appeal.taxYear} — Appeal #${appeal.appealNo}`,
    })
  }

  return events
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
}

export function OverviewPanel({ data }) {
  const primaryBuilding =
    data.buildings.find((b) => b.isPrimary) ?? data.buildings[0]
  const style = primaryBuilding?.styles?.[0]
  const landSegment = data.landSegments[0]

  const years = Array.from(
    new Set(data.valuesByAbstractCode.map((v) => v.taxYear)),
  )
    .sort((a, b) => b - a)
    .slice(0, 2)

  const activity = buildActivityFeed(data)

  const neighborhoodLabel = getNeighborhoodLabel(data)

  return (
    <div className="space-y-6">
      <Section title="Property Information">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          <Field label="Property Type" value={data.accountType} />
          <Field label="Year Built" value={style?.builtYear ?? '—'} />
          <Field
            label="Living Area"
            value={
              primaryBuilding
                ? `${primaryBuilding.squareFeet.toLocaleString()} sq ft`
                : '—'
            }
          />
          <Field
            label="Bedrooms"
            value={style?.bedroomCount != null ? String(style.bedroomCount) : '—'}
          />
          <Field
            label="Bathrooms"
            value={style?.bathroomCount != null ? String(style.bathroomCount) : '—'}
          />
          <Field
            label="Lot Size"
            value={landSegment ? `${landSegment.acres.toFixed(3)} acres` : '—'}
          />
          <Field label="Quality" value={primaryBuilding?.quality ?? '—'} />
          <Field label="Neighborhood" value={neighborhoodLabel} />
          <Field label="Tax District" value={data.taxDistrictNumber} />
          <Field
            label="Zoning"
            value={
              data.zoningCode
                ? `${data.zoningCode} — ${data.zoningCodeDescription ?? ''}`
                : '—'
            }
          />
          <Field label="Buildings" value={data.numberOfBuildings ?? '—'} />
        </dl>
        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-slate-600">
              Legal Description
            </p>
            <p className="text-sm text-slate-700">{data.legalDescription}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">
              Public Land Survey System (PLSS)
            </p>
            <p className="text-sm text-slate-700">
              Quarter: {data.quartersection ?? '—'} · Section:{' '}
              {data.section ?? '—'} · Township: {data.township ?? '—'} ·
              Range: {data.range ?? '—'}
            </p>
          </div>
          {data.subdivision?.name && (
            <div>
              <p className="text-sm font-medium text-slate-600">
                Subdivision
              </p>
              <p className="text-sm text-slate-700">
                {data.subdivision.name}
                {data.subdivision.filingNumber
                  ? ` Filing ${data.subdivision.filingNumber}`
                  : ''}
                {data.subdivision.recordingNumber
                  ? ` · Recording #${data.subdivision.recordingNumber}`
                  : ''}
              </p>
            </div>
          )}
        </div>
      </Section>

      <Section title="Assessed Values">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {years.map((year, idx) => {
            const rows = data.valuesByAbstractCode.filter(
              (v) => v.taxYear === year,
            )
            const { land, improvements, total } = classifyAssessedValues(rows)
            const assessedTotal = rows.reduce(
              (s, r) => s + r.assessedValue,
              0,
            )
            const schoolAssessedTotal = rows.reduce(
              (s, r) => s + r.alternateAssessedValue,
              0,
            )
            return (
              <div
                key={year}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
                  {year} {idx === 0 ? '(Current)' : ''}
                </p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Land</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(land)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Improvements</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(improvements)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-1.5 font-semibold">
                    <span className="text-slate-700">Total Actual</span>
                    <span className="text-slate-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Assessed Value</span>
                    <span>{formatCurrency(assessedTotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>School Assessed Value</span>
                    <span>{formatCurrency(schoolAssessedTotal)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      <Section title="Recent Activity">
        {activity.length === 0 ? (
          <p className="text-sm text-slate-600">No recent activity on file.</p>
        ) : (
          <ul className="space-y-3">
            {activity.map((event, idx) => (
              <li key={idx} className="flex gap-3 text-sm">
                <span className="mt-1 h-2 w-2 flex-none rounded-full bg-teal-600" />
                <div>
                  <p className="font-medium text-slate-900">
                    {event.label}{' '}
                    <span className="font-normal text-slate-500">
                      · {formatDate(event.date)}
                    </span>
                  </p>
                  <p className="text-slate-600">{event.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600">
        {title}
      </h2>
      {children}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-sm font-medium text-slate-600">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  )
}
