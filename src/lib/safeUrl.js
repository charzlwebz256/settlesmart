// Client-side guard for any URL that came from AI output or the open web.
// Only http(s) links and same-origin relative paths are allowed through.
export function isSafeUrl(url) {
  if (typeof url !== 'string') return false;
  const value = url.trim();
  if (!value) return false;
  return /^https?:\/\//i.test(value) || (value.startsWith('/') && !value.startsWith('//'));
}

export function safeHref(url) {
  return isSafeUrl(url) ? url.trim() : undefined;
}