import { formatCurrency, formatDate, formatZip } from '../../format'

export function OwnershipPanel({ data }) {
  const chain = data.sales
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600">
          Current Owner{data.owners.length > 1 ? 's' : ''}
        </h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {data.owners.map((owner) => (
            <div key={owner.name}>
              <dt className="text-sm font-medium text-slate-600">
                {owner.isPrimary ? 'Primary Owner' : 'Owner'}
              </dt>
              <dd className="font-medium text-slate-900">{owner.name}</dd>
              <dd className="text-sm text-slate-600">
                {owner.mailingAddress.street}
                {owner.mailingAddress.street2
                  ? `, ${owner.mailingAddress.street2}`
                  : ''}
                <br />
                {owner.mailingAddress.city}, {owner.mailingAddress.state}{' '}
                {formatZip(owner.mailingAddress.zipCode)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600">
          Ownership Chain
        </h2>
        {chain.length === 0 ? (
          <p className="text-sm text-slate-600">No recorded transfers on file.</p>
        ) : (
          <ol className="space-y-4 border-l-2 border-slate-100 pl-4">
            {chain.map((sale) => (
              <li key={sale.recordingNumber} className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-teal-600" />
                <p className="text-sm font-medium text-slate-900">
                  {sale.grantor} <span className="text-slate-500">→</span>{' '}
                  {sale.grantee}
                </p>
                <p className="text-sm text-slate-600">
                  {formatDate(sale.date)} · {sale.deedType}
                  {sale.price > 0 ? ` · ${formatCurrency(sale.price)}` : ''} ·
                  Rec# {sale.recordingNumber}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600">
          Appeal History
        </h2>
        {data.appeals.length === 0 ? (
          <p className="text-sm text-slate-600">No appeals on file.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-sm font-medium uppercase tracking-wide text-slate-600">
                  <th className="py-2 pr-4">Tax Year</th>
                  <th className="py-2 pr-4">Appeal #</th>
                  <th className="py-2 pr-4">Decision</th>
                  <th className="py-2 pr-4">Reason</th>
                </tr>
              </thead>
              <tbody>
                {data.appeals.map((appeal) => (
                  <tr
                    key={appeal.appealNo}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-2 pr-4">{appeal.taxYear}</td>
                    <td className="py-2 pr-4">{appeal.appealNo}</td>
                    <td className="py-2 pr-4">{appeal.decision ?? '—'}</td>
                    <td className="py-2 pr-4">{appeal.reason ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
