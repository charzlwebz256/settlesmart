import { useState, useEffect, useMemo, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Bike, Bus, Footprints, Fuel } from 'lucide-react';
import SmartMap from '@/components/transit/SmartMap';
import TransitControlPanel from '@/components/transit/TransitControlPanel';
import TransitAppPromo from '@/components/transit/TransitAppPromo';
import EtsNetworkPanel from '@/components/transit/EtsNetworkPanel';
import LocationStatusBar from '@/components/transit/LocationStatusBar';
import NearbyTransitPanel from '@/components/transit/NearbyTransitPanel';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { useNearbyStops } from '@/hooks/useNearbyStops';
import { accuracyBand, distanceMeters } from '@/lib/geo';

const MODES = [
  { id: 'driving', label: 'Car', icon: Fuel },
  { id: 'transit', label: 'Bus', icon: Bus },
  { id: 'walking', label: 'Walk', icon: Footprints },
  { id: 'bicycling', label: 'Bike', icon: Bike },
];

const REVERSE_AFTER_M = 150;
const RELOAD_STOPS_AFTER_M = 400;

export default function TransitMap() {
  const [myAddress, setMyAddress] = useState('');
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const startTouchedRef = useRef(false);
  const geocodedAtRef = useRef(null);

  const [error, setError] = useState(null);
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [selectedMode, setSelectedMode] = useState('transit');
  const [routeData, setRouteData] = useState(null);
  const [busStations, setBusStations] = useState([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [showStops, setShowStops] = useState(true);
  const stopsCenterRef = useRef(null);

  const {
    position,
    accuracy,
    heading,
    lastFixAt,
    status,
    error: locationError,
    locating,
    requestOnce,
  } = useDeviceLocation();

  const { stops, loading: stopsLoading, error: stopsError, load: loadStops, clear: clearStops } = useNearbyStops();
  // Stops around the destination, so the closest alighting option is visible too.
  const {
    stops: destStops,
    loading: destStopsLoading,
    error: destStopsError,
    load: loadDestStops,
    clear: clearDestStops,
  } = useNearbyStops();

  const reverseAddress = async (coords) => {
    if (!coords) return '';
    const { data } = await base44.functions.invoke('localAreaInfo', {
      action: 'reverse_address',
      latitude: coords[0],
      longitude: coords[1],
    });
    return data?.address || '';
  };

  // Name the rider's position once, and again only after a real move.
  useEffect(() => {
    if (!position) return;
    if (geocodedAtRef.current && distanceMeters(geocodedAtRef.current, position) < REVERSE_AFTER_M) return;
    geocodedAtRef.current = position;
    let alive = true;
    setResolvingAddress(true);
    reverseAddress([position.lat, position.lng])
      .then((address) => {
        if (!alive || !address) return;
        setMyAddress(address);
        if (!startTouchedRef.current) {
          setStartInput(address);
          setStartCoords([position.lat, position.lng]);
        }
      })
      .finally(() => {
        if (alive) setResolvingAddress(false);
      });
    return () => {
      alive = false;
    };
  }, [position?.lat, position?.lng]);

  // Nearby stops follow the rider, refreshed only after moving a meaningful distance.
  useEffect(() => {
    if (!position || !showStops) return;
    if (stopsCenterRef.current && distanceMeters(stopsCenterRef.current, position) < RELOAD_STOPS_AFTER_M) return;
    stopsCenterRef.current = position;
    loadStops([position.lat, position.lng]);
  }, [position?.lat, position?.lng, showStops, loadStops]);

  // Stops around wherever the rider is heading, so the closest way off is clear.
  useEffect(() => {
    if (!endCoords || !showStops) {
      clearDestStops();
      return;
    }
    loadDestStops(endCoords);
  }, [endCoords?.join(','), showStops, loadDestStops, clearDestStops]);

  const toggleStops = () => {
    if (showStops) {
      setShowStops(false);
      clearStops();
      clearDestStops();
      stopsCenterRef.current = null;
    } else {
      setShowStops(true);
    }
  };

  const useMyLocation = () => {
    if (!position) return;
    setShowStartSuggestions(false);
    setStartCoords([position.lat, position.lng]);
    if (myAddress) {
      setStartInput(myAddress);
      return;
    }
    startTouchedRef.current = false;
    setStartInput('My current location');
  };

  const getPlaceSuggestions = async (query, setSuggestions, setShow) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }
    const { data } = await base44.functions.invoke('localAreaInfo', { action: 'place_lookup', query });
    setSuggestions(data?.places || []);
    setShow(true);
  };

  const geocodeAddress = async (address) => {
    if (!address.trim()) return null;
    const { data } = await base44.functions.invoke('localAreaInfo', { action: 'geocode', address });
    return data?.lat !== undefined && data?.lng !== undefined ? [data.lat, data.lng] : null;
  };

  const handleStartChange = (value) => {
    startTouchedRef.current = true;
    setStartInput(value);
    getPlaceSuggestions(value, setStartSuggestions, setShowStartSuggestions);
  };

  const handleStartSelect = (place) => {
    startTouchedRef.current = true;
    setStartInput(place.address);
    setStartCoords([place.lat, place.lng]);
    setShowStartSuggestions(false);
  };

  const handleEndChange = (value) => {
    setEndInput(value);
    getPlaceSuggestions(value, setEndSuggestions, setShowEndSuggestions);
  };

  const handleEndSelect = (place) => {
    setEndInput(place.address);
    setEndCoords([place.lat, place.lng]);
    setShowEndSuggestions(false);
  };

  const getRoute = async (options = {}) => {
    const origin = options.start || startCoords || (position ? [position.lat, position.lng] : null);
    if (!origin) {
      setError('Allow location access or set a starting point first.');
      return;
    }
    setRouteLoading(true);
    setError(null);
    try {
      const destination = options.end || endCoords || (await geocodeAddress(endInput));
      if (!destination) {
        setError('We could not find that destination. Pick one from the suggestions.');
        return;
      }
      setEndCoords(destination);
      const mode = options.mode || selectedMode;
      if (options.mode) setSelectedMode(options.mode);
      const { data: result } = await base44.functions.invoke('localAreaInfo', {
        action: 'route',
        start: origin,
        end: destination,
        mode: mode === 'bicycling' ? 'cycling' : mode,
      });
      setRouteData(result?.route || null);
      setBusStations(result?.route?.nearby_bus_stations || []);
    } finally {
      setRouteLoading(false);
    }
  };

  const walkToStop = (stop) => {
    setEndInput(stop.name);
    setEndCoords([stop.lat, stop.lng]);
    setShowEndSuggestions(false);
    getRoute({ end: [stop.lat, stop.lng], mode: 'walking' });
  };

  const pickDestination = async ({ lat, lng }) => {
    setEndCoords([lat, lng]);
    setShowEndSuggestions(false);
    const address = await reverseAddress([lat, lng]);
    setEndInput(address || 'Dropped pin');
  };

  // Memoised so the map only redraws the route when a new one is calculated.
  const routePath = useMemo(() => routeData?.waypoints || [], [routeData]);
  const routeLegs = useMemo(() => routeData?.journey || [], [routeData]);
  // Both ends' closest stops share the map; memoised so markers are not rebuilt.
  const mapStops = useMemo(() => [...destStops, ...stops], [destStops, stops]);

  const destinationPoint = endCoords ? { lat: endCoords[0], lng: endCoords[1] } : null;
  // Only worth listing the destination's stops when it is not already next door.
  const showDestStops = Boolean(destinationPoint) && (!position || distanceMeters(position, destinationPoint) > 700);

  return (
    <div className="pb-16 md:pb-0">
      <div className="flex flex-col md:h-[calc(100vh-4rem)] md:flex-row md:overflow-hidden">
        {/* Map first on mobile, at full height, so nothing covers the rider's position */}
        <div className="relative order-1 h-[calc(100dvh-8.5rem)] w-full md:order-2 md:h-full md:w-3/4">
          <SmartMap
            userPosition={position}
            accuracy={accuracy}
            heading={heading}
            startCoords={startCoords}
            endCoords={endCoords}
            routePath={routePath}
            routeLegs={routeLegs}
            nearbyStops={mapStops}
            busStations={busStations}
            showStops={showStops}
            stopsLoading={stopsLoading}
            onToggleStops={toggleStops}
            onPickDestination={pickDestination}
            onStopSelect={walkToStop}
            onLocate={requestOnce}
            locating={locating}
          />
          <TransitAppPromo />
        </div>

        <aside
          id="transit-directions"
          className="order-2 w-full border-t border-border/50 bg-card md:order-1 md:h-full md:w-1/4 md:overflow-y-auto md:border-r md:border-t-0"
        >
          <div className="space-y-4 p-4">
            <TransitControlPanel
              startInput={startInput}
              startSuggestions={startSuggestions}
              showStartSuggestions={showStartSuggestions}
              onStartChange={handleStartChange}
              onStartFocus={() => startSuggestions.length > 0 && setShowStartSuggestions(true)}
              onStartSelect={handleStartSelect}
              endInput={endInput}
              endSuggestions={endSuggestions}
              showEndSuggestions={showEndSuggestions}
              onEndChange={handleEndChange}
              onEndFocus={() => endSuggestions.length > 0 && setShowEndSuggestions(true)}
              onEndSelect={handleEndSelect}
              modes={MODES}
              selectedMode={selectedMode}
              onModeChange={setSelectedMode}
              onSubmit={() => getRoute()}
              routeLoading={routeLoading}
              canSubmit={Boolean(endInput || endCoords) && Boolean(startCoords || position)}
              myAddress={myAddress}
              accuracy={accuracy}
              locating={locating}
              resolvingAddress={resolvingAddress}
              locationError={locationError || error}
              hasPosition={Boolean(position)}
              onLocate={requestOnce}
              onUseMyLocation={useMyLocation}
              routeData={routeData}
              busStations={busStations}
              startLabel={startInput}
              endLabel={endInput}
            />

            <LocationStatusBar
              band={accuracyBand(accuracy)}
              accuracy={accuracy}
              lastFixAt={lastFixAt}
              status={status}
              onRefresh={requestOnce}
            />

            <NearbyTransitPanel
              stops={stops}
              loading={stopsLoading}
              error={stopsError}
              center={position}
              onWalkTo={walkToStop}
              title="Nearest bus stops"
            />

            {showDestStops && (
              <NearbyTransitPanel
                stops={destStops}
                loading={destStopsLoading}
                error={destStopsError}
                center={destinationPoint}
                onWalkTo={walkToStop}
                title="Stops near your destination"
                idleText=""
              />
            )}
          </div>
        </aside>
      </div>

      {/* ETS routes, commutes and schedules */}
      <EtsNetworkPanel />
    </div>
  );
}