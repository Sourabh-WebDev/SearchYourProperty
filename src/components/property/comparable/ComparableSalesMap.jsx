import { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { formatCurrency, formatDate } from '../../../format'
import { MatchBadge } from './MatchBadge'
import 'leaflet/dist/leaflet.css'

const subjectIcon = L.divIcon({
  className: '',
  html: '<div style="width:16px;height:16px;border-radius:9999px;background:#dc2626;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

function compIcon(selected) {
  const color = selected ? '#0f766e' : '#2563eb'
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

const TILE_LAYERS = {
  map: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
  },
}

export function ComparableSalesMap({
  subjectLatitude,
  subjectLongitude,
  comps,
  selectedIds,
  onToggle,
}) {
  const [layer, setLayer] = useState('map')
  const [showLegend, setShowLegend] = useState(true)
  const tile = TILE_LAYERS[layer]

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-xl border border-slate-200">
      <MapContainer
        center={[subjectLatitude, subjectLongitude]}
        zoom={15}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer attribution={tile.attribution} url={tile.url} />
        <Marker position={[subjectLatitude, subjectLongitude]} icon={subjectIcon}>
          <Popup>Subject Property</Popup>
        </Marker>
        {comps
          .filter((c) => c.latitude != null && c.longitude != null)
          .map((comp) => (
            <Marker
              key={comp.id}
              position={[comp.latitude, comp.longitude]}
              icon={compIcon(selectedIds.includes(comp.id))}
            >
              <Popup>
                <div className="w-48">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {comp.streetNumber} {comp.street}
                    </p>
                    <MatchBadge label={comp.matchLabel} />
                  </div>
                  <p className="text-sm font-bold text-emerald-700">
                    {formatCurrency(comp.price)}
                  </p>
                  <p className="text-sm text-slate-600">
                    {comp.sqft.toLocaleString()} SF · {comp.beds} bd ·{' '}
                    {comp.baths} ba
                  </p>
                  <p className="text-sm text-slate-600">
                    Sold {formatDate(comp.soldDate)} · ${comp.pricePerSf}/SF
                  </p>
                  <button
                    type="button"
                    onClick={() => onToggle(comp.id)}
                    className="mt-2 w-full rounded-lg bg-teal-700 py-1.5 text-sm font-semibold text-white hover:bg-teal-800"
                  >
                    {selectedIds.includes(comp.id)
                      ? 'Remove from Compare'
                      : 'Add to Compare'}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      <div className="absolute left-3 top-3 z-[1000] flex overflow-hidden rounded-lg border border-slate-200 bg-white text-sm font-medium shadow-sm">
        <button
          type="button"
          onClick={() => setLayer('map')}
          className={`px-3 py-1.5 ${layer === 'map' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Map
        </button>
        <button
          type="button"
          onClick={() => setLayer('satellite')}
          className={`px-3 py-1.5 ${layer === 'satellite' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Satellite
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowLegend((v) => !v)}
        className="absolute right-3 top-3 z-[1000] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
      >
        {showLegend ? 'Hide' : 'Show'} Legend
      </button>

      {showLegend && (
        <div className="absolute bottom-3 left-3 z-[1000] space-y-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 flex-none rounded-full border-2 border-white bg-red-600 shadow" />
            Subject Property
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 flex-none rounded-full border-2 border-white bg-blue-600 shadow" />
            Comparable Sale
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 flex-none rounded-full border-2 border-white bg-teal-700 shadow" />
            Added to Compare
          </div>
        </div>
      )}
    </div>
  )
}
