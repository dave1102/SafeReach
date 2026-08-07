import fetch from 'node-fetch'

const OVERPASS_TAG = {
  hospital: 'amenity=hospital',
  pharmacy: 'amenity=pharmacy',
  police: 'amenity=police'
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

async function fetchFromGooglePlaces(type, lat, lng, radius) {
  const gType = { hospital: 'hospital', pharmacy: 'pharmacy', police: 'police' }[type] || 'hospital'
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${gType}&key=${process.env.GOOGLE_PLACES_API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(data.error_message || `Google Places error: ${data.status}`)
  }
  return (data.results || []).map((p) => ({
    id: p.place_id,
    name: p.name,
    address: p.vicinity,
    lat: p.geometry.location.lat,
    lng: p.geometry.location.lng,
    distanceKm: haversineKm(lat, lng, p.geometry.location.lat, p.geometry.location.lng)
  }))
}

// Free fallback with no API key: OpenStreetMap's Overpass API.
async function fetchFromOverpass(type, lat, lng, radius) {
  const tag = OVERPASS_TAG[type] || OVERPASS_TAG.hospital
  const query = `[out:json][timeout:15];node[${tag}](around:${radius},${lat},${lng});out;`
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' }
  })
  const data = await res.json()
  return (data.elements || [])
    .filter((el) => el.tags?.name)
    .map((el) => ({
      id: String(el.id),
      name: el.tags.name,
      address: [el.tags['addr:street'], el.tags['addr:city']].filter(Boolean).join(', ') || 'Address unavailable',
      lat: el.lat,
      lng: el.lon,
      distanceKm: haversineKm(lat, lng, el.lat, el.lon)
    }))
}

export async function getNearbyPlaces(req, res, next) {
  try {
    const { type = 'hospital', lat, lng, radius = 5000 } = req.query
    if (!lat || !lng) {
      return res.status(400).json({ message: 'lat and lng query params are required.' })
    }

    const places = process.env.GOOGLE_PLACES_API_KEY
      ? await fetchFromGooglePlaces(type, Number(lat), Number(lng), Number(radius))
      : await fetchFromOverpass(type, Number(lat), Number(lng), Number(radius))

    places.sort((a, b) => a.distanceKm - b.distanceKm)
    res.json({ places: places.slice(0, 20) })
  } catch (err) {
    next(err)
  }
}
