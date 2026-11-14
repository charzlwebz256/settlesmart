import { bearingBetween, distanceMeters } from '@/lib/geo';

// Walking, cycling and driving legs are given as "go here" guidance; transit legs
// ask you to board, ride and get off.
const RIDE_KINDS = ['walk', 'bike', 'driving'];

const asPoint = (p) => ({ lat: p[0], lng: p[1] });

export function formatDistance(meters) {
  if (!Number.isFinite(meters)) return '';
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters / 10) * 10} m`;
}

/**
 * Flattens the chosen route into one walkable line, keeping track of where each
 * leg ends so guidance knows whether you are walking or riding.
 */
export function buildTrack(route) {
  if (!route) return null;
  const legs = Array.isArray(route.journey) ? route.journey.filter((leg) => Array.isArray(leg.path) && leg.path.length > 1) : [];
  const source = legs.length
    ? legs
    : [{ kind: 'walk', path: route.waypoints || [], to_name: 'your destination' }].filter((leg) => leg.path.length > 1);
  if (!source.length) return null;

  const points = [];
  const legEnds = [];
  source.forEach((leg, i) => {
    leg.path.forEach((raw, j) => {
      const last = points[points.length - 1];
      // Skip the duplicated junction point between two legs.
      if (j === 0 && last && distanceMeters(asPoint(last), asPoint(raw)) < 3) {
        legEnds[i] = points.length - 1;
        return;
      }
      points.push(raw);
      legEnds[i] = points.length - 1;
    });
  });
  if (points.length < 2) return null;

  const cum = [0];
  for (let i = 1; i < points.length; i += 1) {
    cum[i] = cum[i - 1] + distanceMeters(asPoint(points[i - 1]), asPoint(points[i]));
  }
  return { legs: source, points, legEnds, cum, total: cum[cum.length - 1] };
}

function locate(track, position) {
  let index = 0;
  let nearest = Infinity;
  track.points.forEach((raw, i) => {
    const d = distanceMeters(position, asPoint(raw));
    if (d < nearest) {
      nearest = d;
      index = i;
    }
  });
  return {
    index,
    offRoute: nearest,
    travelled: track.cum[index],
    remaining: Math.max(0, track.total - track.cum[index]),
  };
}

function aheadOf(track, index, meters) {
  const target = track.cum[index] + meters;
  let i = index;
  while (i < track.cum.length - 1 && track.cum[i] < target) i += 1;
  return asPoint(track.points[i]);
}

function minutesUntil(value, now) {
  if (!value) return null;
  const ms = new Date(value).getTime() - now;
  return Number.isFinite(ms) ? Math.round(ms / 60000) : null;
}

function lowerFirst(text) {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

function nextLegHint(track, legIndex) {
  const leg = track.legs[legIndex + 1];
  if (!leg) return null;
  if (!RIDE_KINDS.includes(leg.kind)) {
    return `Then ride ${leg.route_name || 'transit'}${leg.headsign ? ` toward ${leg.headsign}` : ''}`;
  }
  return `Then ${leg.kind === 'walk' ? 'walk' : 'continue'} to ${leg.to_name || 'your destination'}`;
}

// Street routes carry real manoeuvres: "In 200 m, turn right on …".
function streetGuidance(route, track, loc, base) {
  const steps = Array.isArray(route.steps) ? route.steps.filter((s) => s.instruction) : [];
  if (!steps.length) {
    const toEnd = base.remainingM;
    return { ...base, instruction: `Continue for ${formatDistance(toEnd)}`, detail: 'Follow the route on the map' };
  }
  const stepTotal = steps.reduce((sum, s) => sum + (s.distance_m || 0), 0) || track.total;
  const scale = track.total / stepTotal;

  let acc = 0;
  let i = 0;
  for (; i < steps.length; i += 1) {
    const d = (steps[i].distance_m || 0) * scale;
    if (acc + d >= loc.travelled) break;
    acc += d;
  }
  const current = steps[Math.min(i, steps.length - 1)];
  const next = steps[i + 1];
  const toEnd = Math.max(0, acc + (current.distance_m || 0) * scale - loc.travelled);

  if (next && toEnd > 20) {
    return {
      ...base,
      instruction: `In ${formatDistance(toEnd)}, ${lowerFirst(next.instruction)}`,
      detail: `Continue on ${current.instruction.toLowerCase()}`,
      distanceM: Math.round(toEnd),
    };
  }
  return {
    ...base,
    instruction: next ? next.instruction : current.instruction,
    detail: next ? `Then continue on ${current.instruction.toLowerCase()}` : null,
    distanceM: Math.round(toEnd),
  };
}

/**
 * Where the rider is on the route, what to do next, and how much is left.
 */
export function buildGuidance(route, track, position, now = Date.now()) {
  if (!route || !track || !position) return null;
  const loc = locate(track, position);
  const remainingM = Math.round(loc.remaining);
  const fraction = track.total > 0 ? loc.remaining / track.total : 0;
  const scheduled = route.arrive_at ? Math.max(1, Math.round((new Date(route.arrive_at).getTime() - now) / 60000)) : null;
  const remainingMinutes = Math.max(
    1,
    scheduled !== null && Number.isFinite(scheduled) ? scheduled : Math.round((route.duration_minutes || 0) * fraction)
  );

  const base = {
    remainingM,
    remainingMinutes,
    bearing: bearingBetween(position, aheadOf(track, loc.index, 25)),
    offRoute: loc.offRoute > 70,
    offRouteM: Math.round(loc.offRoute),
    progress: Math.round((1 - fraction) * 100),
    arrived: remainingM <= 30,
  };

  if (base.arrived) {
    return { ...base, instruction: 'You have arrived', detail: 'Your destination is right here.', distanceM: 0 };
  }

  const journey = Array.isArray(route.journey) && route.journey.length > 0;
  if (!journey) return streetGuidance(route, track, loc, base);

  let legIndex = track.legEnds.findIndex((end) => end >= loc.index);
  if (legIndex < 0) legIndex = track.legs.length - 1;
  const leg = track.legs[legIndex];
  const ride = !RIDE_KINDS.includes(leg.kind);
  const label = leg.route_name || leg.label || 'transit';
  const toLegEnd = Math.max(0, track.cum[track.legEnds[legIndex]] - loc.travelled);

  if (ride) {
    const boarding = leg.path?.length ? asPoint(leg.path[0]) : null;
    const atStop = boarding ? distanceMeters(position, boarding) < 90 : false;
    const leavesIn = minutesUntil(leg.start_at, now);
    const offIn = minutesUntil(leg.end_at, now);

    if (atStop && leavesIn !== null && leavesIn > 0) {
      return {
        ...base,
        instruction: `Board ${label}${leg.headsign ? ` toward ${leg.headsign}` : ''}`,
        detail: `Leaves in ${leavesIn} min from ${leg.from_name || 'this stop'}`,
        distanceM: Math.round(toLegEnd),
      };
    }
    return {
      ...base,
      instruction: `Ride ${label} to ${leg.to_name || 'your stop'}`,
      detail: offIn !== null && offIn > 0
        ? `Get off in ${offIn} min${leg.stops_count ? ` · ${leg.stops_count} stops` : ''}`
        : `${formatDistance(toLegEnd)} remaining on this leg`,
      distanceM: Math.round(toLegEnd),
    };
  }

  return {
    ...base,
    instruction: toLegEnd > 25
      ? `Walk ${formatDistance(toLegEnd)} to ${leg.to_name || 'your stop'}`
      : `Arrive at ${leg.to_name || 'your stop'}`,
    detail: nextLegHint(track, legIndex),
    distanceM: Math.round(toLegEnd),
  };
}