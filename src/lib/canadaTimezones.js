// IANA timezone for each Canadian province and territory, plus helpers to
// render a live clock and pick a greeting in the user's own timezone.
const PROVINCE_TZ = {
  'Alberta': 'America/Edmonton',
  'British Columbia': 'America/Vancouver',
  'Manitoba': 'America/Winnipeg',
  'New Brunswick': 'America/Moncton',
  'Newfoundland and Labrador': 'America/St_Johns',
  'Newfoundland & Labrador': 'America/St_Johns',
  'Northwest Territories': 'America/Yellowknife',
  'Nova Scotia': 'America/Halifax',
  'Nunavut': 'America/Iqaluit',
  'Ontario': 'America/Toronto',
  'Prince Edward Island': 'America/Halifax',
  'Quebec': 'America/Toronto',
  'Saskatchewan': 'America/Regina',
  'Yukon': 'America/Whitehorse',
};

export function deviceTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Toronto';
  } catch {
    return 'America/Toronto';
  }
}

// A known city's province wins; otherwise fall back to the device timezone.
export function timezoneForLocation(province) {
  return PROVINCE_TZ[province] || deviceTimezone();
}

// Hour of the day (0–23) at that timezone.
export function hourInZone(date, timeZone) {
  try {
    return Number(
      new Intl.DateTimeFormat('en-CA', { timeZone, hour: 'numeric', hour12: false }).format(date)
    ) % 24;
  } catch {
    return date.getHours();
  }
}

export function formatClock(date, timeZone) {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  } catch {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  }
}

export function formatDate(date, timeZone) {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  }
}