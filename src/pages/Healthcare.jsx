import { useState } from 'react';
import {
  Heart, Phone, AlertTriangle, Stethoscope, Pill, ShieldCheck,
  ExternalLink, Brain, Baby, Building2, MapPin,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocation_ } from '@/lib/LocationContext';
import { PROVINCES, provincialHealth } from '@/data/provincialHealth';

const CARE = [
  {
    icon: Stethoscope,
    title: 'Family doctor',
    text: 'A family doctor gives ongoing care. Ask a settlement agency near you, or search your province\u2019s "find a doctor" service. Waitlists can be long, so register early.',
  },
  {
    icon: Building2,
    title: 'Walk-in clinics',
    text: 'No appointment needed for many minor issues and prescriptions. Bring your health card. Search "[your city] walk-in clinic" or call 211 for help finding one.',
  },
  {
    icon: AlertTriangle,
    title: 'Urgent care',
    text: 'For injuries or illnesses that are not life-threatening but cannot wait. If it is an emergency, call 911 or go to the nearest emergency department.',
  },
  {
    icon: Heart,
    title: 'Emergency department',
    text: 'For serious injury, chest pain, trouble breathing or other emergencies. Call 911 if you are unsure or cannot get there safely.',
  },
  {
    icon: Pill,
    title: 'Pharmacies',
    text: 'Pharmacists can advise on minor conditions and prescriptions. Some provinces let pharmacists treat common illnesses. Ask what is covered.',
  },
  {
    icon: Baby,
    title: 'Maternal & child care',
    text: 'Prenatal care, public health nurses and immunization are usually available. Ask a settlement worker or call 811 / your provincial health line.',
  },
];

const HELP_LINES = [
  { number: '911', label: 'Emergency, police, fire, ambulance', tel: '911', tone: 'bg-red-500/10 text-red-600' },
  { number: '811', label: 'Health advice line (where available)', tel: '811', tone: 'bg-rose-500/10 text-rose-600' },
  { number: '988', label: 'Suicide crisis helpline, call or text', tel: '988', tone: 'bg-violet-500/10 text-violet-600' },
  { number: '211', label: 'Community and social services', tel: '211', tone: 'bg-sky-500/10 text-sky-600' },
];

export default function Healthcare() {
  const { province: detectedProvince } = useLocation_();
  const [province, setProvince] = useState(
    PROVINCES.includes(detectedProvince) ? detectedProvince : 'Ontario'
  );
  const health = provincialHealth[province];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-12">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2 flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" />
          Healthcare &amp; Wellness
        </h1>
        <p className="text-muted-foreground text-sm">
          Understand Canada&apos;s health system and get the care you need.
        </p>
      </div>

      {/* Emergency */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-heading font-bold text-sm text-red-700 dark:text-red-400">In an emergency, call 911</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            For police, fire or ambulance. If you are in danger or unsure, call 911, it is free and available 24/7.
          </p>
        </div>
      </div>

      {/* Health card */}
      <div className="bg-card rounded-2xl border border-border/50 p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h2 className="font-heading font-bold text-base">Get your health card</h2>
        </div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Your province or territory</label>
        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger className="w-full h-10 rounded-xl border border-input bg-transparent px-3 text-sm">
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent>
            {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="mt-4 p-4 rounded-xl bg-muted/50">
          <p className="text-sm font-semibold mb-0.5">{province}: {health.plan}</p>
          <p className="text-xs text-muted-foreground mb-3">
            Administered by {health.authority}. Apply as soon as you arrive, some provinces have a waiting
            period before coverage starts, so ask about interim coverage if you need care right away.
          </p>
          <a
            href={health.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            Official {health.plan} information <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Help lines */}
      <h2 className="font-heading font-bold text-sm mb-3 flex items-center gap-2">
        <Phone className="w-4 h-4 text-primary" /> Helplines
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {HELP_LINES.map(line => (
          <a
            key={line.number}
            href={`tel:${line.tel}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${line.tone}`}>
              {line.number}
            </div>
            <p className="text-xs text-muted-foreground leading-snug">{line.label}</p>
          </a>
        ))}
      </div>

      {/* Getting care */}
      <h2 className="font-heading font-bold text-sm mb-3 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" /> Where to get care
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {CARE.map(item => (
          <div key={item.title} className="p-4 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-2 mb-1.5">
              <item.icon className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-bold text-sm">{item.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Mental health & newcomer health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-2xl bg-card border border-border/50">
          <div className="flex items-center gap-2 mb-1.5">
            <Brain className="w-4 h-4 text-primary" />
            <h3 className="font-heading font-bold text-sm">Mental health support</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            Free, confidential help is available. Call or text 988 for the Suicide Crisis Helpline, or call 211
            for counselling and trauma support near you.
          </p>
          <a href="https://988.ca" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
            988.ca <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/50">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h3 className="font-heading font-bold text-sm">Refugees &amp; students</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            Refugees and protected persons may be covered by the Interim Federal Health Program (IFHP).
            International students should check their school&apos;s international health plan.
          </p>
          <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees/help-within-canada/health-care/interim-federal-health-program.html"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
            IFHP information <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
        This page is general information, not medical advice. Coverage and services differ by province and by
        immigration status. Always confirm details with your provincial health authority or by calling 811 or 211.
      </p>
    </div>
  );
}