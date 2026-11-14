import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { cleanText, safeUrl } from '../../shared/safeUrl.ts';
import { planRoute } from '../../shared/routing.ts';

const PLACES_SCHEMA = {
  type: 'object',
  properties: {
    places: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          category: { type: 'string' },
          address: { type: 'string' },
          phone: { type: 'string' },
          website: { type: 'string' },
          notes: { type: 'string' },
        },
      },
    },
  },
};

const SUGGESTIONS_SCHEMA = {
  type: 'object',
  properties: {
    places: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          address: { type: 'string' },
          lat: { type: 'number' },
          lng: { type: 'number' },
        },
      },
    },
  },
};

// Weather, nearby services, and the map lookups used by the transit page.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));
    const action = payload.action;
    const llm = (args) => base44.asServiceRole.integrations.Core.InvokeLLM(args);

    if (action === 'weather') {
      const city = cleanText(payload.city, 80);
      if (!city) return Response.json({ error: 'A city is required.' }, { status: 400 });
      const province = cleanText(payload.province, 60);

      const result = await llm({
        prompt: `Get current weather conditions for ${city}, ${province || 'Canada'}. Return ONLY: temperature (C), condition (sunny/cloudy/rainy), humidity (%), wind_speed (km/h), visibility (km), feels_like (C). Format as JSON.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            temperature: { type: 'number' },
            condition: { type: 'string' },
            humidity: { type: 'number' },
            wind_speed: { type: 'number' },
            visibility: { type: 'number' },
            feels_like: { type: 'number' },
          },
        },
      });

      return Response.json({ weather: result || null });
    }

    if (action === 'nearby_services') {
      const city = cleanText(payload.city, 80);
      if (!city) return Response.json({ error: 'A city is required.' }, { status: 400 });
      const province = cleanText(payload.province, 60);

      const result = await llm({
        prompt: `Find 8 real, currently operating local services for newcomers in ${city}, ${province || 'Canada'}.
Include 2 of each: food banks, walk-in clinics, settlement agencies, community centres.
For each return: name, category (food_bank/clinic/settlement/community), address, phone, website, notes (one short sentence).`,
        add_context_from_internet: true,
        response_json_schema: PLACES_SCHEMA,
      });

      const places = (Array.isArray(result?.places) ? result.places.slice(0, 12) : []).map((place) => ({
        name: cleanText(place?.name, 140),
        category: ['food_bank', 'clinic', 'settlement', 'community'].includes(place?.category) ? place.category : 'community',
        address: cleanText(place?.address, 200),
        phone: cleanText(place?.phone, 40),
        website: safeUrl(place?.website),
        notes: cleanText(place?.notes, 300),
      }));

      return Response.json({ places });
    }

    if (action === 'place_lookup') {
      const query = cleanText(payload.query, 120);
      if (query.length < 2) return Response.json({ places: [] });

      const result = await llm({
        prompt: `Find 5 real places/addresses in Canada matching "${query}". Return JSON array: [{"name": "Place Name", "address": "Full Address", "lat": number, "lng": number}, ...]`,
        add_context_from_internet: true,
        response_json_schema: SUGGESTIONS_SCHEMA,
      });

      const places = (Array.isArray(result?.places) ? result.places.slice(0, 6) : [])
        .map((place) => ({
          name: cleanText(place?.name, 140),
          address: cleanText(place?.address, 200),
          lat: Number(place?.lat),
          lng: Number(place?.lng),
        }))
        .filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lng));

      return Response.json({ places });
    }

    if (action === 'geocode') {
      const address = cleanText(payload.address, 200);
      if (!address) return Response.json({ error: 'An address is required.' }, { status: 400 });

      const result = await llm({
        prompt: `Get the latitude and longitude coordinates for "${address}" in Canada. Return ONLY JSON: {"lat": number, "lng": number}`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: { lat: { type: 'number' }, lng: { type: 'number' } },
        },
      });

      const lat = Number(result?.lat);
      const lng = Number(result?.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return Response.json({ error: 'Could not find that address.' }, { status: 404 });
      }
      return Response.json({ lat, lng });
    }

    if (action === 'route') {
      const start = Array.isArray(payload.start) ? payload.start.map(Number) : [];
      const end = Array.isArray(payload.end) ? payload.end.map(Number) : [];
      const valid = (pair) => pair.length === 2 && Number.isFinite(pair[0]) && Number.isFinite(pair[1])
        && Math.abs(pair[0]) <= 90 && Math.abs(pair[1]) <= 180;
      if (!valid(start) || !valid(end)) return Response.json({ error: 'Two valid coordinate pairs are required.' }, { status: 400 });

      const mode = ['walking', 'cycling', 'transit', 'driving'].includes(payload.mode) ? payload.mode : 'transit';
      const route = await planRoute(start, end, mode);

      return Response.json({ route });
    }

    if (action === 'reverse_geocode') {
      const latitude = Number(payload.latitude);
      const longitude = Number(payload.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return Response.json({ error: 'Valid coordinates are required.' }, { status: 400 });
      }

      const result = await llm({
        prompt: `Given latitude ${latitude} and longitude ${longitude} in Canada, determine the nearest city and province. Return JSON with city (string) and province (string, full name e.g. "Ontario") fields only.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: { city: { type: 'string' }, province: { type: 'string' } },
        },
      });

      return Response.json({
        city: cleanText(result?.city, 80),
        province: cleanText(result?.province, 80),
      });
    }

    // Street address for a coordinate pair, so the map can name a place instead of numbers.
    if (action === 'reverse_address') {
      const latitude = Number(payload.latitude);
      const longitude = Number(payload.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return Response.json({ error: 'Valid coordinates are required.' }, { status: 400 });
      }

      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=en`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'SettleSmart/1.0 (newcomer settlement app)', 'Accept': 'application/json' },
      });
      if (!response.ok) return Response.json({ address: '' });

      const data = await response.json().catch(() => null);
      const address = data?.address || {};
      const street = [address.house_number, address.road].filter(Boolean).join(' ');
      const locality = address.city || address.town || address.village || address.hamlet || address.suburb || '';
      const parts = [street, locality, address.state || address.province || '', address.postcode || '']
        .map((part) => String(part || '').trim())
        .filter(Boolean);

      const fallback = String(data?.display_name || '')
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 3)
        .join(', ');

      return Response.json({ address: cleanText(parts.join(', ') || fallback, 200) });
    }

    return Response.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}