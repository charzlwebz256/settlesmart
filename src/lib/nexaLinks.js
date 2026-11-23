// Links Nexa writes: SettleSmart pages, official websites, phone numbers and map addresses.
export function nexaUrlTransform(url) {
  const value = String(url || '').trim();
  if (!value) return '';
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  if (/^(https?:\/\/|mailto:|tel:|sms:)/i.test(value)) return value;
  return '';
}

const LINK_SOURCE = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const LINK_ONE = /\[([^\]]+)\]\(([^)\s]+)\)/;
const MAPS_PATTERN = /google\.[a-z.]+\/maps/i;
const FIELD_SOURCE =
  /\b(website|web site|webpage|site|url|phone|telephone|tel|mobile|address|location|office|hours|opening hours|open hours|open)\b\s*[:\-–—]\s*/gi;
const FIELD_ONE =
  /\b(website|web site|webpage|site|url|phone|telephone|tel|mobile|address|location|office|hours|opening hours|open hours|open)\b\s*[:\-–—]\s*/i;

function cleanText(value) {
  return String(value || '')
    .replace(/[#*_`>]/g, '')
    .replace(/^\s*[-•]\s+/, '')
    .replace(/^\s*\d+[.)]\s+/, '')
    .replace(/[|·•\s]+$/, '')
    .trim();
}

function trimEdges(value) {
  return cleanText(value)
    .replace(/^[·|\-–—,;:\s]+/, '')
    .replace(/[·|\-–—,;:\s]+$/, '')
    .trim();
}

function kindOf(label) {
  const value = String(label || '').toLowerCase();
  if (/web|site|url/.test(value)) return 'website';
  if (/phone|tel|mobile|call/.test(value)) return 'phone';
  if (/address|location|office/.test(value)) return 'address';
  if (/hour|open|time/.test(value)) return 'hours';
  return null;
}

function phoneLink(value) {
  const text = trimEdges(value);
  const digits = text.replace(/[^\d]/g, '');
  if (digits.length < 7) return null;
  const normalized = digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits.startsWith('1') ? `+${digits}` : `+${digits}`;
  return { label: text, href: `tel:${normalized}` };
}

function websiteLink(value) {
  const text = trimEdges(value);
  if (!text || text.startsWith('/')) return null;
  if (/^https?:\/\//i.test(text)) {
    return { label: text.replace(/^https?:\/\//i, '').replace(/\/$/, ''), href: text };
  }
  if (!/^[\w-]+(\.[\w-]+)+/.test(text)) return null;
  return { label: text, href: `https://${text}` };
}

function addressLink(value) {
  const text = trimEdges(value);
  if (text.length < 5) return null;
  return { label: text, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}` };
}

// Pulls websites, phones, addresses and opening hours out of one line of Nexa's answer.
function parseLine(line) {
  const linkMatches = [...line.matchAll(LINK_SOURCE)];
  const links = linkMatches.map((match) => ({ label: cleanText(match[1]), href: match[2].trim() }));
  const plain = line.replace(new RegExp(LINK_SOURCE.source, 'g'), ' · ');
  const labels = [...plain.matchAll(FIELD_SOURCE)];

  const fields = [];
  labels.forEach((match, index) => {
    const start = match.index + match[0].length;
    const end = index + 1 < labels.length ? labels[index + 1].index : plain.length;
    const kind = kindOf(match[1]);
    const value = trimEdges(plain.slice(start, end));
    if (kind && value) fields.push({ kind, value });
  });

  const linkAt = line.search(LINK_ONE);
  const labelAt = line.search(FIELD_ONE);
  const cuts = [linkAt, labelAt].filter((index) => index >= 0);
  const namePart = trimEdges(cuts.length ? line.slice(0, Math.min(...cuts)) : '').replace(/[:\-–—,]\s*$/, '');

  const lastLink = linkMatches[linkMatches.length - 1];
  const trailing = lastLink ? trimEdges(line.slice(lastLink.index + lastLink[0].length)) : '';

  return { links, fields, namePart, trailing };
}

const SPOKEN_PHONE = /(?:\+?1[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}/;

// A phone number Nexa said out loud, with the organisation named just before it.
function spokenContact(line) {
  const match = line.match(SPOKEN_PHONE);
  if (!match) return null;
  const phone = phoneLink(match[0]);
  if (!phone) return null;
  let before = trimEdges(line.slice(0, match.index));
  const verb = before.match(/^.*\b(?:call|contact|reach|phone|ring)\b\s*/i);
  before = (verb ? before.slice(verb[0].length) : before)
    .replace(/\s+(?:at|on|is)\s*$/i, '')
    .replace(/[.,;:]$/, '')
    .trim();
  if (!before || before.length > 60) return null;
  return { name: before.split(/\s+/).slice(-5).join(' ').slice(0, 120), phone };
}

// Every organisation Nexa named in the given answers, with each detail as a tappable link.
function collectContacts(messages = []) {
  const contacts = [];
  let current = null;
  let pendingName = '';

  messages
    .filter((message) => message.role === 'assistant')
    .forEach((message) => {
      String(message.content || '')
        .split('\n')
        .forEach((rawLine) => {
          const line = rawLine.trim();
          if (!line) return;
          const parsed = parseLine(line);

          // A heading on its own line names the organisation whose details follow.
          if (!parsed.links.length && !parsed.fields.length) {
            const spoken = spokenContact(line);
            if (spoken) {
              const known = contacts.find((contact) => contact.name.toLowerCase() === spoken.name.toLowerCase());
              if (known) {
                known.phone = known.phone || spoken.phone;
                current = known;
              } else {
                const created = { ...spoken, hours: '', website: null, address: null };
                contacts.push(created);
                current = created;
              }
              return;
            }
            const candidate = trimEdges(line).replace(/[:\-–—,]\s*$/, '');
            if (candidate && candidate.length <= 80 && !/[.!?]$/.test(candidate)) pendingName = candidate;
            return;
          }

          const hasStrong = parsed.links.some((link) => /^tel:/i.test(link.href) || MAPS_PATTERN.test(link.href))
            || parsed.fields.some((field) => field.kind === 'phone' || field.kind === 'address');
          const name = parsed.namePart || pendingName;
          if (!hasStrong && name.length > 60) return;

          let target = name ? contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase()) : current;
          if (!target) {
            target = { name: (name || 'Contact').slice(0, 120), hours: '', phone: null, website: null, address: null };
            contacts.push(target);
          }
          if (name) pendingName = '';
          current = target;

          parsed.links.forEach((link) => {
            if (/^tel:/i.test(link.href)) target.phone = target.phone || link;
            else if (MAPS_PATTERN.test(link.href)) target.address = target.address || link;
            else if (/^https?:\/\//i.test(link.href)) target.website = target.website || link;
          });

          parsed.fields.forEach((field) => {
            if (field.kind === 'phone') target.phone = target.phone || phoneLink(field.value);
            if (field.kind === 'website') target.website = target.website || websiteLink(field.value);
            if (field.kind === 'address') target.address = target.address || addressLink(field.value);
            if (field.kind === 'hours') target.hours = target.hours || field.value.slice(0, 110);
          });

          if (!target.hours && parsed.trailing) target.hours = parsed.trailing.slice(0, 110);
        });
    });

  return contacts.filter((contact) => contact.phone || contact.website || contact.address).slice(-12);
}