// Key-free routing: OSRM (FOSSGIS) for street routes, Transitous (MOTIS) for real transit itineraries.
const UA = { 'User-Agent': 'SettleSmart/1.0 (newcomer settlement guide)' };
const OSRM_HOST = 'https://routing.openstreetmap.de';
const TRANSITOUS = 'https://api.transitous.org/api/v1/plan';

const SPEEDS = { walking: 4.7, cycling: 15, driving: 45 };

const LEG_KIND = {
  WALK: 'walk',
  BIKE: 'bike',
  CAR: 'driving',
  TAXI: 'driving',
  BUS: 'bus',
  COACH: 'bus',
  REGIONAL_BUS: 'bus',
  ODP: 'bus',
  TRAM: 'tram',
  SUBWAY: 'train',
  METRO: 'train',
  RAIL: 'train',
  REGIONAL_RAIL: 'train',
  LONG_DISTANCE: 'train',
  FERRY: 'ferry',
};

const KIND_LABEL = { walk: 'Walk', bus: 'Bus', train: 'Train', tram: 'Tram', ferry: 'Ferry', bike: 'Bike', driving: 'Car' };

export function haversineKm(a, b) {
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function stepText(step) {
  const m = step.maneuver || {};
  const road = step.name ? ` on ${step.name}` : '';
  switch (m.type) {
    case 'depart':
      return `Head${m.modifier ? ` ${m.modifier}` : ''} out${road}`;
    case 'arrive':
      return 'Arrive at your destination';
    case 'roundabout':
    case 'rotary':
      return `Take the roundabout${m.exit ? `, exit ${m.exit}` : ''}${road}`;
    case 'merge':
      return `Merge${road}`;
    case 'fork':
      return `Keep ${m.modifier || 'straight'}${road}`;
    case 'new name':
    case 'continue':
      return `Continue${road}`;
    default:
      return m.modifier ? `Turn ${m.modifier}${road}` : `Continue${road}`;
  }
}

export async function osrmRoute(profile, start, end, withSteps = true) {
  const url = `${OSRM_HOST}/routed-${profile}/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson${withSteps ? '&steps=true' : ''}`;
  try {
    const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    const json = await res.json();
    const route = json?.routes?.[0];
    if (!route) return null;
    return {
      distanceKm: route.distance / 1000,
      minutes: route.duration / 60,
      path: (route.geometry?.coordinates || []).map(([lng, lat]) => [lat, lng]),
      steps: (route.legs?.[0]?.steps || [])
        .map((s) => ({ instruction: stepText(s).replace(/\s+/g, ' ').trim(), distance_m: Math.round(s.distance || 0) }))
        .filter((s) => s.instruction),
    };
  } catch (_e) {
    return null;
  }
}

// MOTIS returns Google-style encoded polylines with an explicit precision.
function decodePolyline(str, precision = 5) {
  if (!str) return [];
  const factor = 10 ** precision;
  const path = [];
  let i = 0;
  let lat = 0;
  let lng = 0;

  // Plain arithmetic, not bitwise: longitudes scaled by 1e7 overflow 32-bit
  // shifts and would put the whole bus leg in the wrong place on the map.
  const readValue = () => {
    let result = 0;
    let scale = 1;
    let byte;
    do {
      byte = str.charCodeAt(i++) - 63;
      result += (byte & 0x1f) * scale;
      scale *= 32;
    } while (byte >= 0x20);
    return result % 2 ? -(result + 1) / 2 : result / 2;
  };

  while (i < str.length) {
    lat += readValue();
    lng += readValue();
    path.push([lat / factor, lng / factor]);
  }
  return path;
}

function minutesBetween(a, b) {
  if (!a || !b) return null;
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Number.isFinite(ms) ? Math.max(0, Math.round(ms / 60000)) : null;
}

function legPath(leg) {
  const decoded = decodePolyline(leg.legGeometry?.points, leg.legGeometry?.precision ?? 7);
  if (decoded.length > 1) return decoded;
  const from = leg.from?.lat !== undefined ? [leg.from.lat, leg.from.lon] : null;
  const to = leg.to?.lat !== undefined ? [leg.to.lat, leg.to.lon] : null;
  return from && to ? [from, to] : [];
}

function describeItinerary(itinerary) {
  const legs = Array.isArray(itinerary.legs) ? itinerary.legs : [];
  const steps = [];
  const waypoints = [];
  const buses = [];
  const stops = [];
  let distance = 0;

  const place = (name, fallback) => (!name || name === 'START' || name === 'END' ? fallback : name);

  const journey = [];

  legs.forEach((leg) => {
    const kind = LEG_KIND[leg.mode] || 'bus';
    const mins = Math.max(1, Math.round((leg.duration || 0) / 60));
    const fromName = place(leg.from?.name, 'your start');
    const toName = place(leg.to?.name, 'your destination');
    const path = legPath(leg);
    waypoints.push(...path);
    const pathKm = path.reduce((sum, point, i) => (i === 0 ? 0 : sum + haversineKm(path[i - 1], point)), 0);
    const meters = Number(leg.distance) || Math.round(pathKm * 1000);
    distance += meters;

    const label = KIND_LABEL[kind] || 'Transit';
    const routeName = leg.routeShortName || leg.routeLongName || '';
    const cleanedHeadsign = String(leg.headsign || '')
      .replace(leg.routeLongName || '\u0000', '')
      .replace(/^[\s,-]+/, '')
      .trim();
    const headsign = cleanedHeadsign && cleanedHeadsign !== leg.routeShortName ? cleanedHeadsign : '';
    const isTransit = kind !== 'walk' && kind !== 'bike' && kind !== 'driving';
    const intermediate = Array.isArray(leg.intermediateStops) ? leg.intermediateStops : [];
    const color = String(leg.routeColor || '').replace('#', '').trim();

    // Every leg of the whole journey, for the full itinerary and the map.
    journey.push({
      kind,
      label,
      route_name: routeName || null,
      long_name: leg.routeLongName || null,
      headsign: headsign || null,
      agency: leg.agencyName || null,
      color: /^[0-9a-fA-F]{6}$/.test(color) ? `#${color}` : null,
      from_name: fromName,
      from_coords: leg.from?.lat !== undefined ? [leg.from.lat, leg.from.lon] : null,
      to_name: toName,
      to_coords: leg.to?.lat !== undefined ? [leg.to.lat, leg.to.lon] : null,
      start_at: leg.startTime || null,
      end_at: leg.endTime || null,
      duration_minutes: mins,
      distance_m: Math.round(meters),
      stops_count: isTransit ? intermediate.length + 1 : null,
      intermediate_stops: intermediate.slice(0, 40).map((s) => ({ name: s.name, lat: s.lat, lng: s.lon })),
      path: path.slice(0, 800),
    });

    if (!isTransit) {
      steps.push({ instruction: `${label} ${mins} min to ${toName}`, distance_m: Math.round(meters), mode: kind });
      return;
    }

    steps.push({
      instruction: `${label} ${routeName}${headsign ? ` toward ${headsign}` : ''} — ${fromName} → ${toName} (${mins} min)`,
      distance_m: Math.round(meters),
      mode: kind,
    });
    buses.push({ name: `${label} ${routeName}`, route: routeName, kind });
    if (leg.from?.lat !== undefined) {
      stops.push({ name: fromName, lat: leg.from.lat, lng: leg.from.lon, buses: [routeName || label] });
    }
    if (leg.to?.lat !== undefined) {
      stops.push({ name: toName, lat: leg.to.lat, lng: leg.to.lon, buses: [routeName || label] });
    }
  });

  return {
    duration_minutes: Math.max(1, Math.round((itinerary.duration || 0) / 60)),
    distance_km: round1(distance / 1000),
    waypoints,
    journey,
    steps,
    bus_info: buses,
    nearby_bus_stations: stops,
    depart_at: itinerary.startTime || null,
    arrive_at: itinerary.endTime || null,
    transfers: itinerary.transfers || 0,
  };
}

async function transitPlan(start, end) {
  const url = `${TRANSITOUS}?fromPlace=${start[0]},${start[1]}&toPlace=${end[0]},${end[1]}&numItineraries=4`;
  let itineraries = [];
  try {
    const res = await fetch(url, { headers: { ...UA, Accept: 'application/json' }, signal: AbortSignal.timeout(18000) });
    if (res.ok) {
      const json = await res.json();
      itineraries = Array.isArray(json.itineraries) ? json.itineraries : [];
    }
  } catch (_e) {
    itineraries = [];
  }

  if (itineraries.length) {
    // Prefer the trip whose stops sit closest to both ends: every 80 m of walking
    // costs the same as a minute on board, so a nearby stop beats a long walk.
    const accessMeters = (itinerary) =>
      (itinerary.legs || []).reduce((sum, leg) => {
        const kind = LEG_KIND[leg.mode];
        const onFoot = !kind || kind === 'walk' || kind === 'bike';
        return onFoot ? sum + (Number(leg.distance) || 0) : sum;
      }, 0);
    const scored = itineraries
      .map((it) => ({ it, score: (it.duration || 0) / 60 + accessMeters(it) / 80 }))
      .sort((a, b) => a.score - b.score);

    const primary = describeItinerary(scored[0].it);
    const alternatives = scored.slice(1, 3).map(({ it }) => ({
      duration_minutes: Math.max(1, Math.round((it.duration || 0) / 60)),
      transfers: it.transfers || 0,
      routes: (it.legs || [])
        .filter((l) => LEG_KIND[l.mode] && LEG_KIND[l.mode] !== 'walk')
        .map((l) => l.routeShortName || l.routeLongName || KIND_LABEL[LEG_KIND[l.mode]]),
    }));
    return {
      ...primary,
      alternatives,
      transfer_note: primary.transfers === 0
        ? 'Direct trip, no transfers.'
        : `${primary.transfers} transfer${primary.transfers > 1 ? 's' : ''}.`,
    };
  }

  // No transit service covers these points — show the walking route instead.
  const walk = await osrmRoute('foot', start, end, true);
  if (!walk) return straightPlan(start, end, 'walking');
  return {
    distance_km: round1(walk.distanceKm),
    duration_minutes: Math.max(1, Math.round(walk.minutes)),
    waypoints: walk.path,
    steps: walk.steps.slice(0, 24).map((s) => ({ ...s, mode: 'walk' })),
    bus_info: [],
    nearby_bus_stations: [],
    note: 'No transit trip covers this route, so this is the walking route.',
  };
}

function straightPlan(start, end, mode) {
  const km = haversineKm(start, end) * 1.25;
  const speed = SPEEDS[mode] || SPEEDS.driving;
  return {
    distance_km: round1(km),
    duration_minutes: Math.max(1, Math.round((km / speed) * 60)),
    waypoints: [start, end],
    steps: [{ instruction: 'Travel to your destination', distance_m: Math.round(km * 1000), mode }],
    bus_info: [],
    nearby_bus_stations: [],
    note: 'Straight-line estimate — live routing was unavailable.',
  };
}

export async function planRoute(start, end, mode) {
  if (mode === 'transit') return transitPlan(start, end);
  const profile = mode === 'walking' ? 'foot' : mode === 'cycling' ? 'bike' : 'car';
  const route = await osrmRoute(profile, start, end, true);
  if (!route) return straightPlan(start, end, mode);
  return {
    distance_km: round1(route.distanceKm),
    duration_minutes: Math.max(1, Math.round(route.minutes)),
    waypoints: route.path,
    steps: route.steps.slice(0, 24).map((s) => ({ ...s, mode })),
    bus_info: [],
    nearby_bus_stations: [],
  };
}