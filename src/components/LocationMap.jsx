import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
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

export function LocationMap({
  latitude,
  longitude,
  label,
  heightClassName = 'h-64',
  zoom = 17,
  scrollWheelZoom = false,
  showMarker = true,
}) {
  return (
    <div
      className={`${heightClassName} w-full overflow-hidden rounded-xl border border-slate-200`}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showMarker && (
          <Marker position={[latitude, longitude]} icon={defaultIcon}>
            <Popup>{label}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
