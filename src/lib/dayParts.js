import { Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import { hourInZone } from './canadaTimezones';

// One card per part of the day: greeting wording, icon and colour wash.
// Every part shares the same welcome photo.
const WELCOME_IMAGE = 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/b1ae8607a_generated_image.png';

export const DAY_PARTS = [
  {
    key: 'morning',
    from: 5,
    to: 12,
    label: 'Good morning',
    Icon: Sunrise,
    image: WELCOME_IMAGE,
    alt: 'Newcomer family arriving in Canada in the morning light',
    tint: 'text-amber-600 dark:text-amber-400',
    grad: 'from-amber-100/70 via-card to-card dark:from-amber-950/30',
  },
  {
    key: 'afternoon',
    from: 12,
    to: 17,
    label: 'Good afternoon',
    Icon: Sun,
    image: WELCOME_IMAGE,
    alt: 'Newcomer family arriving in Canada in the afternoon sun',
    tint: 'text-primary',
    grad: 'from-primary/10 via-card to-card',
  },
  {
    key: 'evening',
    from: 17,
    to: 21,
    label: 'Good evening',
    Icon: Sunset,
    image: WELCOME_IMAGE,
    alt: 'Newcomer family settling into Canada in the evening',
    tint: 'text-orange-600 dark:text-orange-400',
    grad: 'from-orange-100/70 via-card to-card dark:from-orange-950/30',
  },
  {
    key: 'night',
    from: 21,
    to: 24,
    label: 'Good evening',
    Icon: Moon,
    image: WELCOME_IMAGE,
    alt: 'Newcomers resting after arriving in Canada',
    tint: 'text-indigo-600 dark:text-indigo-400',
    grad: 'from-indigo-100/60 via-card to-card dark:from-indigo-950/30',
  },
  {
    key: 'night',
    from: 0,
    to: 5,
    label: 'Good night',
    Icon: Moon,
    image: WELCOME_IMAGE,
    alt: 'Newcomers resting after arriving in Canada',
    tint: 'text-indigo-600 dark:text-indigo-400',
    grad: 'from-indigo-100/60 via-card to-card dark:from-indigo-950/30',
  },
];

// Resolve the greeting from the hour at the visitor's own timezone.
export function getDayPart(date = new Date(), timeZone) {
  const hour = timeZone ? hourInZone(date, timeZone) : date.getHours();
  return DAY_PARTS.find((p) => hour >= p.from && hour < p.to) || DAY_PARTS[0];
}