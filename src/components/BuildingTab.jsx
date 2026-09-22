import { formatNumber, formatPercent } from '../format'

export function BuildingTab({ data }) {
  if (data.buildings.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
        No building records on file for this parcel.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {data.buildings.map((building) => {
        const style = building.styles[0]
        return (
          <div
            key={building.buildingNumber}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Building {building.buildingNumber} — {building.propertyType}
                {building.isPrimary ? ' (Primary)' : ''}
              </h2>
              <span className="text-sm text-slate-600">
                Quality:{' '}
                <span className="font-medium text-slate-900">
                  {building.quality ?? '—'}
                </span>
              </span>
            </div>

            {style && (
              <dl className="mb-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                <Field label="Style" value={style.styleCodeDescription} />
                <Field label="Year Built" value={style.builtYear ?? '—'} />
                <Field
                  label="Square Feet"
                  value={formatNumber(style.squareFeet)}
                />
                <Field
                  label="Stories"
                  value={
                    style.numberOfStories ? String(style.numberOfStories) : '—'
                  }
                />
                <Field
                  label="Bedrooms"
                  value={
                    style.bedroomCount !== null ? String(style.bedroomCount) : '—'
                  }
                />
                <Field
                  label="Bathrooms"
                  value={
                    style.bathroomCount !== null
                      ? String(style.bathroomCount)
                      : '—'
                  }
                />
                <Field label="Rooms" value={style.numberOfRooms ? String(style.numberOfRooms) : '—'} />
                <Field
                  label="Condition"
                  value={building.conditionType ?? '—'}
                />
                <Field
                  label="Exterior"
                  value={style.exteriorConstructionType ?? '—'}
                />
                <Field label="Roof" value={style.roofMaterialType ?? '—'} />
                <Field label="Heat" value={style.heatType ?? '—'} />
                <Field
                  label="Interior Finish"
                  value={style.interiorFinishType ?? '—'}
                />
              </dl>
            )}

            {building.uses.length > 0 && (
              <div className="mb-5">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
                  Use
                </h3>
                <ul className="space-y-1 text-sm text-slate-700">
                  {building.uses.map((use, idx) => (
                    <li key={idx}>
                      {use.useCodeDescription} —{' '}
                      {formatPercent(use.usePercentage)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {building.details.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
                  Features &amp; Additions
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-sm font-medium uppercase tracking-wide text-slate-600">
                        <th className="py-2 pr-4">Type</th>
                        <th className="py-2 pr-4">Description</th>
                        <th className="py-2 pr-4">Units</th>
                        <th className="py-2 pr-4">Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {building.details.map((d, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="py-2 pr-4">{d.type}</td>
                          <td className="py-2 pr-4">{d.subtype}</td>
                          <td className="py-2 pr-4">
                            {formatNumber(d.unitCount)}
                          </td>
                          <td className="py-2 pr-4">{d.builtYear ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )
      })}
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
