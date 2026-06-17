import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const CATEGORIES = [
  'orientation', 'workshop', 'language', 'employment',
  'community', 'health', 'legal', 'housing', 'social',
];

export default function AddEventModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', category: 'community', date: '', time: '',
    location: '', city: '', province: '', organizer: '',
    description: '', is_free: true, is_online: false,
    registration_url: '', online_link: '',
  });
  const [saving, setSaving] = useState(false);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.category) return;
    setSaving(true);
    try {
      await base44.entities.Event.create(form);
      onCreated();
      onClose();
      setForm({ title: '', category: 'community', date: '', time: '', location: '', city: '', province: '', organizer: '', description: '', is_free: true, is_online: false, registration_url: '', online_link: '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Community Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Title *</label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Event title" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Date *</label>
              <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Start Time</label>
              <Input value={form.time} onChange={e => set('time', e.target.value)} placeholder="e.g. 10:00 AM" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Organizer</label>
              <Input value={form.organizer} onChange={e => set('organizer', e.target.value)} placeholder="Organization name" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">City</label>
              <Input value={form.city} onChange={e => set('city', e.target.value)} placeholder="City" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Province</label>
              <Input value={form.province} onChange={e => set('province', e.target.value)} placeholder="Province" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Location / Address</label>
            <Input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Venue name and address" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Event details..."
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring min-h-[80px] resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Registration URL</label>
            <Input value={form.registration_url} onChange={e => set('registration_url', e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_free} onChange={e => set('is_free', e.target.checked)} className="rounded" />
              Free event
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_online} onChange={e => set('is_online', e.target.checked)} className="rounded" />
              Online event
            </label>
          </div>
          {form.is_online && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Online Link</label>
              <Input value={form.online_link} onChange={e => set('online_link', e.target.value)} placeholder="https://zoom.us/..." />
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving} className="flex-1 gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Creating...' : 'Create Event'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}