import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { CloudSun, Loader2, Wind, Droplets, AlertTriangle, Sun, Moon, Cloud, CloudRain, CloudSnow } from 'lucide-react';
import { cn } from '@/lib/utils';

const getWeatherIcon = (condition, isDaytime) => {
  if (!condition) return <CloudSun className="w-12 h-12 text-blue-500" />;
  
  const cond = condition.toLowerCase();
  
  if (cond.includes('sunny') || cond.includes('clear')) {
    return isDaytime ? <Sun className="w-12 h-12 text-yellow-500" /> : <Moon className="w-12 h-12 text-slate-400" />;
  }
  if (cond.includes('cloud')) {
    return <Cloud className="w-12 h-12 text-slate-400" />;
  }
  if (cond.includes('rain') || cond.includes('shower')) {
    return <CloudRain className="w-12 h-12 text-blue-600" />;
  }
  if (cond.includes('snow')) {
    return <CloudSnow className="w-12 h-12 text-blue-200" />;
  }
  if (cond.includes('partly')) {
    return <CloudSun className="w-12 h-12 text-blue-500" />;
  }
  
  return <CloudSun className="w-12 h-12 text-blue-500" />;
};

export default function WeatherWidget({ city = 'Edmonton', province, weatherCondition }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (city && !loaded) fetchWeather();
  }, [city]);

  const fetchWeather = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Get current weather and 5-day forecast for ${city}, ${province || 'Alberta'}, Canada.
Return: current_temp (number in Celsius), condition (e.g. "Partly Cloudy"), feels_like (number), humidity (percent), wind_speed (km/h), has_alert (bool), alert_text (string or empty), forecast as array of 5 objects with day (Mon/Tue etc), high, low, condition, icon_emoji.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          current_temp: { type: 'number' },
          condition: { type: 'string' },
          feels_like: { type: 'number' },
          humidity: { type: 'number' },
          wind_speed: { type: 'number' },
          has_alert: { type: 'boolean' },
          alert_text: { type: 'string' },
          forecast: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                day: { type: 'string' },
                high: { type: 'number' },
                low: { type: 'number' },
                condition: { type: 'string' },
                icon_emoji: { type: 'string' },
              },
            },
          },
        },
      },
    });
    setWeather(result);
    setLoaded(true);
    setLoading(false);
  };

  if (loading) return (
    <div className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-2xl border border-border/50 p-4 flex items-center gap-3">
      <Loader2 className="w-5 h-5 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">Loading weather for {city}...</span>
    </div>
  );

  if (!weather) return (
    <button
      onClick={fetchWeather}
      className="w-full bg-gradient-to-r from-blue-500/5 to-teal-500/5 rounded-2xl border border-border/50 p-4 flex items-center gap-3 hover:border-primary/20 transition-colors"
    >
      <CloudSun className="w-5 h-5 text-blue-500" />
      <span className="text-sm text-muted-foreground">Tap to load weather for {city}</span>
    </button>
  );

  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-2xl border border-blue-200/50 overflow-hidden">
      {/* Alert */}
      {weather.has_alert && weather.alert_text && (
        <div className="flex items-center gap-2 bg-amber-500/10 border-b border-amber-200/50 px-4 py-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-xs font-medium text-amber-700">{weather.alert_text}</p>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-end gap-2">
              <span className="font-heading font-bold text-4xl">{weather.current_temp}°</span>
              <span className="text-muted-foreground text-sm pb-1">C</span>
            </div>
            <p className="text-sm font-medium">{weather.condition}</p>
            <p className="text-xs text-muted-foreground">{city}{province ? `, ${province}` : ''}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            {getWeatherIcon(weatherCondition?.condition || weather.condition, weatherCondition?.is_daytime !== false)}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                <Droplets className="w-3 h-3" /> {weather.humidity}% humidity
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                <Wind className="w-3 h-3" /> {weather.wind_speed} km/h
              </div>
              <p className="text-xs text-muted-foreground">Feels like {weather.feels_like}°C</p>
            </div>
          </div>
        </div>

        {/* 5-day forecast */}
        {weather.forecast?.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-2 border-t border-blue-200/30">
            {weather.forecast.map((day, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-white/30 min-w-[60px]">
                <span className="text-[10px] font-semibold text-muted-foreground">{day.day}</span>
                <span className="text-lg">{day.icon_emoji || '🌤'}</span>
                <span className="text-xs font-bold">{day.high}°</span>
                <span className="text-[10px] text-muted-foreground">{day.low}°</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}