// Shared geodesy helpers for the transit map.

const EARTH_RADIUS_M = 6371000;
const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

// Straight-line (great circle) distance between two {lat, lng} points, in metres.
export function distanceMeters(a, b) {
  if (!a || !b) return Infinity;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function bearingBetween(a, b) {
  if (!a || !b) return null;
  const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat));
  const x =
    Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lng - a.lng));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Reported accuracy at 1 m resolution (one decimal below 10 m).
export function formatAccuracy(meters) {
  if (!Number.isFinite(meters)) return '';
  return meters < 10 ? `${meters.toFixed(1)} m` : `${Math.round(meters)} m`;
}

export function formatDistance(meters) {
  if (!Number.isFinite(meters)) return '—';
  if (meters < 950) return `${Math.round(meters / 10) * 10} m`;
  return `${(meters / 1000).toFixed(meters < 9500 ? 1 : 0)} km`;
}

// The device's own reported accuracy drives the label — never an estimate.
export function accuracyBand(accuracy) {
  if (!Number.isFinite(accuracy)) return 'unknown';
  if (accuracy < 20) return 'good';
  if (accuracy <= 50) return 'moderate';
  return 'low';
}

export const BAND_STYLES = {
  good: { label: 'Good', chip: 'bg-green-500/10 text-green-700', dot: 'bg-green-500' },
  moderate: { label: 'Moderate', chip: 'bg-amber-500/10 text-amber-700', dot: 'bg-amber-500' },
  low: { label: 'Low accuracy', chip: 'bg-red-500/10 text-red-700', dot: 'bg-red-500' },
  unknown: { label: 'No reading', chip: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground/50' },
};

export function formatUpdatedAgo(timestamp) {
  if (!timestamp) return '';
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.round(minutes / 60)} h ago`;
}