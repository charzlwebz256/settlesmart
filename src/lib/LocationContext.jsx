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
        const { data: result } = await base44.functions.invoke('localAreaInfo', {
          action: 'reverse_geocode',
          latitude,
          longitude,
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