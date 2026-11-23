import { useState, useEffect, useMemo, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Bike, Bus, Footprints, Fuel } from 'lucide-react';
import { cn } from '@/lib/utils';
import SmartMap from '@/components/transit/SmartMap';
import TransitControlPanel from '@/components/transit/TransitControlPanel';
import TransitAppPromo from '@/components/transit/TransitAppPromo';
import LocationStatusBar from '@/components/transit/LocationStatusBar';
import NearbyTransitPanel from '@/components/transit/NearbyTransitPanel';
import NavigationBanner from '@/components/transit/NavigationBanner';
import JourneyProgress from '@/components/transit/JourneyProgress';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';
import useVoiceGuidance from '@/hooks/useVoiceGuidance';
import { useNearbyStops } from '@/hooks/useNearbyStops';
import { accuracyBand, distanceMeters } from '@/lib/geo';
import { buildTrack, buildGuidance } from '@/lib/navigation';
import { formatMinutes } from '@/lib/duration';

const MODES = [
  { id: 'driving', label: 'Car', icon: Fuel },
  { id: 'transit', label: 'Bus', icon: Bus },
  { id: 'walking', label: 'Walk', icon: Footprints },
  { id: 'bicycling', label: 'Bike', icon: Bike },
];

const REVERSE_AFTER_M = 25;
const RELOAD_STOPS_AFTER_M = 400;

/**
 * The live transit planner: map plus directions sidebar.
 * `embedded` shrinks it to fit inside a card (Explore) instead of a full page.
 */
export default function TransitPlanner({ embedded = false, autoLocate = false, refreshSignal = 0 }) {
  const [myAddress, setMyAddress] = useState('');
  const [resolvingAddress, setResolvingAddress] = useState(false);
  // The start point is set once, then stays put for the whole journey.
  const startLockedRef = useRef(false);
  const geocodedAtRef = useRef(null);

  const [error, setError] = useState(null);
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [selectedMode, setSelectedMode] = useState('transit');
  const [routeData, setRouteData] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [showStops, setShowStops] = useState(true);
  const [selectedOption, setSelectedOption] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const [clock, setClock] = useState(() => Date.now());
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
  } = useDeviceLocation({ autoStart: autoLocate || !embedded });

  // The compass is what makes the direction arrow point the right way while standing still.
  const compass = useDeviceOrientation();

  // Spoken turn-by-turn directions, like a navigation app.
  const { voiceOn, voiceSupported, toggleVoice, announce, resetVoice } = useVoiceGuidance();

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
        if (!startLockedRef.current) {
          startLockedRef.current = true;
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
    startLockedRef.current = true;
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
    startLockedRef.current = true;
    setStartInput(value);
    getPlaceSuggestions(value, setStartSuggestions, setShowStartSuggestions);
  };

  const handleStartSelect = (place) => {
    startLockedRef.current = true;
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
      setSelectedOption(0);
      setNavigating(false);
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

  // Pulling down on the transit page fixes the position again and re-plans the trip.
  const lastRefreshRef = useRef(refreshSignal);
  useEffect(() => {
    if (refreshSignal === lastRefreshRef.current) return;
    lastRefreshRef.current = refreshSignal;
    requestOnce();
    if (endCoords) getRoute();
  }, [refreshSignal]); // eslint-disable-line

  // Every way to make the trip: the best one first, then the alternatives.
  const routeOptions = useMemo(() => {
    if (!routeData) return [];
    const alternatives = Array.isArray(routeData.alternatives) ? routeData.alternatives : [];
    return [routeData, ...alternatives];
  }, [routeData]);
  const activeRoute = routeOptions[selectedOption] || routeData || null;

  // Live position along the chosen route, refreshed as the rider moves.
  const track = useMemo(() => (navigating ? buildTrack(activeRoute) : null), [navigating, activeRoute]);
  const guidance = useMemo(
    () => (navigating ? buildGuidance(activeRoute, track, position, clock) : null),
    [navigating, activeRoute, track, position?.lat, position?.lng, clock]
  );
  const arrived = Boolean(navigating && guidance?.arrived);

  useEffect(() => {
    if (!navigating) return undefined;
    const id = setInterval(() => setClock(Date.now()), 15000);
    return () => clearInterval(id);
  }, [navigating]);

  // Read each new instruction aloud once, the way a navigation app does.
  useEffect(() => {
    if (!navigating) {
      resetVoice();
      return;
    }
    if (!guidance) return;
    if (guidance.arrived) {
      announce('You have arrived at your destination.', 'arrived');
      return;
    }
    announce(
      `${guidance.instruction}.${guidance.detail ? ` ${guidance.detail}.` : ''}`,
      `${guidance.instruction}|${guidance.detail || ''}`
    );
  }, [navigating, guidance?.instruction, guidance?.detail, guidance?.arrived, announce, resetVoice]);

  const startNavigation = (index = selectedOption) => {
    if (!routeOptions[index]) return;
    setSelectedOption(index);
    setClock(Date.now());
    setNavigating(true);
    // Speaking inside the tap also unlocks audio on mobile browsers.
    announce(`Starting route guidance. ${formatMinutes(routeOptions[index].duration_minutes)} to your destination.`, `start-${Date.now()}`);
    if (!position) requestOnce();
  };

  const endNavigation = () => setNavigating(false);

  // Memoised so the map only redraws the route when a new one is calculated.
  const routePath = useMemo(() => activeRoute?.waypoints || [], [activeRoute]);
  const routeLegs = useMemo(() => activeRoute?.journey || [], [activeRoute]);
  // Both ends' closest stops share the map, nearest to the rider first, so the
  // closest options are the ones that get drawn when the list is capped.
  const mapStops = useMemo(() => {
    const all = [...destStops, ...stops].filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng));
    if (!position) return all;
    return all.sort(
      (a, b) =>
        distanceMeters(position, { lat: a.lat, lng: a.lng }) -
        distanceMeters(position, { lat: b.lat, lng: b.lng })
    );
  }, [destStops, stops, position?.lat, position?.lng]);

  const destinationPoint = endCoords ? { lat: endCoords[0], lng: endCoords[1] } : null;
  // Only worth listing the destination's stops when it is not already next door.
  const showDestStops = Boolean(destinationPoint) && (!position || distanceMeters(position, destinationPoint) > 700);

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden md:flex-row',
        embedded
          ? 'rounded-2xl border border-border/50 md:h-[clamp(480px,72dvh,680px)]'
          : 'md:h-[calc(100dvh-4rem)] md:min-h-[500px]'
      )}
    >
      {/* Map first on mobile, at full height, so nothing covers the rider's position */}
      <div
        className={cn(
          'relative order-1 w-full md:order-2 md:h-full md:w-3/4',
          embedded ? 'h-[clamp(300px,45dvh,420px)]' : 'h-[clamp(320px,58dvh,720px)]'
        )}
      >
        <SmartMap
          userPosition={position}
          accuracy={accuracy}
          heading={Number.isFinite(compass.heading) ? compass.heading : heading}
          tilt={compass.tilt}
          needsCompass={compass.needsPermission}
          onEnableCompass={compass.requestPermission}
          startCoords={startCoords}
          endCoords={endCoords}
          routePath={routePath}
          routeLegs={routeLegs}
          nearbyStops={mapStops}
          busStations={activeRoute?.nearby_bus_stations || []}
          showStops={showStops}
          stopsLoading={stopsLoading}
          onToggleStops={toggleStops}
          onPickDestination={pickDestination}
          onStopSelect={walkToStop}
          onLocate={requestOnce}
          locating={locating}
          navigating={navigating}
        />
        <TransitAppPromo />
        <JourneyProgress
          navigating={navigating}
          arrived={arrived}
          guidance={guidance}
          route={activeRoute}
        />
        <NavigationBanner
          route={activeRoute}
          guidance={guidance}
          navigating={navigating}
          arrived={arrived}
          onStart={() => startNavigation()}
          onEnd={endNavigation}
          canStart={Boolean(position)}
          heading={Number.isFinite(compass.heading) ? compass.heading : heading}
          voiceOn={voiceOn}
          voiceSupported={voiceSupported}
          onToggleVoice={toggleVoice}
        />
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
            routeData={activeRoute}
            busStations={activeRoute?.nearby_bus_stations || []}
            startLabel={startInput}
            endLabel={endInput}
            routeOptions={routeOptions}
            selectedOption={selectedOption}
            onSelectOption={setSelectedOption}
            onStartNavigation={startNavigation}
            navigating={navigating}
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
  );
}