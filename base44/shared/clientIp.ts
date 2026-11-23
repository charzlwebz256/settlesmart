// The caller's address, taken only from a header the caller cannot write, and
// the hash the app stores instead of the address itself.

// cf-connecting-ip is set by the edge; in x-forwarded-for only the last entry
// is appended by the edge, so caller-controlled leading entries are ignored.
// With neither header the caller shares one bucket, which is the safe direction.
export function callerIp(req: Request): string {
  const direct = req.headers.get('cf-connecting-ip');
  if (direct && direct.trim()) return direct.trim();
  const forwarded = String(req.headers.get('x-forwarded-for') || '');
  const hops = forwarded.split(',').map((hop) => hop.trim()).filter(Boolean);
  return hops.length ? hops[hops.length - 1] : 'unknown';
}

export async function hashIp(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}