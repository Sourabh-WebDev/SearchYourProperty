import { formatCurrency, formatDate, formatZip } from '../../format'

export function PrintableReport({ data, year }) {
  const situs = data.addresses.find((a) => a.isPrimary) ?? data.addresses[0]
  const owner = data.owners.find((o) => o.isPrimary) ?? data.owners[0]
  const primaryBuilding =
    data.buildings.find((b) => b.isPrimary) ?? data.buildings[0]
  const style = primaryBuilding?.styles?.[0]
  const landSegment = data.landSegments[0]
  const yearRows = data.valuesByAbstractCode.filter((v) => v.taxYear === year)
  const totalActual = yearRows.reduce((s, r) => s + r.actualValue, 0)
  const totalAssessed = yearRows.reduce((s, r) => s + r.assessedValue, 0)
  const totalSchoolAssessed = yearRows.reduce(
    (s, r) => s + r.alternateAssessedValue,
    0,
  )

  return (
    <div id="printable-report" className="hidden print:block">
      <div className="mb-4 flex items-center justify-between border-b-2 border-slate-900 pb-3">
        <div>
          <h1 className="text-xl font-bold">SearchYourProperty</h1>
          <p className="text-sm text-slate-600">
            Property Detail Report
          </p>
        </div>
        <p className="text-sm text-slate-600">
          Generated {formatDate(new Date().toISOString())}
        </p>
      </div>

      <h2 className="text-lg font-bold">
        {situs ? situs.street.trim() : `Account ${data.accountNumber}`}
      </h2>
      <p className="text-sm text-slate-600">
        {situs ? `${situs.city}, CO ${formatZip(situs.zipCode)}` : ''}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        Account No: {data.accountNumber} &nbsp; Parcel ID:{' '}
        {data.stateParcelNumber} &nbsp; Tax Year: {year}
      </p>

      <ReportSection title="Owner Information">
        <Row label="Owner" value={owner?.name ?? '—'} />
        <Row
          label="Mailing Address"
          value={
            owner
              ? `${owner.mailingAddress.street ?? ''}${owner.mailingAddress.street2 ? `, ${owner.mailingAddress.street2}` : ''}, ${owner.mailingAddress.city ?? ''}, ${owner.mailingAddress.state ?? ''} ${formatZip(owner.mailingAddress.zipCode)}`
              : '—'
          }
        />
      </ReportSection>

      <ReportSection title="Property Characteristics">
        <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
          <Row label="Property Type" value={data.accountType} />
          <Row label="Year Built" value={style?.builtYear ?? '—'} />
          <Row
            label="Living Area"
            value={
              primaryBuilding
                ? `${primaryBuilding.squareFeet.toLocaleString()} sq ft`
                : '—'
            }
          />
          <Row
            label="Bedrooms"
            value={style?.bedroomCount != null ? String(style.bedroomCount) : '—'}
          />
          <Row
            label="Bathrooms"
            value={style?.bathroomCount != null ? String(style.bathroomCount) : '—'}
          />
          <Row label="Quality" value={primaryBuilding?.quality ?? '—'} />
          <Row
            label="Lot Size"
            value={landSegment ? `${landSegment.acres.toFixed(3)} acres` : '—'}
          />
          <Row label="Tax District" value={data.taxDistrictNumber} />
          <Row label="Style" value={style?.styleCodeDescription ?? '—'} />
        </div>
        <p className="mt-2 text-sm text-slate-600">
          <span className="font-medium">Legal Description:</span>{' '}
          {data.legalDescription}
        </p>
      </ReportSection>

      <ReportSection title={`Assessed Values — Tax Year ${year}`}>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <Row label="Actual Value" value={formatCurrency(totalActual)} />
          <Row label="Assessed Value" value={formatCurrency(totalAssessed)} />
          <Row
            label="School Assessed Value"
            value={formatCurrency(totalSchoolAssessed)}
          />
        </div>
      </ReportSection>

      <ReportSection title="Sales History">
        {data.sales.length === 0 ? (
          <p className="text-sm text-slate-600">No sales on file.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-300 text-left uppercase text-slate-600">
                <th className="py-1 pr-3">Date</th>
                <th className="py-1 pr-3">Price</th>
                <th className="py-1 pr-3">Deed Type</th>
                <th className="py-1 pr-3">Grantor</th>
                <th className="py-1 pr-3">Grantee</th>
              </tr>
            </thead>
            <tbody>
              {data.sales
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .map((sale) => (
                  <tr key={sale.recordingNumber} className="border-b border-slate-100">
                    <td className="py-1 pr-3">{formatDate(sale.date)}</td>
                    <td className="py-1 pr-3">
                      {sale.price > 0 ? formatCurrency(sale.price) : '—'}
                    </td>
                    <td className="py-1 pr-3">{sale.deedType}</td>
                    <td className="py-1 pr-3">{sale.grantor}</td>
                    <td className="py-1 pr-3">{sale.grantee}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </ReportSection>

      <p className="mt-6 text-xs text-slate-500">
        Sample property data for demonstration purposes only. This report is
        generated for informational purposes and is not an official
        government document.
      </p>
    </div>
  )
}

function ReportSection({ title, children }) {
  return (
    <div className="mt-4 break-inside-avoid">
      <h3 className="mb-1.5 border-b border-slate-300 pb-1 text-sm font-semibold uppercase tracking-wide text-slate-700">
        {title}
      </h3>
      {children}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div>
      <dt className="text-sm text-slate-600">{label}</dt>
      <dd className="text-sm font-medium text-slate-900">{value}</dd>
    </div>
  )
}
