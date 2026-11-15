/**
 * FlySmart, flight search, booking sites and airline booking engines used in Canada.
 * Logos come from the Google favicon service, which is reliable for every brand.
 */

const logo = (domain) => `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

export const SECTIONS = [
  {
    id: 'search',
    label: '🔎 Flight search & price comparison',
    note: 'Compare airlines, agencies and flexible dates before you book.',
    tint: 'blue',
    cta: 'Visit',
    items: [
      {
        name: 'Google Flights',
        url: 'https://www.google.com/travel/flights',
        logo: logo('google.com'),
        desc: 'Flight comparison, flexible dates and price tracking.',
      },
      {
        name: 'Skyscanner',
        url: 'https://www.skyscanner.ca',
        logo: logo('skyscanner.ca'),
        desc: 'Compare airlines, agencies and flexible travel dates.',
      },
      {
        name: 'KAYAK',
        url: 'https://www.ca.kayak.com',
        logo: logo('kayak.com'),
        desc: 'Flight comparison and fare alerts.',
      },
      {
        name: 'Momondo',
        url: 'https://www.momondo.ca',
        logo: logo('momondo.ca'),
        desc: 'Compare flight prices and alternative routes.',
      },
    ],
  },
  {
    id: 'booking',
    label: '🎫 Flight booking websites',
    note: 'Travel agencies and online booking platforms that sell Canadian routes.',
    tint: 'violet',
    cta: 'Visit',
    items: [
      {
        name: 'Expedia Canada',
        url: 'https://www.expedia.ca',
        logo: logo('expedia.ca'),
        desc: 'Flights, hotels and packages, with member prices and flexible payment options.',
      },
      {
        name: 'FlightHub',
        url: 'https://www.flighthub.com',
        logo: logo('flighthub.com'),
        desc: 'Canadian online travel agency for domestic and international flights.',
      },
      {
        name: 'CheapOair',
        url: 'https://www.cheapoair.ca',
        logo: logo('cheapoair.ca'),
        desc: 'Discounted fares, last-minute deals and multi-airline itineraries.',
      },
      {
        name: 'Trip.com',
        url: 'https://www.trip.com',
        logo: logo('trip.com'),
        desc: 'Flight booking plus hotels and trains, often with app-only fares.',
      },
      {
        name: 'Priceline',
        url: 'https://www.priceline.com',
        logo: logo('priceline.com'),
        desc: 'Compare fares and use Express Deals for discounted seats.',
      },
      {
        name: 'Redtag',
        url: 'https://www.redtag.ca',
        logo: logo('redtag.ca'),
        desc: 'Canadian travel site for flight and vacation packages.',
      },
      {
        name: 'Flight Centre',
        url: 'https://www.flightcentre.ca',
        logo: logo('flightcentre.ca'),
        desc: 'Travel agents who book flights and packages, online or in a branch.',
      },
    ],
  },
  {
    id: 'airlines',
    label: '✈️ Official airline booking websites',
    note: 'Book directly with the airline, the safest place for changes, baggage and seat selection.',
    tint: 'emerald',
    cta: 'Book flights',
    items: [
      {
        name: 'Air Canada',
        url: 'https://www.aircanada.com',
        logo: logo('aircanada.com'),
        desc: "Canada's largest airline, domestic and international routes from every major city.",
        cta: 'Book flights',
      },
      {
        name: 'WestJet',
        url: 'https://www.westjet.com',
        logo: logo('westjet.com'),
        desc: 'Domestic, transborder and international flights, strongest in western Canada.',
        cta: 'Book flights',
      },
      {
        name: 'Porter Airlines',
        url: 'https://www.flyporter.com',
        logo: logo('flyporter.com'),
        desc: 'Regional and North American flights from Toronto and Ottawa.',
        cta: 'Book flights',
      },
      {
        name: 'Air Transat',
        url: 'https://www.airtransat.com',
        logo: logo('airtransat.com'),
        desc: 'Leisure flights to Europe, the Caribbean, Mexico and the United States.',
        cta: 'Book flights',
      },
      {
        name: 'Flair Airlines',
        url: 'https://www.flyflair.com',
        logo: logo('flyflair.com'),
        desc: 'Low-cost domestic and transborder flights, baggage is paid separately.',
        cta: 'Book flights',
      },
      {
        name: 'Air North',
        url: 'https://www.flyairnorth.com',
        logo: logo('flyairnorth.com'),
        desc: 'Yukon-based airline flying to northern communities and western Canada.',
        cta: 'Book flights',
      },
      {
        name: 'Canadian North',
        url: 'https://www.canadiannorth.com',
        logo: logo('canadiannorth.com'),
        desc: 'Northern carrier connecting the territories with Edmonton, Winnipeg and Ottawa.',
        cta: 'Book flights',
      },
    ],
  },
];