import { useEffect, useRef, useState } from 'react';
import {
  Compass,
  Layers,
  Loader2,
  LocateFixed,
  Map as MapIcon,
  MapPinOff,
  Mountain,
  Satellite,
  Bus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { loadGoogleMaps } from '@/lib/googleMaps';
import { bearingBetween, distanceMeters } from '@/lib/geo';
import DirectionArrow from '@/components/transit/DirectionArrow';
import MapCompass from '@/components/transit/MapCompass';

const MAP_TYPES = [
  { id: 'roadmap', label: 'Map', icon: MapIcon },
  { id: 'satellite', label: 'Satellite', icon: Satellite },
  { id: 'hybrid', label: 'Hybrid', icon: Layers },
  { id: 'terrain', label: 'Terrain', icon: Mountain },
];

const FALLBACK_CENTER = { lat: 53.5461, lng: -113.4938 };
const SAFE_BOTTOM = 'calc(1rem + env(safe-area-inset-bottom))';

// Zoom tracks the reported accuracy: the tighter the fix, the closer the view.
function zoomForAccuracy(accuracy) {
  if (!Number.isFinite(accuracy)) return 15;
  if (accuracy <= 12) return 18;
  if (accuracy <= 25) return 17;
  if (accuracy <= 60) return 16;
  return 14;
}

// Room for the floating controls so the whole journey stays visible.
function fitPadding() {
  return typeof window !== 'undefined' && window.innerWidth >= 768
    ? { top: 72, right: 104, bottom: 96, left: 72 }
    : { top: 64, right: 64, bottom: 128, left: 64 };
}

function svgIcon(maps, svg, size) {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new maps.Size(size, size),
    anchor: new maps.Point(size / 2, size / 2),
  };
}

// Google-Maps style arrow for the rider: a full arrowhead when the compass or
// GPS reports a heading, a plain blue dot when nothing is known yet.
function userIcon(maps, heading) {
  const body = Number.isFinite(heading)
    ? `<g transform="rotate(${Math.round(heading)} 24 24)"><path d="M24 3 L34 32 L24 26 L14 32 Z" fill="#2563eb" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/></g>`
    : `<circle cx="24" cy="24" r="9" fill="#2563eb" stroke="#ffffff" stroke-width="4"/><circle cx="24" cy="24" r="3" fill="#ffffff"/>`;
  return svgIcon(
    maps,
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">${body}</svg>`,
    48
  );
}

function pinIcon(maps, color) {
  return svgIcon(
    maps,
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="10" fill="${color}" stroke="#ffffff" stroke-width="3"/></svg>`,
    28
  );
}

function stopIcon(maps) {
  return svgIcon(
    maps,
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#0ea5e9" stroke="#ffffff" stroke-width="2.5"/></svg>`,
    16
  );
}

// Google Maps surface with live location, accuracy radius and touch-friendly controls.
export default function SmartMap({
  userPosition,
  accuracy,
  heading,
  startCoords,
  endCoords,
  routePath,
  routeLegs,
  nearbyStops,
  busStations,
  showStops,
  stopsLoading,
  onToggleStops,
  onPickDestination,
  onStopSelect,
  onLocate,
  locating,
  navigating,
  needsCompass,
  onEnableCompass,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const mapsRef = useRef(null);
  const overlays = useRef({ user: null, accuracy: null, route: null, routeLines: [], routeStops: [], points: [] });
  // Only navigation follows the rider; otherwise the map stays where they left it.
  const followRef = useRef(false);
  const handlers = useRef({ onPickDestination, onStopSelect });
  handlers.current = { onPickDestination, onStopSelect };

  const [ready, setReady] = useState(false);
  const [failure, setFailure] = useState(null);
  const [mapType, setMapType] = useState('roadmap');
  const [centred, setCentred] = useState(false);

  useEffect(() => {
    let alive = true;
    loadGoogleMaps()
      .then((maps) => {
        if (!alive) return;
        mapsRef.current = maps;
        setReady(true);
      })
      .catch((error) => {
        if (alive) setFailure(error?.message === 'missing-key' ? 'missing-key' : 'load-failed');
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    const maps = mapsRef.current;
    const map = new maps.Map(containerRef.current, {
      center: userPosition || FALLBACK_CENTER,
      zoom: userPosition ? 15 : 12,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      clickableIcons: false,
      mapTypeId: 'roadmap',
      keyboardShortcuts: false,
    });
    mapRef.current = map;

    map.addListener('click', (event) => {
      handlers.current.onPickDestination?.({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });

    // Taking the map by hand ends the follow, until they tap locate again.
    map.addListener('dragstart', () => {
      followRef.current = false;
    });

    // Mobile browser bars and rotation change the canvas size.
    const resize = () => maps.event.trigger(map, 'resize');
    window.addEventListener('resize', resize);
    window.visualViewport?.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('resize', resize);
      maps.event.clearInstanceListeners(map);
      mapRef.current = null;
    };
  }, [ready]);

  useEffect(() => {
    if (ready) mapRef.current?.setMapTypeId(mapType);
  }, [mapType, ready]);

  // Blue dot + accuracy radius.
  useEffect(() => {
    if (!ready || !mapRef.current || !userPosition) return;
    const maps = mapsRef.current;
    const map = mapRef.current;
    const radius = Number.isFinite(accuracy) ? Math.max(accuracy, 5) : 0;

    if (!overlays.current.user) {
      overlays.current.user = new maps.Marker({
        map,
        position: userPosition,
        icon: userIcon(maps, heading),
        zIndex: 999,
        clickable: false,
      });
      overlays.current.accuracy = new maps.Circle({
        map,
        center: userPosition,
        radius,
        fillColor: '#2563eb',
        fillOpacity: 0.15,
        strokeColor: '#2563eb',
        strokeOpacity: 0.35,
        strokeWeight: 1,
        clickable: false,
      });
    } else {
      overlays.current.user.setPosition(userPosition);
      overlays.current.user.setIcon(userIcon(maps, heading));
      overlays.current.accuracy.setCenter(userPosition);
      overlays.current.accuracy.setRadius(radius);
    }
    overlays.current.accuracy.setVisible(radius > 0);
  }, [ready, userPosition?.lat, userPosition?.lng, accuracy, heading]);

  // Centre once on the first real fix and then stay put: the rider keeps their
  // bearings from the direction arrow instead of the map chasing them.
  useEffect(() => {
    if (!ready || !mapRef.current || !userPosition) return;
    if (centred) return;
    mapRef.current.setCenter(userPosition);
    mapRef.current.setZoom(zoomForAccuracy(accuracy));
    setCentred(true);
  }, [ready, userPosition?.lat, userPosition?.lng, centred]);

  // Start, destination, transit stops and bus stations.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const maps = mapsRef.current;
    const map = mapRef.current;
    overlays.current.points.forEach((marker) => marker.setMap(null));
    const points = [];

    if (startCoords) {
      points.push(new maps.Marker({ map, position: { lat: startCoords[0], lng: startCoords[1] }, icon: pinIcon(maps, '#2563eb'), title: 'Start' }));
    }
    if (endCoords) {
      points.push(new maps.Marker({ map, position: { lat: endCoords[0], lng: endCoords[1] }, icon: pinIcon(maps, '#ef4444'), title: 'Destination' }));
    }

    if (showStops) {
      nearbyStops
        .filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng))
        .slice(0, 80)
        .forEach((stop) => {
          const marker = new maps.Marker({ map, position: { lat: stop.lat, lng: stop.lng }, icon: stopIcon(maps), title: stop.name });
          marker.addListener('click', () => handlers.current.onStopSelect?.(stop));
          points.push(marker);
        });
    }

    busStations
      .filter((station) => Number.isFinite(station.lat) && Number.isFinite(station.lng))
      .forEach((station) => {
        points.push(new maps.Marker({ map, position: { lat: station.lat, lng: station.lng }, icon: pinIcon(maps, '#f59e0b'), title: station.name }));
      });

    overlays.current.points = points;
  }, [ready, startCoords?.join(','), endCoords?.join(','), showStops, nearbyStops, busStations]);

  // Planned journey: every leg in its own style, its stops, framed in full.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const maps = mapsRef.current;
    const map = mapRef.current;

    overlays.current.route?.setMap(null);
    overlays.current.route = null;
    (overlays.current.routeLines || []).forEach((line) => line.setMap(null));
    (overlays.current.routeStops || []).forEach((marker) => marker.setMap(null));
    overlays.current.routeLines = [];
    overlays.current.routeStops = [];

    const bounds = new maps.LatLngBounds();
    const legs = (routeLegs || []).filter((leg) => Array.isArray(leg.path) && leg.path.length > 1);

    if (legs.length > 0) {
      legs.forEach((leg) => {
        const walking = leg.kind === 'walk' || leg.kind === 'bike';
        const path = leg.path.map(([lat, lng]) => ({ lat, lng }));
        path.forEach((point) => bounds.extend(point));

        overlays.current.routeLines.push(
          new maps.Polyline({
            map,
            path,
            strokeColor: walking ? '#5f6368' : leg.color || '#1a73e8',
            strokeOpacity: walking ? 0 : 0.95,
            strokeWeight: walking ? 4 : 6,
            zIndex: walking ? 1 : 2,
            icons: walking
              ? [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 0.9, strokeColor: '#5f6368', scale: 3 }, offset: '0', repeat: '12px' }]
              : [],
          })
        );

        if (walking) return;
        (leg.intermediate_stops || []).slice(0, 40).forEach((stop) => {
          if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) return;
          overlays.current.routeStops.push(
            new maps.Marker({ map, position: { lat: stop.lat, lng: stop.lng }, icon: stopIcon(maps), title: stop.name, zIndex: 3 })
          );
        });
      });

      map.fitBounds(bounds, fitPadding());
      return;
    }

    if (!routePath || routePath.length < 2) return;
    const path = routePath.map(([lat, lng]) => ({ lat, lng }));
    overlays.current.route = new maps.Polyline({ map, path, strokeColor: '#2563eb', strokeWeight: 5, strokeOpacity: 0.9 });
    path.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, fitPadding());
  }, [ready, routeLegs, routePath]);

  // Navigating: frame the rider up close and keep them centred as they move.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    if (!navigating) {
      followRef.current = false;
      return;
    }
    followRef.current = true;
    if (userPosition) {
      mapRef.current.setCenter(userPosition);
      mapRef.current.setZoom(zoomForAccuracy(accuracy));
    }
  }, [navigating]);

  useEffect(() => {
    if (!ready || !navigating || !followRef.current || !userPosition || !mapRef.current) return;
    mapRef.current.panTo(userPosition);
  }, [ready, navigating, userPosition?.lat, userPosition?.lng]);

  const recentre = () => {
    if (userPosition) {
      mapRef.current?.panTo(userPosition);
      mapRef.current?.setZoom(zoomForAccuracy(accuracy));
    }
    if (navigating) followRef.current = true;
    if (!userPosition || !Number.isFinite(accuracy) || accuracy > 50) onLocate?.();
  };

  // Compass: reset to north where the map supports rotation, otherwise recentre.
  const resetNorth = () => {
    const map = mapRef.current;
    if (!map) return;
    if (typeof map.setHeading === 'function') {
      map.setHeading(0);
      map.setTilt(0);
    }
    if (userPosition) map.panTo(userPosition);
  };

  const destination = endCoords ? { lat: endCoords[0], lng: endCoords[1] } : null;
  const destinationBearing = userPosition && destination ? bearingBetween(userPosition, destination) : null;
  const destinationDistance = userPosition && destination ? distanceMeters(userPosition, destination) : null;

  return (
    <div className="relative h-full w-full overflow-hidden bg-muted">
      <div ref={containerRef} className="absolute inset-0" aria-label="Transit map" />

      {(failure || !ready) && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted p-4">
          {failure ? (
            <div className="max-w-sm rounded-2xl border border-border/60 bg-card p-5 text-center shadow-sm">
              <MapPinOff className="mx-auto mb-2 h-6 w-6 text-primary" />
              <p className="font-heading text-sm font-semibold">
                {failure === 'missing-key' ? 'Google Maps key needed' : 'The map could not load'}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {failure === 'missing-key'
                  ? 'Add your Google Maps JavaScript API key in the dashboard under Secrets to switch the map on. Directions and nearby stops still work below.'
                  : 'Check your connection and reload the page. Directions and nearby stops still work below.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-[11px] font-medium text-muted-foreground">Loading Google Maps…</p>
            </div>
          )}
        </div>
      )}

      {ready && (
        <>
          <MapCompass
            heading={Number.isFinite(heading) ? heading : null}
            bearing={destinationBearing}
            needsPermission={needsCompass}
            onEnableCompass={onEnableCompass}
          />

          {!navigating && (
            <DirectionArrow
              bearing={destinationBearing}
              heading={heading}
              distance={destinationDistance}
            />
          )}

          <div className="absolute right-3 top-3 z-10 flex flex-col gap-1 rounded-xl border border-border/60 bg-card/95 p-1 shadow-lg backdrop-blur">
            {MAP_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setMapType(type.id)}
                className={cn(
                  'flex min-h-[38px] items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-semibold transition-colors',
                  mapType === type.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <type.icon className="h-3.5 w-3.5" />
                {type.label}
              </button>
            ))}
          </div>

          <div className="absolute right-3 z-10 flex flex-col items-end gap-2" style={{ bottom: SAFE_BOTTOM }}>
            <button
              onClick={resetNorth}
              aria-label="Reset map to north"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card/95 shadow-lg backdrop-blur transition-colors hover:bg-card"
            >
              <Compass className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={recentre}
              aria-label="Locate me"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform active:scale-95"
            >
              {locating ? <Loader2 className="h-5 w-5 animate-spin" /> : <LocateFixed className="h-5 w-5" />}
            </button>
          </div>

          <button
            onClick={onToggleStops}
            className={cn(
              'absolute left-3 z-10 flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-semibold shadow-lg backdrop-blur transition-colors',
              showStops
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border/60 bg-card/95 text-foreground hover:bg-card'
            )}
            style={{ bottom: SAFE_BOTTOM }}
          >
            {stopsLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bus className="h-3.5 w-3.5" />}
            {showStops ? 'Hide stops' : 'Transit stops'}
          </button>
        </>
      )}
    </div>
  );
}