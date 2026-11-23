// Links Nexa writes: SettleSmart pages, official websites, phone numbers and map addresses.
export function nexaUrlTransform(url) {
  const value = String(url || '').trim();
  if (!value) return '';
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  if (/^(https?:\/\/|mailto:|tel:|sms:)/i.test(value)) return value;
  return '';
}

const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const MAPS_PATTERN = /google\.[a-z.]+\/maps/i;

function cleanLabel(line) {
  return line
    .replace(LINK_PATTERN, '')
    .replace(/[#*_`>]/g, '')
    .replace(/^[-•\d.\s]+/, '')
    .replace(/\s*[:\-–]\s*$/, '')
    .trim();
}

// One contact per line that carries a phone, website or address link.
export function extractContacts(messages = []) {
  const contacts = [];
  const seen = new Set();

  messages
    .filter((message) => message.role === 'assistant')
    .forEach((message) => {
      String(message.content || '')
        .split('\n')
        .forEach((line) => {
          const links = [...line.matchAll(LINK_PATTERN)].map((match) => ({
            label: match[1].trim(),
            href: match[2].trim(),
          }));
          if (!links.length) return;

          const phone = links.find((link) => /^tel:/i.test(link.href));
          const website = links.find((link) => /^https?:\/\//i.test(link.href) && !MAPS_PATTERN.test(link.href));
          const address = links.find((link) => MAPS_PATTERN.test(link.href));
          if (!phone && !website && !address) return;

          const name =
            cleanLabel(line) || website?.label || phone?.label || address?.label || 'Contact';
          const key = `${name}|${phone?.href || ''}|${website?.href || ''}|${address?.href || ''}`;
          if (seen.has(key)) return;
          seen.add(key);

          contacts.push({
            name: name.slice(0, 120),
            phone: phone || null,
            website: website || null,
            address: address || null,
          });
        });
    });

  return contacts.slice(-12);
}