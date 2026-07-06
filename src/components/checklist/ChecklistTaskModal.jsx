import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'documents', 'housing', 'banking', 'health', 'education',
  'employment', 'transportation', 'social', 'legal',
];

const PERIODS = [
  { value: 'week1', label: 'Week 1: First Steps' },
  { value: 'week2', label: 'Week 2: Getting Settled' },
  { value: 'week3', label: 'Week 3: Building Connections' },
  { value: 'week4', label: 'Week 4: Moving Forward' },
  { value: 'month2', label: 'Month 2: Deepening Roots' },
  { value: 'month3', label: 'Month 3: Growing Independence' },
];

const emptyForm = {
  title: '', description: '', category: 'documents',
  day_range: 'week1', link: '',
};

export default function ChecklistTaskModal({ open, onOpenChange, task, onSave }) {
  const isEdit = Boolean(task?.id);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setForm(task ? {
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'documents',
        day_range: task.day_range || 'week1',
        link: task.link || '',
      } : emptyForm);
    }
  }, [open, task]);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('A title is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        ...(isEdit ? { id: task.id } : {}),
        ...form,
        link: form.link.trim() || undefined,
        description: form.description.trim() || undefined,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Task' : 'Add Custom Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Title</label>
            <Input
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder="e.g. Renew passport"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
            <Textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Optional details about this step"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
              <NativeSelect value={form.category} onChange={v => update('category', v)}
                options={CATEGORIES.map(c => ({ value: c, label: c }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">When</label>
              <NativeSelect value={form.day_range} onChange={v => update('day_range', v)}
                options={PERIODS} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Resource link (optional)</label>
            <Input
              value={form.link}
              onChange={e => update('link', e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isEdit ? 'Save Changes' : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NativeSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className={cn(
          "w-full h-9 appearance-none rounded-lg border border-input bg-transparent px-3 pr-8 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring capitalize"
        )}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}