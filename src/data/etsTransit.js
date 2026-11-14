// Edmonton Transit Service (ETS) reference data and official links.
// Sources: edmonton.ca/edmonton-transit-system-ets and edmonton.ca/ets/maps-routes-schedules-service
export const ETS_LINKS = {
  home: 'https://www.edmonton.ca/edmonton-transit-system-ets',
  routes: 'https://www.edmonton.ca/ets/maps-routes-schedules-service',
  schedules: 'https://www.edmonton.ca/ets/route-schedules-and-maps',
  alerts: 'https://www.edmonton.ca/ets/general-service-alerts',
  tripPlanner: 'https://tripplanner.edmonton.ca/#/app/tripplanning',
  lrt: 'https://www.edmonton.ca/ets/lrt-station-locations',
  fares: 'https://www.edmonton.ca/ets/fares-passes',
  airport: 'https://www.edmonton.ca/ets/edmonton-international-airport',
  owl: 'https://www.edmonton.ca/ets/late-night-owl-service',
  onDemand: 'https://www.edmonton.ca/ets/on-demand-transit',
  transitApp: 'https://transitapp.com/en/region/edmonton',
  busLink: 'tel:+17804961600',
};

export const ETS_LRT_LINES = [
  { name: 'Capital Line', endpoints: 'Clareview ↔ Century Park', tone: 'bg-red-500' },
  { name: 'Metro Line', endpoints: 'NAIT ↔ Health Sciences/Jubilee', tone: 'bg-blue-600' },
  { name: 'Valley Line', endpoints: '102 Street ↔ Mill Woods', tone: 'bg-emerald-600' },
];

export const ETS_SERVICE_FACTS = [
  { label: 'LRT frequency', value: 'Every 5–10 min at peak, about 15 min off-peak and weekends' },
  { label: 'Frequent bus routes', value: 'Every 15 min or better, roughly 6 am – 9 pm' },
  { label: 'Late Night Owl', value: 'Five bus routes run until about 3 am, seven days a week' },
  { label: 'Airport service', value: 'Route 747 links Century Park Transit Centre and Edmonton International Airport daily' },
];

export const ETS_QUICK_LINKS = [
  { label: 'Route schedules & maps', href: ETS_LINKS.schedules },
  { label: 'Service alerts', href: ETS_LINKS.alerts },
  { label: 'Trip planner', href: ETS_LINKS.tripPlanner },
  { label: 'LRT stations', href: ETS_LINKS.lrt },
  { label: 'Fares & passes', href: ETS_LINKS.fares },
  { label: 'On Demand Transit', href: ETS_LINKS.onDemand },
];