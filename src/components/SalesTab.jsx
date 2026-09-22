import { formatCurrency, formatDate } from '../format'

export function SalesTab({ data }) {
  if (data.sales.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
        No sales history on file for this parcel.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-sm font-medium uppercase tracking-wide text-slate-600">
              <th className="py-2 pr-4">Sale Date</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Instrument</th>
              <th className="py-2 pr-4">Grantor (Seller)</th>
              <th className="py-2 pr-4">Grantee (Buyer)</th>
              <th className="py-2 pr-4">Document Number</th>
              <th className="py-2 pr-4">Qualified</th>
            </tr>
          </thead>
          <tbody>
            {data.sales
              .slice()
              .sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((sale) => (
                <tr
                  key={sale.recordingNumber}
                  className="border-b border-slate-100 last:border-0 align-top"
                >
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {formatDate(sale.date)}
                  </td>
                  <td className="py-2 pr-4 font-medium text-slate-900">
                    {sale.price > 0 ? formatCurrency(sale.price) : '—'}
                  </td>
                  <td className="py-2 pr-4">{sale.deedType}</td>
                  <td className="py-2 pr-4">{sale.grantor}</td>
                  <td className="py-2 pr-4">{sale.grantee}</td>
                  <td className="py-2 pr-4">{sale.recordingNumber}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium ${
                        sale.isValid1
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {sale.isValid1 ? 'Qualified' : 'Not Qualified'}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
