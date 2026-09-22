import { formatCurrency, formatMillLevy, formatPercent } from '../format'

export function ValueTab({ data }) {
  const years = Array.from(
    new Set(data.valuesByAbstractCode.map((v) => v.taxYear)),
  ).sort((a, b) => b - a)

  return (
    <div className="space-y-6">
      {years.map((year) => {
        const rows = data.valuesByAbstractCode.filter(
          (v) => v.taxYear === year,
        )
        const totalActual = rows.reduce((s, r) => s + r.actualValue, 0)
        const totalAssessed = rows.reduce((s, r) => s + r.assessedValue, 0)
        const totalSchoolAssessed = rows.reduce(
          (s, r) => s + r.alternateAssessedValue,
          0,
        )
        const totalTax = rows.reduce((s, r) => s + r.taxDollars, 0)
        const totalSchoolTax = rows.reduce(
          (s, r) => s + r.alternateTaxDollars,
          0,
        )

        return (
          <div
            key={year}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Tax Year {year}
              </h2>
              <span className="text-sm text-slate-600">
                Est. Combined Taxes:{' '}
                <span className="font-semibold text-slate-900">
                  {formatCurrency(totalTax + totalSchoolTax)}
                </span>
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-215 border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-sm font-medium uppercase tracking-wide text-slate-600">
                    <th className="py-2 pr-4">Abstract Code</th>
                    <th className="py-2 pr-4">Net Acres</th>
                    <th className="py-2 pr-4">Actual Value</th>
                    <th className="py-2 pr-4">Assessment Rate</th>
                    <th className="py-2 pr-4">Assessed Value</th>
                    <th className="py-2 pr-4">School Assessed Value</th>
                    <th className="py-2 pr-4">Mill Levy</th>
                    <th className="py-2 pr-4">Tax</th>
                    <th className="py-2 pr-4">School Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={`${row.abstractCode}-${idx}`}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-2 pr-4">
                        <span className="font-medium text-slate-900">
                          {row.abstractCode}
                        </span>{' '}
                        <span className="text-slate-600">
                          {row.abstractCodeDescription}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        {row.netAcres ? row.netAcres.toFixed(3) : '—'}
                      </td>
                      <td className="py-2 pr-4">
                        {formatCurrency(row.actualValue)}
                      </td>
                      <td className="py-2 pr-4">
                        {formatPercent(row.assessmentRate)}
                      </td>
                      <td className="py-2 pr-4">
                        {formatCurrency(row.assessedValue)}
                      </td>
                      <td className="py-2 pr-4">
                        {formatCurrency(row.alternateAssessedValue)}
                      </td>
                      <td className="py-2 pr-4">
                        {formatMillLevy(row.millLevy)}
                      </td>
                      <td className="py-2 pr-4">
                        {formatCurrency(row.taxDollars)}
                      </td>
                      <td className="py-2 pr-4">
                        {formatCurrency(row.alternateTaxDollars)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 font-semibold text-slate-900">
                    <td className="py-2 pr-4" colSpan={2}>
                      Total
                    </td>
                    <td className="py-2 pr-4">
                      {formatCurrency(totalActual)}
                    </td>
                    <td className="py-2 pr-4" />
                    <td className="py-2 pr-4">
                      {formatCurrency(totalAssessed)}
                    </td>
                    <td className="py-2 pr-4">
                      {formatCurrency(totalSchoolAssessed)}
                    </td>
                    <td className="py-2 pr-4" />
                    <td className="py-2 pr-4">{formatCurrency(totalTax)}</td>
                    <td className="py-2 pr-4">
                      {formatCurrency(totalSchoolTax)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
