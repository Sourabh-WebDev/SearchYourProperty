import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpand } from '@fortawesome/free-solid-svg-icons'
import { PropertyStatsRow } from './PropertyStatsRow'
import { LocationMap } from '../LocationMap'
import { HouseThumbnail } from '../common/HouseThumbnail'
import { Modal } from '../common/Modal'
import { formatZip } from '../../format'

export function PropertySummaryBar({ data, year }) {
  const [mapExpanded, setMapExpanded] = useState(false)
  const situs = data.addresses.find((a) => a.isPrimary) ?? data.addresses[0]
  const primaryBuilding =
    data.buildings.find((b) => b.isPrimary) ?? data.buildings[0]
  const style = primaryBuilding?.styles?.[0]
  const landSegment = data.landSegments[0]
  const mapLabel = situs ? situs.street.trim() : data.accountNumber

  return (
    <div className="rounded-2xl border-2 border-teal-100 bg-linear-to-br from-white to-teal-50/60 p-6 shadow-lg">
      <div className="flex flex-wrap items-center gap-5">
        <HouseThumbnail className="h-28 w-36" />

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {situs ? situs.street.trim() : `Account ${data.accountNumber}`}
          </h1>
          <p className="text-base font-medium text-slate-600">
            {situs ? `${situs.city}, CO ${formatZip(situs.zipCode)}` : ''}
          </p>
          <p className="mt-2 text-sm font-semibold text-teal-800">
            Account No: {data.accountNumber} &nbsp; Parcel ID:{' '}
            {data.stateParcelNumber}
          </p>
          <p className="text-sm text-slate-600">
            {data.accountType}
            {style ? ` (${style.styleCodeDescription})` : ''} · Tax Year{' '}
            {year}
          </p>
          <PropertyStatsRow
            className="mt-3"
            primaryBuilding={primaryBuilding}
            style={style}
            landSegment={landSegment}
          />
        </div>

        {data.latitude && data.longitude && (
          <div className="hidden flex-none gap-2 sm:flex">
            <HouseThumbnail className="h-28 w-36" />
            <div className="group relative w-56">
              <LocationMap
                latitude={data.latitude}
                longitude={data.longitude}
                label={mapLabel}
                heightClassName="h-28"
              />
              <button
                type="button"
                onClick={() => setMapExpanded(true)}
                title="Expand map"
                className="absolute right-2 top-2 z-[1000] flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-600 shadow-sm transition hover:bg-white hover:text-teal-700"
              >
                <FontAwesomeIcon icon={faExpand} className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {mapExpanded && (
        <Modal title={mapLabel} onClose={() => setMapExpanded(false)}>
          <LocationMap
            latitude={data.latitude}
            longitude={data.longitude}
            label={mapLabel}
            heightClassName="h-[70vh]"
            zoom={17}
            scrollWheelZoom
          />
        </Modal>
      )}
    </div>
  )
}
