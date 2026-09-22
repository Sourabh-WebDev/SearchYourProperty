import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPrint } from '@fortawesome/free-solid-svg-icons'
import { fetchPropertyDetail, PropertyNotFoundError } from '../api'
import {
  formatCurrency,
  formatMillLevy,
  formatNumber,
  formatPercent,
  formatDate,
  formatZip,
  getNeighborhoodLabel,
} from '../format'
import { LocationMap } from '../components/LocationMap'
import { HouseThumbnail } from '../components/common/HouseThumbnail'
import { OverviewPanel } from '../components/property/OverviewPanel'
import { OwnershipPanel } from '../components/property/OwnershipPanel'
import { ComparableSalesPanel } from '../components/property/ComparableSalesPanel'
import { MapPanel } from '../components/property/MapPanel'
import { DocumentsPanel } from '../components/property/DocumentsPanel'

const PRINT_SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'property-details', label: 'Property Details' },
  { key: 'ownership', label: 'Ownership' },
  { key: 'sales-history', label: 'Sales History' },
  { key: 'comparable-sales', label: 'Comparable Sales' },
  { key: 'map', label: 'Map' },
  { key: 'documents', label: 'Documents' },
]

function formatParcelNumber(raw) {
  if (!raw) return '—'
  const groups = [4, 3, 2, 3]
  let i = 0
  const parts = []
  for (const len of groups) {
    parts.push(raw.slice(i, i + len))
    i += len
  }
  return parts.filter(Boolean).join('-')
}

function buildValuationRows(data) {
  const years = Array.from(
    new Set(data.valuesByAbstractCode.map((v) => v.taxYear)),
  ).sort((a, b) => b - a)

  return years.map((year) => {
    const rows = data.valuesByAbstractCode.filter((v) => v.taxYear === year)
    const actualValue = rows.reduce((s, r) => s + r.actualValue, 0)
    const assessedValue = rows.reduce((s, r) => s + r.assessedValue, 0)
    const schoolAssessedValue = rows.reduce(
      (s, r) => s + r.alternateAssessedValue,
      0,
    )
    const totalMills = (rows[0]?.millLevy ?? 0) + (rows[0]?.alternateMillLevy ?? 0)
    const estTax = rows.reduce((s, r) => s + r.taxDollars + r.alternateTaxDollars, 0)
    return { year, actualValue, assessedValue, schoolAssessedValue, totalMills, estTax }
  })
}

function buildTaxAuthorityRows(data, valuationRows) {
  const current = valuationRows[0]
  const assessedValue = current?.assessedValue ?? 0
  const schoolAssessedValue = current?.schoolAssessedValue ?? 0

  const rows = data.taxAuthorities
    .map((authority) => {
      const mills = authority.funds.reduce(
        (s, f) => s + f.millLevy + f.alternateMillLevy,
        0,
      )
      const estTax = authority.funds.reduce(
        (s, f) =>
          s + (f.millLevy * assessedValue + f.alternateMillLevy * schoolAssessedValue) / 1000,
        0,
      )
      return { id: authority.id, name: authority.name, mills, estTax }
    })
    .sort((a, b) => b.mills - a.mills)

  return {
    rows,
    totalMills: rows.reduce((s, r) => s + r.mills, 0),
    totalTax: rows.reduce((s, r) => s + r.estTax, 0),
  }
}

function deriveBuildingFacts(building, data, year) {
  const style = building.styles?.[0]
  const details = building.details ?? []
  const basement = details.find((d) => d.type === 'Basement' && /conc/i.test(d.subtype))
  const finishedBsmt = details.find((d) => d.type === 'Basement' && d.subtype === 'Finished')
  const walkout = details.some((d) => d.type === 'Basement' && d.subtype === 'Walkout')
  const garageAttached = details.find((d) => d.type === 'Garage' && d.subtype === 'Attached')
  const garageDetached = details.find((d) => d.type === 'Garage' && d.subtype === 'Detached')
  const porchRows = details.filter((d) => d.type === 'Porch')
  const porchTotal = porchRows.reduce((s, d) => s + d.unitCount, 0)
  const fireplaces = details
    .filter((d) => d.type === 'Add On' && /fireplace/i.test(d.subtype))
    .reduce((s, d) => s + d.unitCount, 0)
  const additionalFeatures = details
    .filter((d) => d.type === 'Add On')
    .map((d) => d.addonCodeDescription ?? d.subtype)
  const fixtures = details.filter((d) => d.type === 'Fixture').map((d) => d.subtype)
  const finishedBsmtArea = finishedBsmt?.unitCount ?? 0
  const basementArea = basement?.unitCount ?? 0
  const totalFinishedArea = (building.squareFeet ?? 0) + finishedBsmtArea
  const finishedPercent = basementArea ? finishedBsmtArea / basementArea : null

  const abstractRow =
    data.valuesByAbstractCode.find(
      (v) => v.taxYear === Number(year) && !/LAND/i.test(v.abstractCodeDescription ?? ''),
    ) ?? data.valuesByAbstractCode.find((v) => !/LAND/i.test(v.abstractCodeDescription ?? ''))

  return {
    style,
    walkout,
    garageAttached,
    garageDetached,
    porchRows,
    porchTotal,
    fireplaces,
    additionalFeatures,
    fixtures,
    finishedBsmtArea,
    basementArea,
    finishedPercent,
    totalFinishedArea,
    abstractRow,
    use: building.uses?.[0],
  }
}

export function PrintPreviewPage() {
  const { account, year } = useParams()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedKeys, setSelectedKeys] = useState(
    () => new Set(PRINT_SECTIONS.map((s) => s.key)),
  )

  function toggleSection(key) {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setData(null)

    fetchPropertyDetail(account, Number(year))
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (cancelled) return
        setError(
          err instanceof PropertyNotFoundError
            ? err.message
            : 'Something went wrong while looking up this property.',
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [account, year])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-slate-600">
        Loading property details…
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error ?? 'Property not found.'}{' '}
        <Link to="/" className="font-medium underline">
          Try another search
        </Link>
      </div>
    )
  }

  const situs = data.addresses.find((a) => a.isPrimary) ?? data.addresses[0]
  const owner = data.owners.find((o) => o.isPrimary) ?? data.owners[0]
  const valuationRows = buildValuationRows(data)
  const { rows: authorityRows, totalMills: authorityTotalMills, totalTax: authorityTotalTax } =
    buildTaxAuthorityRows(data, valuationRows)
  const sortedSales = data.sales
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const show = (key) => selectedKeys.has(key)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <Link
          to={`/property/${account}/${year}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
          Back to Property
        </Link>
        <h1 className="text-sm font-semibold text-slate-700">Print Preview</h1>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <div
            id="printable-report"
            className="print-plain space-y-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-slate-800"
          >
            {/* Header: identification, owner, photo, map */}
            <div>
              <p className="text-sm text-slate-600">Displaying data for the year {year}</p>
              <h1 className="text-2xl font-bold text-slate-900">
                {situs ? situs.street.trim() : `Account ${data.accountNumber}`}
              </h1>
              <p className="text-sm text-slate-700">
                {situs ? `${situs.city}, CO ${formatZip(situs.zipCode)}` : ''}
              </p>

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Ownership Information</p>
                  <p className="text-sm text-slate-700">{owner?.name ?? '—'}</p>
                  {owner?.mailingAddress && (
                    <>
                      <p className="text-sm text-slate-700">{owner.mailingAddress.street}</p>
                      <p className="text-sm text-slate-700">
                        {owner.mailingAddress.city}, {owner.mailingAddress.state}{' '}
                        {owner.mailingAddress.zipCode?.slice(0, 5)}
                      </p>
                    </>
                  )}
                </div>
                <HouseThumbnail className="h-40 w-full sm:w-80" />
              </div>

              {data.latitude && data.longitude && (
                <div className="mt-4">
                  <LocationMap
                    latitude={data.latitude}
                    longitude={data.longitude}
                    label={situs ? situs.street.trim() : data.accountNumber}
                    heightClassName="h-80"
                  />
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-slate-200 pt-4 text-sm sm:grid-cols-2">
                <div className="space-y-3">
                  <InfoRow label="Account #" value={data.accountNumber} />
                  <InfoRow label="State Parcel #" value={formatParcelNumber(data.stateParcelNumber)} />
                  <InfoRow label="Account Type" value={data.accountType} />
                  <InfoRow label="Tax District" value={data.taxDistrictNumber} />
                  <InfoRow label="Neighborhood-Ext" value={getNeighborhoodLabel(data)} />

                  <div>
                    <p className="font-bold text-slate-900">Owner Info</p>
                    <p>{owner?.name ?? '—'}</p>
                    {owner?.mailingAddress && (
                      <>
                        <p>{owner.mailingAddress.street}</p>
                        <p>
                          {owner.mailingAddress.city}, {owner.mailingAddress.state}{' '}
                          {owner.mailingAddress.zipCode?.slice(0, 5)}
                        </p>
                      </>
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      Public Land Survey System (PLSS) Location
                    </p>
                    <p>
                      Quarter: {data.quartersection ?? '—'}; Section: {data.section ?? '—'};
                      Township: {data.township ?? '—'}; Range: {data.range ?? '—'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <InfoRow label="Building Count" value={data.numberOfBuildings ?? '—'} />

                  {data.buildingPermitAuthority && (
                    <div>
                      <p className="font-bold text-slate-900">Building Permit Authority</p>
                      <p>{data.buildingPermitAuthority.name}</p>
                      <p>Phone: {data.buildingPermitAuthority.phone}</p>
                    </div>
                  )}

                  {data.subdivision?.name && (
                    <div>
                      <p className="font-bold text-slate-900">Subdivision</p>
                      <p>Name: {data.subdivision.name}</p>
                      <p>Reception No: {data.subdivision.recordingNumber ?? '—'}</p>
                    </div>
                  )}

                  <div>
                    <p className="font-bold text-slate-900">Location Description</p>
                    <p>{data.legalDescription}</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">Disclaimer</p>
                    <p className="text-slate-600">
                      The location description may not be a complete legal description of the
                      property.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {show('overview') && (
              <section>
                <SectionHeading>Overview</SectionHeading>
                <OverviewPanel data={data} />
              </section>
            )}

            {show('property-details') && (
              <section>
                <SectionHeading>Property Details</SectionHeading>

                <SubHeading>Valuation Info</SubHeading>
                <table className="mb-6 w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-300 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                      <th className="py-2 pr-4">Year</th>
                      <th className="py-2 pr-4">Actual Value</th>
                      <th className="py-2 pr-4">Assessed Value</th>
                      <th className="py-2 pr-4">School Assessed Value</th>
                      <th className="py-2 pr-4">Total Mills</th>
                      <th className="py-2 pr-4">Est. Tax Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {valuationRows.map((row) => (
                      <tr key={row.year} className="border-b border-slate-100">
                        <td className="py-2 pr-4 font-medium text-slate-900">{row.year}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.actualValue)}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.assessedValue)}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.schoolAssessedValue)}</td>
                        <td className="py-2 pr-4">{formatMillLevy(row.totalMills)}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.estTax)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <SubHeading>Building Details</SubHeading>
                {data.buildings.length === 0 ? (
                  <p className="text-sm text-slate-600">No building records on file.</p>
                ) : (
                  <div className="space-y-6">
                    {data.buildings.map((building) => {
                      const f = deriveBuildingFacts(building, data, year)
                      return (
                        <div key={building.buildingNumber}>
                          <p className="mb-2 text-sm font-bold text-slate-900">
                            Building {building.buildingNumber}
                          </p>
                          <div className="grid grid-cols-1 gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
                            <InfoRow label="Property Type" value={building.propertyType} />
                            <InfoRow
                              label="Building Use"
                              value={f.use?.useCodeDescription ?? '—'}
                            />
                            <InfoRow label="Year Built" value={f.style?.builtYear ?? '—'} />
                            <InfoRow
                              label="Building Use %"
                              value={formatPercent(f.use?.usePercentage)}
                            />
                            <InfoRow label="Quality" value={building.quality ?? '—'} />
                            <InfoRow
                              label="Actual Value"
                              value={formatCurrency(f.abstractRow?.actualValue)}
                            />
                            <InfoRow
                              label="% Complete"
                              value={formatPercent(building.completedPercent)}
                            />
                            <InfoRow label="Class Code" value={f.abstractRow?.abstractCode ?? '—'} />
                            <InfoRow label="Style" value={f.style?.styleCodeDescription ?? '—'} />
                            <InfoRow
                              label="Class Code Description"
                              value={f.abstractRow?.abstractCodeDescription ?? '—'}
                            />
                            <InfoRow label="Stories" value={f.style?.numberOfStories ?? '—'} />
                            <InfoRow
                              label="Square Footage"
                              value={`${formatNumber(building.squareFeet)} sqft`}
                            />
                            <InfoRow
                              label="Bedrooms (above ground)"
                              value={f.style?.bedroomCount ?? '—'}
                            />
                            <InfoRow
                              label="Basement Area"
                              value={f.basementArea ? `${formatNumber(f.basementArea)} sqft` : '—'}
                            />
                            <InfoRow
                              label="Bathrooms (above ground)"
                              value={f.style?.bathroomCount ?? '—'}
                            />
                            <InfoRow
                              label="Finished Bsmt. Area"
                              value={
                                f.finishedBsmtArea
                                  ? `${formatNumber(f.finishedBsmtArea)} sqft${
                                      f.finishedPercent != null
                                        ? ` (${Math.round(f.finishedPercent * 100)}%)`
                                        : ''
                                    }`
                                  : '—'
                              }
                            />
                            <InfoRow label="Interior" value={f.style?.interiorFinishType ?? '—'} />
                            <InfoRow
                              label="Total Finished Area"
                              value={`${formatNumber(f.totalFinishedArea)} sqft`}
                            />
                            <InfoRow label="Exterior" value={f.style?.exteriorConstructionType ?? '—'} />
                            <InfoRow
                              label="Porch/Deck Area"
                              value={f.porchTotal ? `${formatNumber(f.porchTotal)} sqft` : '—'}
                            />
                            <InfoRow label="Roofing" value={f.style?.roofMaterialType ?? '—'} />
                            <InfoRow
                              label="Garage — Attached"
                              value={
                                f.garageAttached
                                  ? `${formatNumber(f.garageAttached.unitCount)} sqft`
                                  : '—'
                              }
                            />
                            <InfoRow label="Heating" value={f.style?.heatType ?? '—'} />
                            <InfoRow
                              label="Garage — Detached"
                              value={
                                f.garageDetached
                                  ? `${formatNumber(f.garageDetached.unitCount)} sqft`
                                  : '0 sqft'
                              }
                            />
                            <InfoRow
                              label="Additional Features"
                              value={
                                f.additionalFeatures.length > 0
                                  ? f.additionalFeatures.join(', ')
                                  : '—'
                              }
                            />
                            <InfoRow label="Walkout" value={f.walkout ? 'Y' : '—'} />
                            <InfoRow label="Fireplaces" value={f.fireplaces || '—'} />
                          </div>

                          {f.porchRows.length > 0 && (
                            <div className="mt-3">
                              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-600">
                                Porch / Deck Details
                              </p>
                              <table className="w-full max-w-md border-collapse text-sm">
                                <tbody>
                                  {f.porchRows.map((p, idx) => (
                                    <tr key={idx} className="border-b border-slate-100">
                                      <td className="py-1 pr-4">{p.type}</td>
                                      <td className="py-1 pr-4">{p.subtype}</td>
                                      <td className="py-1 pr-4">{formatNumber(p.unitCount)} sqft</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {f.fixtures.length > 0 && (
                            <p className="mt-3 text-sm">
                              <span className="font-semibold text-slate-700">Fixtures: </span>
                              {f.fixtures.join(', ')}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                <SubHeading>Land Details</SubHeading>
                {data.landSegments.map((seg, idx) => (
                  <div key={idx} className="grid grid-cols-1 gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
                    <InfoRow label="Land Type" value={seg.type} />
                    <InfoRow label="Acreage" value={`${seg.acres.toFixed(3)} acres`} />
                    <InfoRow label="Class Code" value={seg.abstractCode} />
                    <InfoRow label="Land Valuation — Actual Value" value={formatCurrency(seg.actualValue)} />
                    <InfoRow label="Class Code Descr." value={seg.abstractCodeDescription} />
                  </div>
                ))}
                {data.landAttributes.length > 0 && (
                  <p className="mt-3 mb-6 text-sm">
                    <span className="font-semibold text-slate-700">Land Attributes: </span>
                    {data.landAttributes.map((a) => a.attributeTypeDescription).join(', ')}
                  </p>
                )}

                <SubHeading>Tax Authorities</SubHeading>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-300 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">Authority Name</th>
                      <th className="py-2 pr-4">Mills</th>
                      <th className="py-2 pr-4">Est. Tax Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authorityRows.map((row) => (
                      <tr key={row.id} className="border-b border-slate-100">
                        <td className="py-2 pr-4">{row.id}</td>
                        <td className="py-2 pr-4">{row.name}</td>
                        <td className="py-2 pr-4">{formatMillLevy(row.mills)}</td>
                        <td className="py-2 pr-4">{formatCurrency(row.estTax)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 font-semibold text-slate-900">
                      <td className="py-2 pr-4" colSpan={2}>
                        Total: {authorityRows.length} Authorities
                      </td>
                      <td className="py-2 pr-4">{formatMillLevy(authorityTotalMills)}</td>
                      <td className="py-2 pr-4">{formatCurrency(authorityTotalTax)}</td>
                    </tr>
                  </tfoot>
                </table>
              </section>
            )}

            {show('ownership') && (
              <section>
                <SectionHeading>Ownership</SectionHeading>
                <OwnershipPanel data={data} />
              </section>
            )}

            {show('sales-history') && (
              <section>
                <SectionHeading>Sales History</SectionHeading>
                {sortedSales.length === 0 ? (
                  <p className="text-sm text-slate-600">No sales history on file.</p>
                ) : (
                  <>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-300 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                          <th className="py-2 pr-4">Reception No.</th>
                          <th className="py-2 pr-4">Sale Date</th>
                          <th className="py-2 pr-4">Sale Price</th>
                          <th className="py-2 pr-4">Deed Type</th>
                          <th className="py-2 pr-4">Grantor</th>
                          <th className="py-2 pr-4">Grantee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedSales.map((sale) => (
                          <tr key={sale.recordingNumber} className="border-b border-slate-100 align-top">
                            <td className="py-2 pr-4">{sale.recordingNumber}</td>
                            <td className="py-2 pr-4 whitespace-nowrap">{formatDate(sale.date)}</td>
                            <td className="py-2 pr-4">{formatCurrency(sale.price)}</td>
                            <td className="py-2 pr-4">{sale.deedType}</td>
                            <td className="py-2 pr-4">{sale.grantor}</td>
                            <td className="py-2 pr-4">{sale.grantee}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-2 text-sm text-slate-600">
                      The transaction history may not be a complete history of transfer and
                      ownership records.
                    </p>
                  </>
                )}
              </section>
            )}

            {show('comparable-sales') && (
              <section>
                <SectionHeading>Comparable Sales</SectionHeading>
                <ComparableSalesPanel data={data} />
              </section>
            )}

            {show('map') && (
              <section>
                <SectionHeading>Map</SectionHeading>
                <MapPanel data={data} />
              </section>
            )}

            {show('documents') && (
              <section>
                <SectionHeading>Documents</SectionHeading>
                <DocumentsPanel accountNumber={data.accountNumber} />
              </section>
            )}

            {data.notifications.length > 0 && (
              <section>
                <SectionHeading>Notifications</SectionHeading>
                <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
                  {data.notifications.map((n) => (
                    <li key={n.id}>{n.note}</li>
                  ))}
                </ol>
              </section>
            )}

            {selectedKeys.size === 0 && (
              <p className="text-sm text-slate-600">
                No sections selected. Choose at least one section from the panel to build a
                print preview.
              </p>
            )}
          </div>
        </div>

        <aside className="w-full flex-none print:hidden lg:sticky lg:top-4 lg:w-72">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Choose sections to print
            </p>
            <div className="space-y-2">
              {PRINT_SECTIONS.map((section) => (
                <label
                  key={section.key}
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedKeys.has(section.key)}
                    onChange={() => toggleSection(section.key)}
                    className="h-3.5 w-3.5 accent-teal-700"
                  />
                  {section.label}
                </label>
              ))}
            </div>

            <div className="mt-3 flex gap-3 border-t border-slate-100 pt-3 text-sm font-medium text-teal-700">
              <button
                type="button"
                onClick={() => setSelectedKeys(new Set(PRINT_SECTIONS.map((s) => s.key)))}
                className="hover:underline"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => setSelectedKeys(new Set())}
                className="hover:underline"
              >
                Deselect all
              </button>
            </div>

            <button
              type="button"
              disabled={selectedKeys.size === 0}
              onClick={() => window.print()}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FontAwesomeIcon icon={faPrint} className="h-3.5 w-3.5" />
              Print
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

function SectionHeading({ children }) {
  return (
    <h2 className="mb-3 border-b-2 border-teal-700 pb-1 text-base font-bold text-slate-900">
      {children}
    </h2>
  )
}

function SubHeading({ children }) {
  return (
    <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-600">
      {children}
    </h3>
  )
}

function InfoRow({ label, value }) {
  return (
    <p>
      <span className="text-slate-600">{label}: </span>
      <span className="font-medium text-slate-900">{value ?? '—'}</span>
    </p>
  )
}
