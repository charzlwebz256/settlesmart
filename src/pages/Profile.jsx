import { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  User, MapPin, Globe, BookOpen, Briefcase, Home as HomeIcon,
  Scale, Heart, Sparkles, Save, LogOut, Loader2, CheckCircle2, Trash2,
  ExternalLink
} from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { MobileSelect as Select, MobileSelectContent as SelectContent, MobileSelectItem as SelectItem, MobileSelectTrigger as SelectTrigger, MobileSelectValue as SelectValue } from '@/components/ui/mobile-select';
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

const IMMIGRATION_STATUSES = [
  { value: 'permanent_resident', label: 'Permanent Resident' },
  { value: 'refugee', label: 'Refugee' },
  { value: 'international_student', label: 'International Student' },
  { value: 'temporary_worker', label: 'Temporary Worker' },
  { value: 'asylum_seeker', label: 'Asylum Seeker' },
  { value: 'citizen', label: 'Citizen' },
];

const ENGLISH_LEVELS = [
  { value: 'none', label: 'None' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'fluent', label: 'Fluent' },
];

const interestOptions = [
  { value: 'education', label: 'Education', icon: BookOpen },
  { value: 'employment', label: 'Employment', icon: Briefcase },
  { value: 'housing', label: 'Housing', icon: HomeIcon },
  { value: 'legal', label: 'Legal', icon: Scale },
  { value: 'health', label: 'Health', icon: Heart },
  { value: 'volunteering', label: 'Community', icon: Sparkles },
];

const BLANK_PROFILE = {
  immigration_status: '',
  province: '',
  city: '',
  language_preference: 'en',
  interests: [],
  english_level: '',
  french_level: '',
  education_level: '',
  onboarding_completed: false,
};

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const u = await base44.auth.me();
      const results = await base44.entities.UserProfile.filter({ created_by_id: u.id }, '-updated_date');
      if (!results || results.length === 0) return null;
      // Match AppLayout: prefer the completed onboarding profile, fall back to
      // the most recently updated record. Keeps a single source of truth when
      // duplicate profile records exist.
      return results.find(p => p.onboarding_completed) || results[0];
    },
  });

  const [form, setForm] = useState(null);

  // Populate the form from the profile exactly once — only while form is
  // still null. We never re-sync from a refetch (which may return a new
  // reference or even a different record), so in-progress edits are never
  // overwritten. After a save, handleSave sets the form explicitly.
  useEffect(() => {
    if (!form) {
      setForm(profile ? { ...profile } : { ...BLANK_PROFILE });
    }
  }, [profile, form]);

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
    if (!form) return;
    if (!form.immigration_status || !form.province || !form.city) {
      setSaveError('Please select your immigration status, province, and city before saving.');
      return;
    }
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    const { id, created_date, updated_date, created_by_id, ...rawPayload } = form;
    const payload = Object.fromEntries(
      Object.entries(rawPayload).filter(([, v]) => v !== '' && v !== undefined)
    );
    try {
      // Update existing profile, or create one if none exists yet (blank profile on first sign-in)
      if (id) {
        await base44.entities.UserProfile.update(id, payload);
      } else {
        await base44.entities.UserProfile.create(payload);
      }
      // Bust cache so every screen (Dashboard, Home, etc.) reflects the saved data
      await queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      const fresh = await queryClient.fetchQuery({
        queryKey: ['myProfile'],
        queryFn: async () => {
          const u = await base44.auth.me();
          const results = await base44.entities.UserProfile.filter({ created_by_id: u.id }, '-updated_date');
          if (!results || results.length === 0) return null;
          return results.find(p => p.onboarding_completed) || results[0];
        },
      });
      if (fresh) setForm({ ...fresh });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err?.message || 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => base44.auth.logout('/');

  const handleDeleteAccount = async () => {
    if (profile) await base44.entities.UserProfile.delete(profile.id);
    base44.auth.logout('/');
  };

  // Show the loading spinner only on the very first load (no form data yet)
  if (isLoading && !form) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Your Profile</h1>
        <p className="text-muted-foreground text-sm">{user?.full_name || user?.email}</p>
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
                <SelectTrigger className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent label="Province">
                  {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">City</label>
              <Select value={form.city || ''} onValueChange={v => updateField('city', v)} disabled={!form.province}>
                <SelectTrigger className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  <SelectValue placeholder={form.province ? 'Select city' : 'Select province first'} />
                </SelectTrigger>
                <SelectContent label="City">
                  {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                <SelectTrigger className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent label="Immigration Status">
                  {IMMIGRATION_STATUSES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">English Level</label>
              <Select value={form.english_level || ''} onValueChange={v => updateField('english_level', v)}>
                <SelectTrigger className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent label="English Level">
                  {ENGLISH_LEVELS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
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
            className={cn(
              "flex-1 rounded-xl gap-2 bg-primary hover:bg-primary/90 relative overflow-hidden transition-all duration-300 active:scale-95",
              saving ? "saving-shimmer saving-pulse scale-[0.97]" : saved ? "bg-emerald-600 hover:bg-emerald-600" : ""
            )}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 success-pop" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </Button>
          <Button variant="outline" onClick={handleLogout} className="rounded-xl gap-2">
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>
        {saveError && (
          <p className="text-xs text-destructive -mt-2 px-1">{saveError}</p>
        )}

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