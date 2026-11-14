import { useEffect, useState } from 'react';
import { Loader2, LocateFixed } from 'lucide-react';
import { weatherInfo } from '@/lib/weatherCodes';

// Fallback coordinates for the main Canadian cities.
const CITY_COORDS = {
  edmonton: [53.5461, -113.4938],
  toronto: [43.6532, -79.3832],
  vancouver: [49.2827, -123.1207],
  calgary: [51.0447, -114.0719],
  montreal: [45.5017, -73.5673],
  ottawa: [45.4215, -75.6972],
  winnipeg: [49.8951, -97.1384],
  halifax: [44.6488, -63.5752],
  regina: [50.4452, -104.6189],
  saskatoon: [52.1332, -106.6700],
};

const DEFAULT_COORDS = CITY_COORDS.edmonton;

function gpsCoords() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
      () => resolve(null),
      { timeout: 8000, maximumAge: 10 * 60 * 1000 }
    );
  });
}

async function cityCoords(city, province) {
  if (!city) return DEFAULT_COORDS;
  const query = province ? `${city}, ${province}, Canada` : `${city}, Canada`;
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
    );
    const data = await res.json();
    const hit = data.results?.[0];
    if (hit) return [hit.latitude, hit.longitude];
  } catch {
    // fall through to the static list
  }
  return CITY_COORDS[city.toLowerCase()] || DEFAULT_COORDS;
}

// Live weather for the visitor's own position, used inside the welcome banner.
export default function BannerWeather({ city, province }) {
  const [weather, setWeather] = useState(null);
  const [usingGps, setUsingGps] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const gps = await gpsCoords();
      const coords = gps || (await cityCoords(city, province));
      if (cancelled) return;

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords[0]}&longitude=${coords[1]}` +
          `&current=temperature_2m,apparent_temperature,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
        );
        const data = await res.json();
        if (cancelled || !data.current) return;
        setUsingGps(!!gps);
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          feels: Math.round(data.current.apparent_temperature),
          code: data.current.weather_code,
          high: data.daily?.temperature_2m_max?.[0] != null ? Math.round(data.daily.temperature_2m_max[0]) : null,
          low: data.daily?.temperature_2m_min?.[0] != null ? Math.round(data.daily.temperature_2m_min[0]) : null,
        });
      } catch {
        // leave the chip empty when the weather service is unreachable
      }
    })();

    return () => { cancelled = true; };
  }, [city, province]);

  if (!weather) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/80 border border-border/60 text-xs font-medium text-muted-foreground">
        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading weather…
      </span>
    );
  }

  const info = weatherInfo(weather.code);

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/80 border border-border/60 text-xs font-medium">
      <span className="text-base leading-none">{info.emoji}</span>
      <span className="font-semibold">{weather.temp}°C</span>
      <span className="text-muted-foreground">{info.label}</span>
      {weather.high != null && (
        <span className="text-muted-foreground">· H {weather.high}° L {weather.low}°</span>
      )}
      {usingGps && <LocateFixed className="w-3 h-3 text-primary" />}
    </span>
  );
}