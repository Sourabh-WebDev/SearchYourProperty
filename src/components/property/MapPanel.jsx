import { LocationMap } from '../LocationMap'
import { HouseThumbnail } from '../common/HouseThumbnail'
import { formatZip } from '../../format'

export function MapPanel({ data }) {
  const situs = data.addresses.find((a) => a.isPrimary) ?? data.addresses[0]

  if (!data.latitude || !data.longitude) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
        No location on file for this parcel.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          {situs ? `${situs.street.trim()}, ${situs.city} CO ${formatZip(situs.zipCode)}` : data.accountNumber}
        </h2>
        <span className="text-sm text-slate-500">
          {data.latitude.toFixed(5)}, {data.longitude.toFixed(5)}
        </span>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <HouseThumbnail className="h-40 w-full lg:h-40 lg:w-56" />
        <div className="flex-1">
          <LocationMap
            latitude={data.latitude}
            longitude={data.longitude}
            label={situs ? situs.street.trim() : data.accountNumber}
            heightClassName="h-[480px]"
          />
        </div>
      </div>
    </div>
  )
}
