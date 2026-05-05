import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Loader2 } from 'lucide-react';

const weatherIcons = {
  sunny: <Sun className="w-12 h-12 text-yellow-500" />,
  cloudy: <Cloud className="w-12 h-12 text-gray-400" />,
  rainy: <CloudRain className="w-12 h-12 text-blue-500" />,
  default: <Cloud className="w-12 h-12 text-gray-400" />,
};

export default function WeatherWidget({ city, province }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setLoading(true);
      try {
        const result = await base44.integrations.Core.InvokeLLM({
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
        setWeather(result);
      } catch (err) {
        console.error('Weather fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, province]);

  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 p-6 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading weather...</span>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-gradient-to-br from-primary/10 via-card to-accent/5 rounded-2xl border border-primary/20 p-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">Current Weather</h3>
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          {weatherIcons[weather.condition] || weatherIcons.default}
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{Math.round(weather.temperature)}°C</span>
              <span className="text-sm text-muted-foreground">Feels like {Math.round(weather.feels_like)}°C</span>
            </div>
            <p className="text-muted-foreground text-sm mt-1 capitalize">{weather.condition}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-muted-foreground">{weather.humidity}% humidity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-500" />
              <span className="text-muted-foreground">{Math.round(weather.wind_speed)} km/h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-muted-foreground">{weather.visibility} km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}