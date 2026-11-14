// Readable travel times: "22 min", "1 h 05 min" instead of "85 min".
export function formatMinutes(minutes) {
  if (!Number.isFinite(minutes)) return '—';
  const total = Math.max(1, Math.round(minutes));
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest ? `${hours} h ${String(rest).padStart(2, '0')} min` : `${hours} h`;
}