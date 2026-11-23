import jsPDF from 'jspdf';
import { SERVICE_DIRECTORY as DIRECTORY, PROVINCES } from '@/data/nationalDirectory';
import { officialLinks } from '@/data/officialLinks';

const escapeHtml = (value) =>
  String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));

const itemHtml = (item) => {
  const links = officialLinks(item.name);
  const linkRow = links.length
    ? `<br/><span class="links">${links
        .map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`)
        .join(' · ')}</span>`
    : '';
  return `<li><strong>${escapeHtml(item.name)}</strong>${item.note ? ` — ${escapeHtml(item.note)}` : ''}${linkRow}</li>`;
};

function buildHtml() {
  const sections = DIRECTORY.map((category) => {
    const national = category.national.length
      ? `<h3>Across Canada</h3><ul>${category.national.map(itemHtml).join('')}</ul>`
      : '';
    const provincial = PROVINCES.map((province) => {
      const items = category.provinces[province] || [];
      if (items.length === 0) return '';
      return `<h3>${escapeHtml(province)}</h3><ul>${items.map(itemHtml).join('')}</ul>`;
    }).join('');
    return `<section><h2>${escapeHtml(category.label)}</h2><p class="blurb">${escapeHtml(category.blurb)}</p>${national}${provincial}</section>`;
  }).join('');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>SettleSmart Canada – Services Directory</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 28px; color: #131720; background: #f9fafb; line-height: 1.55; }
  main { max-width: 780px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 16px; border: 1px solid #e5e7eb; }
  h1 { font-size: 26px; margin: 0 0 4px; }
  .meta { color: #676f7e; font-size: 13px; margin: 0 0 24px; }
  section { border-top: 1px solid #e5e7eb; padding-top: 18px; margin-top: 22px; }
  h2 { font-size: 18px; color: #279b84; margin: 0 0 4px; }
  h3 { font-size: 14px; margin: 16px 0 6px; text-transform: uppercase; letter-spacing: .04em; color: #676f7e; }
  ul { margin: 0; padding-left: 18px; }
  li { font-size: 13px; margin-bottom: 6px; }
  .links a { color: #279b84; font-size: 12px; text-decoration: none; }
  .blurb { color: #676f7e; font-size: 13px; margin: 0; }
  footer { margin-top: 26px; font-size: 12px; color: #676f7e; }
</style></head>
<body><main>
<h1>National Services Directory</h1>
<p class="meta">Emergency, housing, banking, family, seniors, transit, shopping, parks, libraries and pet services across Canada. Saved ${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
${sections}
<footer>This is a starting directory of major cities and organisations, not a complete list of every office. Confirm current names, phone numbers and hours with the organisation before you travel.</footer>
</main></body></html>`;
}

export function downloadDirectoryHtml() {
  const blob = new Blob([buildHtml()], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'settlesmart-services-directory.html';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadDirectoryPdf() {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 44;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const height = doc.internal.pageSize.getHeight();
  let y = margin;

  const write = (text, size, style = 'normal', gap = 14) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.splitTextToSize(text, width).forEach((line) => {
      if (y > height - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += size + 3;
    });
    y += gap - 3;
  };

  const writeEntry = (item) => {
    write(`• ${item.name}${item.note ? ` — ${item.note}` : ''}`, 9, 'normal', 2);
    const links = officialLinks(item.name);
    if (links.length) {
      write(`   ${links.map((link) => `${link.label}: ${link.url}`).join(' | ')}`, 8, 'normal', 2);
    }
  };

  write('SettleSmart Canada – National Services Directory', 18, 'bold', 6);
  write(`Downloaded ${new Date().toLocaleDateString('en-CA')}`, 9, 'normal', 16);

  DIRECTORY.forEach((category) => {
    write(category.label, 14, 'bold', 4);
    write(category.blurb, 9, 'normal', 8);
    if (category.national.length) {
      write('Across Canada', 10, 'bold', 4);
      category.national.forEach(writeEntry);
      y += 6;
    }
    PROVINCES.forEach((province) => {
      const items = category.provinces[province] || [];
      if (!items.length) return;
      write(province, 10, 'bold', 4);
      items.forEach(writeEntry);
      y += 6;
    });
    y += 8;
  });

  doc.save('settlesmart-services-directory.pdf');
}