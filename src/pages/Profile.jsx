import { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { currentUser } from '@/lib/guestUser';
import { Button } from '@/components/ui/button';
import {
  User, MapPin, Globe, BookOpen, Briefcase, Home as HomeIcon,
  Scale, Heart, Sparkles, Save, LogOut, Loader2, CheckCircle2, Trash2,
  ExternalLink, BarChart3
} from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, Link } from 'react-router-dom';
import { PROVINCES, PROVINCE_CITIES } from '@/data/canadaLocations';

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
  arrival_date: '',
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

  const { requireAuth } = useAuth();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => currentUser(),
  });

  // Owner-only overview, shown strictly for this admin account.
  const isOwner = user?.email === 'charzlwebz256@gmail.com';
  const { data: visitCount } = useQuery({
    queryKey: ['appVisitCount'],
    queryFn: () => base44.entities.AppVisit.count({}),
    enabled: isOwner,
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const u = await currentUser();
      if (!u) return null;
      const results = await base44.entities.UserProfile.filter({ created_by_id: u.id }, '-updated_date');
      if (!results || results.length === 0) return null;
      // Match AppLayout: prefer the completed onboarding profile, fall back to
      // the most recently updated record. Keeps a single source of truth when
      // duplicate profile records exist.
      return results.find(p => p.onboarding_completed) || results[0];
    },
  });

  const [form, setForm] = useState(null);

  // Populate the form from the profile exactly once, only while form is
  // still null. We never re-sync from a refetch (which may return a new
  // reference or even a different record), so in-progress edits are never
  // overwritten. After a save, handleSave sets the form explicitly.
  useEffect(() => {
    if (!form && !isLoading) {
      setForm(profile ? { ...profile } : { ...BLANK_PROFILE });
    }
  }, [profile, form, isLoading]);

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
    if (!requireAuth()) return;
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
          const u = await currentUser();
          if (!u) return null;
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
        <p className="text-muted-foreground text-sm">
          {user ? (user.full_name || user.email) : 'Browsing as a guest. Sign in to save your profile.'}
        </p>
      </div>

      {isOwner && (
        <div className="mb-6 rounded-2xl border border-border/50 bg-card p-5">
          <h3 className="mb-1 flex items-center gap-2 font-heading text-sm font-bold">
            <BarChart3 className="w-4 h-4 text-primary" />
            Admin overview
          </h3>
          <p className="font-heading text-3xl font-bold">{visitCount ?? '—'}</p>
          <p className="text-xs text-muted-foreground">Total visits to SettleSmart</p>
        </div>
      )}

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
              <Select value={form.province || undefined} onValueChange={updateProvince}>
                <SelectTrigger className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">City</label>
              <Select value={form.city || undefined} onValueChange={v => updateField('city', v)} disabled={!form.province}>
                <SelectTrigger className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  <SelectValue placeholder={form.province ? 'Select city' : 'Select province first'} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date landed in Canada</label>
              <input
                type="date"
                value={form.arrival_date || ''}
                max={new Date().toISOString().slice(0, 10)}
                onChange={e => updateField('arrival_date', e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <p className="text-[11px] text-muted-foreground mt-1.5">
                We use this to count how many days you have spent in Canada on your home page.
              </p>
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
              <Select value={form.immigration_status || undefined} onValueChange={v => updateField('immigration_status', v)}>
                <SelectTrigger className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {IMMIGRATION_STATUSES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">English Level</label>
              <Select value={form.english_level || undefined} onValueChange={v => updateField('english_level', v)}>
                <SelectTrigger className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
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
          {user && (
            <Button variant="outline" onClick={handleLogout} className="rounded-xl gap-2">
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          )}
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
        {user && (
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
        )}
      </div>
    </div>
  );
}