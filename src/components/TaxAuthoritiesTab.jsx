import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { formatMillLevy } from '../format'

export function TaxAuthoritiesTab({ data }) {
  if (data.taxAuthorities.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
        No taxing authority information on file.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.taxAuthorities.map((authority) => {
        const total = authority.funds.reduce(
          (sum, f) => sum + f.millLevy + f.alternateMillLevy,
          0,
        )
        return (
          <details
            key={authority.id}
            className="group rounded-xl border border-slate-200 bg-white shadow-sm open:shadow-md"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3">
              <div>
                <p className="font-medium text-slate-900">{authority.name}</p>
                {authority.pointOfContact && (
                  <p className="text-sm text-slate-600">
                    {authority.pointOfContact}
                    {authority.contactPhone
                      ? ` · ${authority.contactPhone}`
                      : ''}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">
                  Total Mills: {formatMillLevy(total)}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="h-3 w-3 text-slate-500 transition group-open:rotate-180"
                />
              </div>
            </summary>
            <div className="border-t border-slate-100 px-5 py-3">
              {(authority.street || authority.street2) && (
                <p className="mb-3 text-sm text-slate-600">
                  {[authority.street, authority.street2]
                    .filter(Boolean)
                    .join(', ')}
                  , {authority.city} {authority.zipCode}
                </p>
              )}
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-sm font-medium uppercase tracking-wide text-slate-600">
                    <th className="py-1.5 pr-4">Fund</th>
                    <th className="py-1.5 pr-4">Mill Levy</th>
                    <th className="py-1.5 pr-4">Alternate Mill Levy</th>
                  </tr>
                </thead>
                <tbody>
                  {authority.funds.map((fund, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-1.5 pr-4">{fund.description}</td>
                      <td className="py-1.5 pr-4">
                        {formatMillLevy(fund.millLevy)}
                      </td>
                      <td className="py-1.5 pr-4">
                        {formatMillLevy(fund.alternateMillLevy)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )
      })}
    </div>
  )
}
