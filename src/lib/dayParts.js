import { Sunrise, Sun, Sunset, Moon } from 'lucide-react';

// One card per part of the day: greeting wording, icon, colour wash and photo.
export const DAY_PARTS = [
  {
    key: 'morning',
    from: 5,
    to: 12,
    label: 'Good morning',
    Icon: Sunrise,
    image: 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/cd305d025_generated_image.png',
    alt: 'Sunrise over a Canadian street as newcomers head to the light rail',
    tint: 'text-amber-600 dark:text-amber-400',
    grad: 'from-amber-100/70 via-card to-card dark:from-amber-950/30',
  },
  {
    key: 'afternoon',
    from: 12,
    to: 17,
    label: 'Good afternoon',
    Icon: Sun,
    image: 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/374c80a5b_generated_image.png',
    alt: 'Newcomers in a sunny downtown Canadian park',
    tint: 'text-primary',
    grad: 'from-primary/10 via-card to-card',
  },
  {
    key: 'evening',
    from: 17,
    to: 21,
    label: 'Good evening',
    Icon: Sunset,
    image: 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/0382f8ed3_generated_image.png',
    alt: 'Sunset over a Canadian skyline seen from the river',
    tint: 'text-orange-600 dark:text-orange-400',
    grad: 'from-orange-100/70 via-card to-card dark:from-orange-950/30',
  },
  {
    key: 'night',
    from: 21,
    to: 24,
    label: 'Good evening',
    Icon: Moon,
    image: 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/62e0715fc_generated_image.png',
    alt: 'City lights reflecting on a Canadian river at night',
    tint: 'text-indigo-600 dark:text-indigo-400',
    grad: 'from-indigo-100/60 via-card to-card dark:from-indigo-950/30',
  },
  {
    key: 'night',
    from: 0,
    to: 5,
    label: 'Good night',
    Icon: Moon,
    image: 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/62e0715fc_generated_image.png',
    alt: 'City lights reflecting on a Canadian river at night',
    tint: 'text-indigo-600 dark:text-indigo-400',
    grad: 'from-indigo-100/60 via-card to-card dark:from-indigo-950/30',
  },
];

export function getDayPart(date = new Date()) {
  const hour = date.getHours();
  return DAY_PARTS.find((p) => hour >= p.from && hour < p.to) || DAY_PARTS[0];
}