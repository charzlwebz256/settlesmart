import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  User, MapPin, Globe, BookOpen, Briefcase, Home as HomeIcon,
  Scale, Heart, Sparkles, Save, LogOut, Loader2, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const interestOptions = [
  { value: 'education', label: 'Education', icon: BookOpen },
  { value: 'employment', label: 'Employment', icon: Briefcase },
  { value: 'housing', label: 'Housing', icon: HomeIcon },
  { value: 'legal', label: 'Legal', icon: Scale },
  { value: 'health', label: 'Health', icon: Heart },
  { value: 'volunteering', label: 'Community', icon: Sparkles },
];

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const u = await base44.auth.me();
      const results = await base44.entities.UserProfile.filter({ created_by: u.email });
      return results[0] || null;
    },
  });

  const [form, setForm] = useState(null);

  // Initialize form when profile loads
  if (profile && !form) {
    setForm({ ...profile });
  }

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleInterest = (val) => {
    setForm(prev => ({
      ...prev,
      interests: (prev.interests || []).includes(val)
        ? prev.interests.filter(i => i !== val)
        : [...(prev.interests || []), val]
    }));
  };

  const handleSave = async () => {
    if (!form || !profile) return;
    setSaving(true);
    await base44.entities.UserProfile.update(profile.id, form);
    queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-heading font-bold text-xl mb-3">Complete Your Profile</h2>
        <p className="text-muted-foreground text-sm mb-6">Set up your profile to get personalized recommendations</p>
        <Button onClick={() => navigate('/onboarding')} className="rounded-xl gap-2 bg-primary hover:bg-primary/90">
          <Sparkles className="w-4 h-4" />
          Start Onboarding
        </Button>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Your Profile</h1>
        <p className="text-muted-foreground text-sm">
          {user?.full_name || user?.email}
        </p>
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="font-heading font-bold text-base mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Location
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Province</label>
              <select
                value={form.province || ''}
                onChange={e => updateField('province', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
              >
                {['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">City</label>
              <Input value={form.city || ''} onChange={e => updateField('city', e.target.value)} className="rounded-lg" />
            </div>
          </div>
        </div>

        {/* Status & Language */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="font-heading font-bold text-base mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Status & Language
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Immigration Status</label>
              <select
                value={form.immigration_status || ''}
                onChange={e => updateField('immigration_status', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
              >
                {['permanent_resident', 'refugee', 'international_student', 'temporary_worker', 'asylum_seeker', 'citizen'].map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">English Level</label>
              <select
                value={form.english_level || ''}
                onChange={e => updateField('english_level', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
              >
                {['none', 'beginner', 'intermediate', 'advanced', 'fluent'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="font-heading font-bold text-base mb-4">Your Interests</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {interestOptions.map(opt => {
              const active = (form.interests || []).includes(opt.value);
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleInterest(opt.value)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all",
                    active ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {opt.label}
                  {active && <CheckCircle2 className="w-3.5 h-3.5 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl gap-2 bg-primary hover:bg-primary/90"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </Button>
          <Button variant="outline" onClick={handleLogout} className="rounded-xl gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}