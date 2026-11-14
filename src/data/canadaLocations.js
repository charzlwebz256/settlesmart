/**
 * Single source of truth for Canadian provinces, territories and their cities.
 * Every province/city picker in the app reads from here so the options never drift.
 */
export const PROVINCES = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Northwest Territories',
  'Nova Scotia',
  'Nunavut',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Yukon',
];

export const PROVINCE_CITIES = {
  'Alberta': ['Calgary', 'Edmonton', 'Lethbridge', 'Red Deer', 'Athabasca'],
  'British Columbia': ['Burnaby', 'Kamloops', 'Kelowna', 'New Westminster', 'North Vancouver', 'Prince George', 'Surrey', 'Vancouver', 'Victoria'],
  'Manitoba': ['Brandon', 'Winnipeg'],
  'New Brunswick': ['Fredericton', 'Moncton', 'Saint John', 'Sackville'],
  'Newfoundland and Labrador': ["St. John's", 'Labrador City', 'Happy Valley-Goose Bay'],
  'Northwest Territories': ['Yellowknife'],
  'Nova Scotia': ['Halifax', 'Sydney', 'Truro', 'Wolfville'],
  'Nunavut': ['Iqaluit'],
  'Ontario': ['Barrie', 'Belleville', 'Brampton', 'Guelph', 'Hamilton', 'Kingston', 'Kitchener', 'London', 'Mississauga', 'North Bay', 'Oakville', 'Oshawa', 'Ottawa', 'Peterborough', 'Sarnia', 'Sault Ste. Marie', 'St. Catharines', 'Sudbury', 'Thunder Bay', 'Timmins', 'Toronto', 'Waterloo', 'Windsor'],
  'Prince Edward Island': ['Charlottetown', 'Summerside'],
  'Quebec': ['Montreal', 'Quebec City', 'Sherbrooke'],
  'Saskatchewan': ['Melville', 'Moose Jaw', 'Regina', 'Saskatoon'],
  'Yukon': ['Whitehorse'],
};

/** Cities for a province, always an array. */
export function citiesFor(province) {
  return PROVINCE_CITIES[province] || [];
}