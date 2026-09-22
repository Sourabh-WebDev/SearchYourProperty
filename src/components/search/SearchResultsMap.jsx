import { Link } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { formatCurrency, formatZip } from '../../format'
import 'leaflet/dist/leaflet.css'

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function FitToMarkers({ points }) {
  const map = useMap()
  if (points.length > 1) {
    map.fitBounds(points, { padding: [32, 32] })
  }
  return null
}

export function SearchResultsMap({ results }) {
  const located = results.filter((r) => r.data.latitude != null && r.data.longitude != null)

  if (located.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-600">
        No location on file for these properties.
      </p>
    )
  }

  const points = located.map((r) => [r.data.latitude, r.data.longitude])
  const center = points[0]

  return (
    <div>
      <div className="h-[420px] overflow-hidden rounded-xl border border-slate-200">
        <MapContainer
          center={center}
          zoom={16}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitToMarkers points={points} />
          {located.map(({ data, year }) => {
            const situs = data.addresses.find((a) => a.isPrimary) ?? data.addresses[0]
            const primaryBuilding =
              data.buildings.find((b) => b.isPrimary) ?? data.buildings[0]
            const style = primaryBuilding?.styles?.[0]
            const yearTotals = data.valuesByAbstractCode.filter((v) => v.taxYear === year)
            const totalActual = yearTotals.reduce((sum, v) => sum + v.actualValue, 0)

            return (
              <Marker
                key={data.accountNumber}
                position={[data.latitude, data.longitude]}
                icon={defaultIcon}
              >
                <Popup>
                  <div className="w-52">
                    <p className="text-sm font-semibold text-slate-900">
                      {situs ? situs.street.trim() : 'Address on file'}
                    </p>
                    <p className="text-sm text-slate-600">
                      {situs ? `${situs.city}, CO ${formatZip(situs.zipCode)}` : ''}
                    </p>
                    {totalActual > 0 && (
                      <p className="mt-1 text-sm font-bold text-emerald-700">
                        {formatCurrency(totalActual)}
                      </p>
                    )}
                    {primaryBuilding && (
                      <p className="mt-1 text-sm text-slate-600">
                        {primaryBuilding.squareFeet.toLocaleString()} SF
                        {style?.bedroomCount != null ? ` · ${style.bedroomCount} bd` : ''}
                        {style?.bathroomCount != null ? ` · ${style.bathroomCount} ba` : ''}
                      </p>
                    )}
                    <Link
                      to={`/property/${data.accountNumber}/${year}`}
                      className="mt-2 block w-full rounded-lg bg-teal-700 py-1.5 text-center text-sm font-semibold text-white! no-underline hover:bg-teal-800"
                    >
                      View Details
                    </Link>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
      <p className="mt-2 text-center text-sm text-slate-500">
        Click a marker to see property details.
      </p>
    </div>
  )
}
