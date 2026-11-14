// Real nearby transit stops from OpenStreetMap (Overpass API), no key required.
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function parseRoutes(tags) {
  const raw = tags.route_ref || tags.ref || tags.lines || '';
  return String(raw)
    .split(/[;,\/]/)
    .map((r) => r.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export async function fetchNearbyStops([lat, lng], radius = 1500) {
  const query = `[out:json][timeout:25];(
    node(around:${radius},${lat},${lng})["highway"="bus_stop"];
    node(around:${radius},${lat},${lng})["railway"="tram_stop"];
    node(around:${radius},${lat},${lng})["railway"="station"];
    node(around:${radius},${lat},${lng})["public_transport"="platform"];
  );out center 80;`;

  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!res.ok) throw new Error('Could not load nearby transit stops.');

  const json = await res.json();
  const seen = new Set();

  return (json.elements || [])
    .map((el) => {
      const tags = el.tags || {};
      const lat2 = el.lat ?? el.center?.lat;
      const lng2 = el.lon ?? el.center?.lon;
      const name = tags.name || (tags.ref ? `Stop ${tags.ref}` : 'Transit stop');
      return { id: String(el.id), name, lat: lat2, lng: lng2, routes: parseRoutes(tags) };
    })
    .filter((stop) => {
      if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) return false;
      const key = `${stop.name}|${stop.lat.toFixed(5)}|${stop.lng.toFixed(5)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 60);
}