import { useState, useEffect, useCallback } from 'react';
import {
  CloudSun, Loader2, Wind, Droplets, AlertTriangle,
  Sun, Moon, Cloud, CloudRain, CloudSnow, Eye, Thermometer, RefreshCw
} from 'lucide-react';

// WMO weather interpretation codes → label + emoji
const WMO_CODES = {
  0: { label: 'Clear Sky', emoji: '☀️' },
  1: { label: 'Mainly Clear', emoji: '🌤️' },
  2: { label: 'Partly Cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Foggy', emoji: '🌫️' },
  48: { label: 'Icy Fog', emoji: '🌫️' },
  51: { label: 'Light Drizzle', emoji: '🌦️' },
  53: { label: 'Drizzle', emoji: '🌦️' },
  55: { label: 'Heavy Drizzle', emoji: '🌧️' },
  61: { label: 'Light Rain', emoji: '🌧️' },
  63: { label: 'Rain', emoji: '🌧️' },
  65: { label: 'Heavy Rain', emoji: '🌧️' },
  71: { label: 'Light Snow', emoji: '🌨️' },
  73: { label: 'Snow', emoji: '❄️' },
  75: { label: 'Heavy Snow', emoji: '❄️' },
  77: { label: 'Snow Grains', emoji: '🌨️' },
  80: { label: 'Light Showers', emoji: '🌦️' },
  81: { label: 'Showers', emoji: '🌧️' },
  82: { label: 'Heavy Showers', emoji: '⛈️' },
  85: { label: 'Snow Showers', emoji: '🌨️' },
  86: { label: 'Heavy Snow Showers', emoji: '❄️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
  96: { label: 'Thunderstorm + Hail', emoji: '⛈️' },
  99: { label: 'Thunderstorm + Heavy Hail', emoji: '⛈️' },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function WeatherIcon({ code, isDay, size = 'lg' }) {
  const cls = size === 'lg' ? 'w-12 h-12' : 'w-5 h-5';
  if (!code && code !== 0) return <CloudSun className={`${cls} text-blue-400`} />;
  if (code === 0 || code === 1) return isDay ? <Sun className={`${cls} text-yellow-400`} /> : <Moon className={`${cls} text-slate-400`} />;
  if (code === 2 || code === 3) return <Cloud className={`${cls} text-slate-400`} />;
  if (code >= 61 && code <= 67) return <CloudRain className={`${cls} text-blue-500`} />;
  if (code >= 71 && code <= 77) return <CloudSnow className={`${cls} text-blue-200`} />;
  if (code >= 80 && code <= 82) return <CloudRain className={`${cls} text-blue-500`} />;
  if (code >= 95) return <CloudRain className={`${cls} text-purple-500`} />;
  return <CloudSun className={`${cls} text-blue-400`} />;
}

// Geocode city → lat/lon using Open-Meteo geocoding API (free, no key)
async function geocodeCity(city, province) {
  const query = province ? `${city}, ${province}, Canada` : `${city}, Canada`;
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
  );
  const data = await res.json();
  if (data.results?.length > 0) {
    return { lat: data.results[0].latitude, lon: data.results[0].longitude, name: data.results[0].name };
  }
  // Fallback coords for major Canadian cities
  const fallbacks = {
    edmonton: { lat: 53.5461, lon: -113.4938 },
    toronto: { lat: 43.6532, lon: -79.3832 },
    vancouver: { lat: 49.2827, lon: -123.1207 },
    calgary: { lat: 51.0447, lon: -114.0719 },
    montreal: { lat: 45.5017, lon: -73.5673 },
    ottawa: { lat: 45.4215, lon: -75.6972 },
    winnipeg: { lat: 49.8951, lon: -97.1384 },
  };
  const key = city.toLowerCase();
  return fallbacks[key] || { lat: 53.5461, lon: -113.4938 };
}

export default function WeatherWidget({ city = 'Edmonton', province }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { lat, lon } = await geocodeCity(city, province);

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day,visibility` +
        `&hourly=precipitation_probability` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum` +
        `&timezone=auto&forecast_days=7`
      );
      const data = await res.json();

      const cur = data.current;
      const daily = data.daily;

      // Build 7-day forecast
      const forecast = (daily.time || []).slice(0, 7).map((dateStr, i) => {
        const d = new Date(dateStr);
        return {
          day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAYS[d.getDay()],
          date: dateStr,
          high: Math.round(daily.temperature_2m_max[i]),
          low: Math.round(daily.temperature_2m_min[i]),
          code: daily.weather_code[i],
          emoji: WMO_CODES[daily.weather_code[i]]?.emoji || '🌤️',
          condition: WMO_CODES[daily.weather_code[i]]?.label || 'Partly Cloudy',
          precip: daily.precipitation_sum?.[i] ?? 0,
          uv: daily.uv_index_max?.[i] ?? 0,
          sunrise: daily.sunrise?.[i]?.split('T')[1]?.slice(0, 5) || '',
          sunset: daily.sunset?.[i]?.split('T')[1]?.slice(0, 5) || '',
        };
      });

      setWeather({
        temp: Math.round(cur.temperature_2m),
        feels_like: Math.round(cur.apparent_temperature),
        humidity: cur.relative_humidity_2m,
        wind: Math.round(cur.wind_speed_10m),
        code: cur.weather_code,
        is_day: cur.is_day === 1,
        visibility: cur.visibility ? Math.round(cur.visibility / 1000) : null,
        condition: WMO_CODES[cur.weather_code]?.label || 'Partly Cloudy',
        forecast,
      });
      setLastUpdated(new Date());
    } catch (e) {
      setError('Could not load weather data.');
    } finally {
      setLoading(false);
    }
  }, [city, province]);

  // Auto-fetch on mount and when city changes
  useEffect(() => {
    if (city) fetchWeather();
  }, [city, province]); // eslint-disable-line

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => { if (city) fetchWeather(); }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  if (loading && !weather) return (
    <div className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-2xl border border-border/50 p-4 flex items-center gap-3">
      <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0" />
      <span className="text-sm text-muted-foreground">Loading live weather for {city}...</span>
    </div>
  );

  if (error && !weather) return (
    <button onClick={fetchWeather} className="w-full bg-muted/50 rounded-2xl border border-border/50 p-4 text-sm text-muted-foreground hover:border-primary/20 transition-colors">
      ⚠️ {error} Tap to retry.
    </button>
  );

  if (!weather) return null;

  const today = weather.forecast?.[0];

  return (
    <div className="bg-gradient-to-br from-blue-500/10 via-teal-500/5 to-sky-500/10 rounded-2xl border border-blue-200/50 dark:border-blue-900/30 overflow-hidden">
      {/* Main row */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          {/* Left: temp + condition */}
          <div>
            <div className="flex items-end gap-1 leading-none mb-1">
              <span className="font-heading font-bold text-5xl text-foreground">{weather.temp}°</span>
              <span className="text-muted-foreground text-base pb-1.5">C</span>
            </div>
            <p className="text-base font-semibold text-foreground">{weather.condition}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{city}{province ? `, ${province}` : ''}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Feels like {weather.feels_like}°C</p>
          </div>

          {/* Right: icon + stats */}
          <div className="flex flex-col items-end gap-2">
            <WeatherIcon code={weather.code} isDay={weather.is_day} size="lg" />
            <div className="space-y-1 text-right">
              <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                <Droplets className="w-3 h-3 text-blue-500" /> {weather.humidity}% humidity
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                <Wind className="w-3 h-3 text-slate-400" /> {weather.wind} km/h
              </div>
              {weather.visibility !== null && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                  <Eye className="w-3 h-3 text-slate-400" /> {weather.visibility} km vis.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Today's Hi/Lo + sunrise/sunset */}
        {today && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-blue-200/30 dark:border-blue-900/20 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-rose-400" />
              H: <strong className="text-foreground">{today.high}°</strong>
            </span>
            <span className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-blue-400" />
              L: <strong className="text-foreground">{today.low}°</strong>
            </span>
            {today.sunrise && <span>🌅 {today.sunrise}</span>}
            {today.sunset && <span>🌇 {today.sunset}</span>}
            {today.uv > 0 && <span>☀️ UV {today.uv}</span>}
          </div>
        )}
      </div>

      {/* 7-day forecast */}
      {weather.forecast?.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide px-4 pb-4">
          {weather.forecast.map((day, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl bg-white/30 dark:bg-white/5 min-w-[58px] text-center"
            >
              <span className="text-[10px] font-bold text-muted-foreground">{day.day}</span>
              <span className="text-xl">{day.emoji}</span>
              <span className="text-xs font-bold text-foreground">{day.high}°</span>
              <span className="text-[10px] text-muted-foreground">{day.low}°</span>
              {day.precip > 0 && (
                <span className="text-[9px] text-blue-500 font-medium">{day.precip}mm</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer: last updated + refresh */}
      <div className="flex items-center justify-between px-4 pb-3">
        <p className="text-[10px] text-muted-foreground">
          Live via Open-Meteo · {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
        </p>
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
    </div>
  );
}