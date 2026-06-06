import { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const LocationContext = createContext({
  city: null,
  province: null,
  isDetecting: false,
  setLocation: () => {},
});

export function LocationProvider({ children }) {
  const [city, setCity] = useState(() => localStorage.getItem('ss_city') || null);
  const [province, setProvince] = useState(() => localStorage.getItem('ss_province') || null);
  const [isDetecting, setIsDetecting] = useState(false);

  const setLocation = (newCity, newProvince) => {
    setCity(newCity);
    setProvince(newProvince);
    if (newCity) localStorage.setItem('ss_city', newCity);
    if (newProvince) localStorage.setItem('ss_province', newProvince);
  };

  useEffect(() => {
    // Only auto-detect if we have no saved location
    if (city && province) return;
    if (!('geolocation' in navigator)) return;

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Given latitude ${latitude} and longitude ${longitude} in Canada, determine the nearest city and province. Return JSON with city (string) and province (string, full name e.g. "Ontario") fields only.`,
          add_context_from_internet: true,
          response_json_schema: {
            type: 'object',
            properties: {
              city: { type: 'string' },
              province: { type: 'string' },
            },
          },
        });
        if (result?.city && result?.province) {
          setLocation(result.city, result.province);
        }
        setIsDetecting(false);
      },
      () => setIsDetecting(false)
    );
  }, []);

  return (
    <LocationContext.Provider value={{ city, province, isDetecting, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation_() {
  return useContext(LocationContext);
}