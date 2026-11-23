// Google's favicon service returns each site's real logo from its domain.
export function logoDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function siteLogo(url, size = 128) {
  const domain = logoDomain(url);
  return domain ? `https://www.google.com/s2/favicons?sz=${size}&domain=${domain}` : '';
}