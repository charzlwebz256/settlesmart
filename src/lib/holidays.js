import { parseISO, isSameDay } from 'date-fns';

// Helper to calculate Easter Sunday for any year (Meeus/Jones/Butcher algorithm)
function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

// Calculate variable holidays for a given year
function getVariableHolidays(year, country) {
  const holidays = [];
  const easter = getEasterSunday(year);

  if (country === 'Uganda' || country === 'Both') {
    // Uganda religious holidays
    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);
    holidays.push({ date: goodFriday, name: 'Good Friday', country: 'Uganda' });

    const easterMonday = new Date(easter);
    easterMonday.setDate(easter.getDate() + 1);
    holidays.push({ date: easterMonday, name: 'Easter Monday', country: 'Uganda' });

    // Eid dates (approximate - based on lunar calendar)
    // 2026 estimates
    if (year === 2026) {
      holidays.push({ date: new Date(year, 2, 20), name: 'Eid al-Fitr', country: 'Uganda' }); // March 20
      holidays.push({ date: new Date(year, 4, 27), name: 'Eid al-Adha', country: 'Uganda' }); // May 27
    } else if (year === 2027) {
      holidays.push({ date: new Date(year, 2, 10), name: 'Eid al-Fitr', country: 'Uganda' });
      holidays.push({ date: new Date(year, 4, 16), name: 'Eid al-Adha', country: 'Uganda' });
    }
  }

  if (country === 'Canada' || country === 'Both') {
    // Canada variable holidays
    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);
    holidays.push({ date: goodFriday, name: 'Good Friday', country: 'Canada' });

    const easterMonday = new Date(easter);
    easterMonday.setDate(easter.getDate() + 1);
    holidays.push({ date: easterMonday, name: 'Easter Monday', country: 'Canada' });

    // Victoria Day - Monday before May 25
    const may25 = new Date(year, 4, 25);
    const victoriaDay = new Date(may25);
    victoriaDay.setDate(25 - may25.getDay());
    if (victoriaDay.getDay() === 0) victoriaDay.setDate(24);
    holidays.push({ date: victoriaDay, name: 'Victoria Day', country: 'Canada' });

    // Labour Day - 1st Monday of September
    const sept1 = new Date(year, 8, 1);
    const labourDay = new Date(sept1);
    labourDay.setDate(1 + (7 - sept1.getDay()) % 7);
    if (labourDay.getMonth() !== 8) labourDay.setDate(8);
    holidays.push({ date: labourDay, name: 'Labour Day', country: 'Canada' });

    // Thanksgiving - 2nd Monday of October
    const oct1 = new Date(year, 9, 1);
    const thanksgiving = new Date(oct1);
    thanksgiving.setDate(1 + (7 - oct1.getDay()) % 7);
    if (thanksgiving.getMonth() !== 9) thanksgiving.setDate(8);
    thanksgiving.setDate(thanksgiving.getDate() + 7);
    holidays.push({ date: thanksgiving, name: 'Thanksgiving Day', country: 'Canada' });

    // Family Day - 3rd Monday of February (most provinces)
    const feb1 = new Date(year, 1, 1);
    let familyDay = new Date(feb1);
    familyDay.setDate(1 + (7 - feb1.getDay()) % 7);
    if (familyDay.getMonth() !== 1) familyDay.setDate(8);
    familyDay.setDate(familyDay.getDate() + 14);
    holidays.push({ date: familyDay, name: 'Family Day', country: 'Canada' });

    // Civic Holiday - 1st Monday of August
    const aug1 = new Date(year, 7, 1);
    const civicHoliday = new Date(aug1);
    civicHoliday.setDate(1 + (7 - aug1.getDay()) % 7);
    if (civicHoliday.getMonth() !== 7) civicHoliday.setDate(8);
    holidays.push({ date: civicHoliday, name: 'Civic Holiday', country: 'Canada' });

    // National Day for Truth & Reconciliation - Sept 30
    holidays.push({ date: new Date(year, 8, 30), name: 'National Day for Truth & Reconciliation', country: 'Canada' });

    // Remembrance Day - Nov 11
    holidays.push({ date: new Date(year, 10, 11), name: 'Remembrance Day', country: 'Canada' });
  }

  return holidays;
}

// Fixed holidays for each country
function getFixedHolidays(year, country) {
  const holidays = [];

  if (country === 'Uganda' || country === 'Both') {
    holidays.push(
      { date: new Date(year, 0, 1), name: "New Year's Day", country: 'Uganda' },
      { date: new Date(year, 0, 26), name: 'Liberation Day (NRM Day)', country: 'Uganda' },
      { date: new Date(year, 1, 16), name: 'Archbishop Janani Luwum Day', country: 'Uganda' },
      { date: new Date(year, 2, 8), name: "International Women's Day", country: 'Uganda' },
      { date: new Date(year, 4, 1), name: 'Labour Day', country: 'Uganda' },
      { date: new Date(year, 5, 3), name: 'Uganda Martyrs\' Day', country: 'Uganda' },
      { date: new Date(year, 5, 9), name: 'National Heroes\' Day', country: 'Uganda' },
      { date: new Date(year, 9, 9), name: 'Independence Day', country: 'Uganda' },
      { date: new Date(year, 11, 25), name: 'Christmas Day', country: 'Uganda' },
      { date: new Date(year, 11, 26), name: 'Boxing Day', country: 'Uganda' }
    );
  }

  if (country === 'Canada' || country === 'Both') {
    holidays.push(
      { date: new Date(year, 0, 1), name: "New Year's Day", country: 'Canada' },
      { date: new Date(year, 6, 1), name: 'Canada Day', country: 'Canada' },
      { date: new Date(year, 11, 25), name: 'Christmas Day', country: 'Canada' },
      { date: new Date(year, 11, 26), name: 'Boxing Day', country: 'Canada' }
    );
  }

  return holidays;
}

// Get all holidays for a date range
export function getHolidays(startDate, endDate, country = 'Both') {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  let allHolidays = [];

  for (let year = startYear; year <= endYear; year++) {
    allHolidays = [
      ...allHolidays,
      ...getFixedHolidays(year, country),
      ...getVariableHolidays(year, country)
    ];
  }

  // Filter by date range
  return allHolidays.filter(h => h.date >= startDate && h.date <= endDate);
}

// Check if a specific date is a holiday
export function isHoliday(date, country = 'Both') {
  const year = date.getFullYear();
  const holidays = [
    ...getFixedHolidays(year, country),
    ...getVariableHolidays(year, country)
  ];

  return holidays.find(h => isSameDay(h.date, date)) || null;
}

// Get holiday badge color
export function getHolidayBadgeColor(country) {
  if (country === 'Uganda') return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
  if (country === 'Canada') return 'bg-red-500/10 text-red-600 border-red-500/30';
  return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
}

// Get holiday flag emoji
export function getHolidayFlag(country) {
  if (country === 'Uganda') return '🇺🇬';
  if (country === 'Canada') return '🇨🇦';
  return '🌍';
}