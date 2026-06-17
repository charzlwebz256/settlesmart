import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  User, MapPin, Globe, BookOpen, Briefcase, Home as HomeIcon,
  Scale, Heart, Sparkles, Save, LogOut, Loader2, CheckCircle2, Trash2,
  ChevronDown, ExternalLink
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/mobile-select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useNavigate, Link } from 'react-router-dom';

const PROVINCE_CITIES = {
  'Alberta': ['Calgary', 'Edmonton', 'Lethbridge', 'Red Deer', 'Athabasca'],
  'British Columbia': ['Burnaby', 'Kelowna', 'Kamloops', 'New Westminster', 'North Vancouver', 'Prince George', 'Surrey', 'Vancouver', 'Victoria'],
  'Manitoba': ['Brandon', 'Winnipeg'],
  'New Brunswick': ['Fredericton', 'Moncton', 'Saint John', 'Sackville'],
  'Newfoundland and Labrador': ["St. John's", 'Labrador City', 'Happy Valley-Goose Bay'],
  'Nova Scotia': ['Halifax', 'Sydney', 'Truro', 'Wolfville'],
  'Ontario': ['Barrie', 'Belleville', 'Brampton', 'Guelph', 'Hamilton', 'Kingston', 'Kitchener', 'London', 'Mississauga', 'North Bay', 'Oakville', 'Oshawa', 'Ottawa', 'Peterborough', 'Sarnia', 'Sault Ste. Marie', 'St. Catharines', 'Sudbury', 'Thunder Bay', 'Timmins', 'Toronto', 'Waterloo', 'Windsor'],
  'Prince Edward Island': ['Charlottetown', 'Summerside'],
  'Quebec': ['Montreal', 'Quebec City', 'Sherbrooke'],
  'Saskatchewan': ['Melville', 'Moose Jaw', 'Regina', 'Saskatoon'],
  'Northwest Territories': ['Yellowknife'],
  'Nunavut': ['Iqaluit'],
  'Yukon': ['Whitehorse'],
};

const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
  'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
];

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
      const results = await base44.entities.UserProfile.filter({ created_by_id: u.id });
      return results[0] || null;
    },
  });

  const [form, setForm] = useState(null);

  // Initialize form when profile loads
  if (profile && !form) {
    setForm({ ...profile });
  }

  const cities = useMemo(() => PROVINCE_CITIES[form?.province] || [], [form?.province]);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const updateProvince = (value) => setForm(prev => ({ ...prev, province: value, city: '' }));
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
    try {
      await base44.entities.UserProfile.update(profile.id, form);
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  const handleDeleteAccount = async () => {
    if (profile) {
      await base44.entities.UserProfile.delete(profile.id);
    }
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
              <Select value={form.province || ''} onValueChange={updateProvince}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">City</label>
              <Select value={form.city || ''} onValueChange={v => updateField('city', v)} disabled={!form.province}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder={form.province ? 'Select city' : 'Select province first'} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select value={form.immigration_status || ''} onValueChange={v => updateField('immigration_status', v)}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {['permanent_resident', 'refugee', 'international_student', 'temporary_worker', 'asylum_seeker', 'citizen'].map(s => (
                    <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">English Level</label>
              <Select value={form.english_level || ''} onValueChange={v => updateField('english_level', v)}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {['none', 'beginner', 'intermediate', 'advanced', 'fluent'].map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        {/* Information */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="font-heading font-bold text-base mb-4">Information</h3>
          <div className="space-y-2">
            <Link to="/about" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-sm font-medium">About SettleSmart</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link to="/privacy" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <span className="text-sm font-medium">Privacy Policy</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5">
          <h3 className="font-heading font-bold text-sm text-destructive mb-1">Danger Zone</h3>
          <p className="text-xs text-muted-foreground mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="rounded-xl gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your profile, preferences, and all saved data. You will be signed out immediately. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}