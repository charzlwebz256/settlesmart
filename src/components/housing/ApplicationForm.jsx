import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HOUSING_STATUSES } from '@/data/housingDirectory';
import { PROVINCES } from '@/data/nationalDirectory';

const EMPTY = {
  property_name: '',
  address: '',
  city: '',
  province: '',
  rent: '',
  bedrooms: '',
  source: '',
  listing_url: '',
  landlord_contact: '',
  status: 'saved',
  applied_date: '',
  follow_up_date: '',
  notes: '',
};

// Add or edit one tracked rental application.
export default function ApplicationForm({ open, onOpenChange, application, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    setForm(application ? { ...EMPTY, ...application } : EMPTY);
  }, [open, application]);

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.property_name.trim()) {
      setError('Add the property or listing name.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      property_name: form.property_name.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      province: form.province,
      rent: form.rent === '' ? null : Number(form.rent),
      bedrooms: form.bedrooms === '' ? null : Number(form.bedrooms),
      source: form.source.trim(),
      listing_url: form.listing_url.trim(),
      landlord_contact: form.landlord_contact.trim(),
      status: form.status,
      applied_date: form.applied_date || null,
      follow_up_date: form.follow_up_date || null,
      notes: form.notes.trim(),
    };
    try {
      if (application) await base44.entities.HousingApplication.update(application.id, payload);
      else await base44.entities.HousingApplication.create(payload);
      onSaved?.();
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || 'Could not save this application.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-base">{application ? 'Edit application' : 'Track a rental'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label htmlFor="property_name" className="text-xs">Property or listing name</Label>
            <Input id="property_name" value={form.property_name} onChange={set('property_name')} placeholder="e.g. 2-bed basement suite, Whyte Ave" className="mt-1 h-9 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="address" className="text-xs">Address</Label>
              <Input id="address" value={form.address} onChange={set('address')} className="mt-1 h-9 rounded-lg" />
            </div>
            <div>
              <Label htmlFor="city" className="text-xs">City</Label>
              <Input id="city" value={form.city} onChange={set('city')} className="mt-1 h-9 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Province</Label>
              <Select value={form.province || 'none'} onValueChange={(value) => setForm((prev) => ({ ...prev, province: value === 'none' ? '' : value }))}>
                <SelectTrigger className="mt-1 h-9 rounded-lg text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-xs">Not set</SelectItem>
                  {PROVINCES.map((province) => (
                    <SelectItem key={province} value={province} className="text-xs">{province}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rent" className="text-xs">Monthly rent ($)</Label>
              <Input id="rent" type="number" min="0" value={form.rent} onChange={set('rent')} className="mt-1 h-9 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="bedrooms" className="text-xs">Bedrooms</Label>
              <Input id="bedrooms" type="number" min="0" value={form.bedrooms} onChange={set('bedrooms')} className="mt-1 h-9 rounded-lg" />
            </div>
            <div>
              <Label htmlFor="source" className="text-xs">Found on</Label>
              <Input id="source" value={form.source} onChange={set('source')} placeholder="Rentals.ca, Kijiji…" className="mt-1 h-9 rounded-lg" />
            </div>
          </div>

          <div>
            <Label htmlFor="listing_url" className="text-xs">Listing link</Label>
            <Input id="listing_url" value={form.listing_url} onChange={set('listing_url')} placeholder="https://" className="mt-1 h-9 rounded-lg" />
          </div>

          <div>
            <Label htmlFor="landlord_contact" className="text-xs">Landlord or manager contact</Label>
            <Input id="landlord_contact" value={form.landlord_contact} onChange={set('landlord_contact')} className="mt-1 h-9 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger className="mt-1 h-9 rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOUSING_STATUSES.map((option) => (
                    <SelectItem key={option.id} value={option.id} className="text-xs">{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="applied_date" className="text-xs">Applied on</Label>
              <Input id="applied_date" type="date" value={form.applied_date || ''} onChange={set('applied_date')} className="mt-1 h-9 rounded-lg text-xs" />
            </div>
          </div>

          <div>
            <Label htmlFor="follow_up_date" className="text-xs">Follow up on</Label>
            <Input id="follow_up_date" type="date" value={form.follow_up_date || ''} onChange={set('follow_up_date')} className="mt-1 h-9 rounded-lg text-xs" />
          </div>

          <div>
            <Label htmlFor="notes" className="text-xs">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={set('notes')} rows={2} placeholder="Documents asked for, deposit, viewing time…" className="mt-1 rounded-lg text-xs" />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="rounded-lg">
              {saving ? 'Saving…' : application ? 'Save changes' : 'Add to tracker'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}