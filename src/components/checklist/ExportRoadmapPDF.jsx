import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';

const dayRangeLabels = {
  week1: 'Week 1 — First Steps',
  week2: 'Week 2 — Getting Settled',
  week3: 'Week 3 — Building Connections',
  week4: 'Week 4 — Moving Forward',
  month2: 'Month 2 — Deepening Roots',
  month3: 'Month 3 — Growing Independence',
};

export default function ExportRoadmapPDF({ checklist, upcomingEvents = [], profile }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);

    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 16;
      const contentW = pageW - margin * 2;
      let y = margin;

      const checkNewPage = (neededHeight = 10) => {
        if (y + neededHeight > pageH - margin) {
          doc.addPage();
          y = margin;
        }
      };

      // ── Header Banner ──────────────────────────────────────────────
      doc.setFillColor(22, 163, 74); // green-600
      doc.roundedRect(margin, y, contentW, 22, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('SettleSmart Canada — My Settlement Roadmap', margin + 5, y + 9);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const profileLine = profile
        ? `${profile.immigration_status?.replace(/_/g, ' ')} · ${profile.city || ''}, ${profile.province || ''}`
        : 'Newcomer Settlement Plan';
      doc.text(
        `${profileLine}   |   Generated: ${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        margin + 5, y + 17
      );
      y += 28;

      // ── SECTION 1: Checklist ──────────────────────────────────────
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('🍁  First 90 Days Checklist', margin, y);
      y += 2;
      doc.setDrawColor(22, 163, 74);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + contentW, y);
      y += 6;

      // Progress summary
      const total = checklist.length;
      const done = checklist.filter(c => c.is_completed).length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`Progress: ${done} of ${total} tasks completed (${pct}%)`, margin, y);
      y += 4;

      // Progress bar bg
      doc.setFillColor(220, 220, 220);
      doc.roundedRect(margin, y, contentW, 4, 2, 2, 'F');
      // Progress bar fill
      const fillW = Math.max(2, (pct / 100) * contentW);
      doc.setFillColor(22, 163, 74);
      doc.roundedRect(margin, y, fillW, 4, 2, 2, 'F');
      y += 10;

      // Group checklist by period
      const grouped = checklist.reduce((acc, item) => {
        const key = item.day_range || 'week1';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});

      const periodOrder = ['week1', 'week2', 'week3', 'week4', 'month2', 'month3'];

      periodOrder.forEach(period => {
        const items = grouped[period];
        if (!items || items.length === 0) return;

        checkNewPage(14);

        // Period header
        doc.setFillColor(240, 250, 244);
        doc.roundedRect(margin, y, contentW, 8, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(22, 100, 60);
        const periodDone = items.filter(i => i.is_completed).length;
        doc.text(`${dayRangeLabels[period]}  (${periodDone}/${items.length})`, margin + 3, y + 5.5);
        y += 11;

        items.forEach(item => {
          checkNewPage(12);

          // Checkbox
          if (item.is_completed) {
            doc.setFillColor(22, 163, 74);
            doc.roundedRect(margin + 1, y, 5, 5, 1, 1, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(7);
            doc.text('✓', margin + 2.5, y + 4);
          } else {
            doc.setDrawColor(180, 180, 180);
            doc.setLineWidth(0.4);
            doc.roundedRect(margin + 1, y, 5, 5, 1, 1, 'S');
          }

          // Title
          doc.setFont('helvetica', item.is_completed ? 'italic' : 'bold');
          doc.setFontSize(9);
          doc.setTextColor(item.is_completed ? 130 : 30, item.is_completed ? 130 : 30, item.is_completed ? 130 : 30);
          const titleLines = doc.splitTextToSize(item.title, contentW - 12);
          doc.text(titleLines, margin + 8, y + 3.5);
          y += titleLines.length * 4.5;

          // Description
          if (item.description) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(100, 100, 100);
            const descLines = doc.splitTextToSize(item.description, contentW - 12);
            doc.text(descLines, margin + 8, y);
            y += descLines.length * 3.8;
          }

          // Category tag
          if (item.category) {
            doc.setFillColor(230, 245, 235);
            doc.setDrawColor(180, 220, 195);
            doc.roundedRect(margin + 8, y, 22, 4, 1, 1, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6.5);
            doc.setTextColor(22, 100, 60);
            doc.text(item.category.toUpperCase(), margin + 9, y + 2.8);
            y += 5;
          }

          y += 2; // gap between items
        });

        y += 3;
      });

      // ── SECTION 2: Upcoming Events ────────────────────────────────
      if (upcomingEvents.length > 0) {
        checkNewPage(20);
        y += 4;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(30, 30, 30);
        doc.text('📅  Upcoming Events', margin, y);
        y += 2;
        doc.setDrawColor(22, 163, 74);
        doc.setLineWidth(0.5);
        doc.line(margin, y, margin + contentW, y);
        y += 7;

        upcomingEvents.slice(0, 15).forEach(event => {
          checkNewPage(18);

          // Event card bg
          doc.setFillColor(248, 252, 250);
          doc.setDrawColor(210, 235, 220);
          doc.setLineWidth(0.3);
          const cardLines = 1 + (event.location ? 1 : 0) + (event.description ? 2 : 0);
          const cardH = 6 + cardLines * 4.5;
          doc.roundedRect(margin, y, contentW, cardH, 2, 2, 'FD');

          const dateStr = event.date
            ? new Date(event.date).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })
            : '';

          // Date pill
          doc.setFillColor(22, 163, 74);
          doc.roundedRect(margin + 2, y + 2, 22, 5, 1, 1, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6.5);
          doc.setTextColor(255, 255, 255);
          doc.text(dateStr, margin + 3.5, y + 5.5);

          // Title
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(30, 30, 30);
          const evTitleLines = doc.splitTextToSize(event.title, contentW - 30);
          doc.text(evTitleLines, margin + 27, y + 5.5);
          y += 9;

          if (event.location) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(100, 100, 100);
            doc.text(`📍 ${event.location}`, margin + 5, y);
            y += 4.5;
          }
          if (event.description) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(110, 110, 110);
            const descLines = doc.splitTextToSize(event.description, contentW - 8);
            doc.text(descLines.slice(0, 2), margin + 5, y);
            y += descLines.slice(0, 2).length * 4;
          }

          y += 4;
        });
      }

      // ── Footer on every page ───────────────────────────────────────
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(160, 160, 160);
        doc.text(
          `SettleSmart Canada  ·  settlesmart.ca  ·  Page ${i} of ${pageCount}`,
          pageW / 2,
          pageH - 8,
          { align: 'center' }
        );
      }

      doc.save(`SettleSmart_Roadmap_${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={exporting || checklist.length === 0}
      variant="outline"
      size="sm"
      className="rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/5"
    >
      {exporting ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
      ) : (
        <><FileDown className="w-4 h-4" /> Export PDF</>
      )}
    </Button>
  );
}