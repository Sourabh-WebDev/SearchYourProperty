import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { formatCurrency, formatZip, getNeighborhoodLabel } from '../../format'
import { PropertyStatsRow } from '../property/PropertyStatsRow'
import { HouseThumbnail } from '../common/HouseThumbnail'

function buildExtraDetailsLine(data, style, primaryBuilding) {
  const parts = [
    style?.builtYear ? `Built ${style.builtYear}` : null,
    primaryBuilding?.quality ? `${primaryBuilding.quality} quality` : null,
    `Nbhd ${getNeighborhoodLabel(data)}`,
    `Tax Dist ${data.taxDistrictNumber}`,
    data.zoningCode ? `Zoning ${data.zoningCode}` : null,
    data.numberOfBuildings ? `${data.numberOfBuildings} bldg` : null,
    data.legalDescription,
    `PLSS ${data.quartersection ?? '—'}/${data.section ?? '—'}/${data.township ?? '—'}/${data.range ?? '—'}`,
    data.subdivision?.name
      ? `${data.subdivision.name}${
          data.subdivision.filingNumber
            ? ` Filing ${data.subdivision.filingNumber}`
            : ''
        }`
      : null,
  ].filter(Boolean)

  return parts.join(' · ')
}

export function PropertyResultCard({ data, year }) {
  const situs = data.addresses.find((a) => a.isPrimary) ?? data.addresses[0]
  const primaryOwner = data.owners.find((o) => o.isPrimary) ?? data.owners[0]
  const primaryBuilding =
    data.buildings.find((b) => b.isPrimary) ?? data.buildings[0]
  const style = primaryBuilding?.styles?.[0]
  const landSegment = data.landSegments[0]
  const yearTotals = data.valuesByAbstractCode.filter((v) => v.taxYear === year)
  const totalActual = yearTotals.reduce((sum, v) => sum + v.actualValue, 0)
  const extraDetails = buildExtraDetailsLine(data, style, primaryBuilding)

  return (
    <Link
      to={`/property/${data.accountNumber}/${year}`}
      className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-md"
    >
      <HouseThumbnail className="h-20 w-28" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-slate-900">
              {situs ? situs.street.trim() : 'Address on file'}
            </p>
            <p className="text-sm text-slate-600">
              {situs ? `${situs.city}, CO ${formatZip(situs.zipCode)}` : ''}
            </p>
          </div>
          {totalActual > 0 && (
            <p className="text-sm font-semibold text-slate-900">
              {formatCurrency(totalActual)}
            </p>
          )}
        </div>

        <p className="mt-1 text-sm text-slate-600">
          Account No: {data.accountNumber} &nbsp; Parcel ID: {data.stateParcelNumber}
        </p>
        {primaryOwner && (
          <p className="truncate text-sm text-slate-600" title={primaryOwner.name}>
            Owner: <span className="font-medium text-slate-700">{primaryOwner.name}</span>
          </p>
        )}
        <p className="text-sm text-slate-500">
          {data.accountType}
          {style ? ` (${style.styleCodeDescription})` : ''}
        </p>

        <PropertyStatsRow
          className="mt-2"
          primaryBuilding={primaryBuilding}
          style={style}
          landSegment={landSegment}
        />

        <p
          className="mt-1 truncate text-sm leading-tight text-slate-500"
          title={extraDetails}
        >
          {extraDetails}
        </p>
      </div>

      <FontAwesomeIcon
        icon={faChevronRight}
        className="h-4 w-4 flex-none self-center text-slate-400 transition group-hover:text-emerald-600"
      />
    </Link>
  )
}
