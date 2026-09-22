import { formatCurrency } from '../format'

export function LandTab({ data }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
          Land Segments
        </h2>
        {data.landSegments.length === 0 ? (
          <p className="text-sm text-slate-600">No land segments on file.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-sm font-medium uppercase tracking-wide text-slate-600">
                  <th className="py-2 pr-4">Abstract Code</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Acres</th>
                  <th className="py-2 pr-4">Actual Value</th>
                </tr>
              </thead>
              <tbody>
                {data.landSegments.map((seg, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-2 pr-4">
                      <span className="font-medium text-slate-900">
                        {seg.abstractCode}
                      </span>{' '}
                      <span className="text-slate-600">
                        {seg.abstractCodeDescription}
                      </span>
                    </td>
                    <td className="py-2 pr-4">{seg.type}</td>
                    <td className="py-2 pr-4">{seg.acres.toFixed(3)}</td>
                    <td className="py-2 pr-4">
                      {formatCurrency(seg.actualValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
          Land Attributes / Adjustments
        </h2>
        {data.landAttributes.length === 0 ? (
          <p className="text-sm text-slate-600">
            No land attributes on file.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {data.landAttributes.map((attr) => (
              <li
                key={attr.attributeType}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="text-slate-700">
                  {attr.attributeTypeDescription}
                </span>
                <span className="font-medium text-slate-900">
                  ×{attr.attributeAdjustment.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {data.buildingPermitAuthority && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Building Permit Authority
          </h2>
          <p className="font-medium text-slate-900">
            {data.buildingPermitAuthority.name}
          </p>
          <p className="text-sm text-slate-600">
            {data.buildingPermitAuthority.street},{' '}
            {data.buildingPermitAuthority.city}{' '}
            {data.buildingPermitAuthority.zipCode}
          </p>
          <p className="text-sm text-slate-600">
            {data.buildingPermitAuthority.phone}
          </p>
          {data.buildingPermitAuthority.url && (
            <a
              href={data.buildingPermitAuthority.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-teal-700 hover:underline"
            >
              {data.buildingPermitAuthority.url}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
