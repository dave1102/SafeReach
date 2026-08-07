import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Default Leaflet marker icons don't resolve correctly under Vite's
// bundler by default — point them at CDN assets explicitly.
const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

export default function MapView({ center, places = [], radiusMeters }) {
  if (!center) {
    return (
      <div className="glass-card h-80 flex items-center justify-center text-mist-500 text-sm">
        Waiting for your location…
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden !p-0 h-80 sm:h-96">
      <MapContainer center={[center.lat, center.lng]} zoom={14} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[center.lat, center.lng]} icon={icon}>
          <Popup>You are here</Popup>
        </Marker>
        {radiusMeters && (
          <Circle center={[center.lat, center.lng]} radius={radiusMeters} pathOptions={{ color: '#2456EB', fillOpacity: 0.05 }} />
        )}
        {places.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={icon}>
            <Popup>
              <strong>{p.name}</strong>
              <br />
              {p.address}
              {p.distanceKm != null && (
                <>
                  <br />
                  {p.distanceKm.toFixed(1)} km away
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
