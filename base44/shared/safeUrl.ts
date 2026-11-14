// Only http(s) URLs — and optionally same-origin relative paths — are ever
// returned to the client from AI/web-derived data.
export function safeUrl(value, allowRelative = false) {
  if (typeof value !== 'string') return '';
  const url = value.trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (allowRelative && url.startsWith('/') && !url.startsWith('//')) return url;
  return '';
}

export function cleanText(value, max = 500) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}