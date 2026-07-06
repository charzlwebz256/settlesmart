import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, RefreshCw, LogOut, Plus, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// Workspace-registered "User Google Calendar" connector (APP_USER mode)
const CONNECTOR_ID = '6a4b29efdb6c44ab9da95d9f';

function fmtMonth(iso) {
  try { return new Date(iso).toLocaleString('en', { month: 'short' }); } catch { return ''; }
}
function fmtDay(iso) {
  try { return new Date(iso).getDate(); } catch { return ''; }
}
function fmtTime(iso) {
  try {
    return new Date(iso).toLocaleString('en', { hour: 'numeric', minute: '2-digit' });
  } catch { return ''; }
}

export default function MyGoogleCalendar() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);

  // Rule 2: reusable fetch doubles as connection check AND data loader
  const fetchData = async () => {
    try {
      const res = await base44.functions.invoke('fetchMyGoogleCalendar', {});
      setEvents(res.data.events || []);
      setConnected(true);
      setError(null);
    } catch {
      setConnected(false);
      setEvents([]);
    }
  };

  // Rule 1+2: check auth, then fetch to detect connection status
  useEffect(() => {
    (async () => {
      const authed = await base44.auth.isAuthenticated();
      if (authed) {
        await fetchData();
      }
      setLoading(false);
    })();
  }, []);

  // Rule 3: open OAuth popup, poll for close, then re-fetch
  const handleConnect = async () => {
    try {
      setError(null);
      const url = await base44.connectors.connectAppUser(CONNECTOR_ID);
      const popup = window.open(url, '_blank');
      popupRef.current = popup;
      const timer = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(timer);
          fetchData();
        }
      }, 500);
    } catch (err) {
      setError(err?.message || 'Could not start Google authorization');
    }
  };

  const handleDisconnect = async () => {
    try {
      setError(null);
      await base44.connectors.disconnectAppUser(CONNECTOR_ID);
      setConnected(false);
      setEvents([]);
    } catch (err) {
      setError(err?.message || 'Could not disconnect');
    }
  };

  const handleRefresh = async () => {
    setSyncing(true);
    await fetchData();
    setSyncing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-base flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          My Google Calendar
        </h3>
        {connected ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleRefresh} disabled={syncing} className="rounded-xl gap-1.5">
              <RefreshCw className={cn("w-3.5 h-3.5", syncing && "animate-spin")} />
              Refresh
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDisconnect} className="rounded-xl gap-1.5 text-muted-foreground">
              <LogOut className="w-3.5 h-3.5" />
              Disconnect
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={handleConnect} className="rounded-xl gap-1.5 bg-primary hover:bg-primary/90">
            <Plus className="w-3.5 h-3.5" />
            Connect
          </Button>
        )}
      </div>

      {error && <p className="text-xs text-destructive mb-3">{error}</p>}

      {!connected ? (
        <p className="text-sm text-muted-foreground">
          Connect your Google Calendar to see your personal events alongside community events.
        </p>
      ) : events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming events found in your calendar.</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.map(ev => (
            <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
              <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-primary uppercase">{fmtMonth(ev.start)}</span>
                <span className="text-base font-bold text-primary leading-none">{fmtDay(ev.start)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{ev.title}</p>
                <p className="text-xs text-muted-foreground">
                  {ev.is_all_day
                    ? 'All day'
                    : `${fmtTime(ev.start)}${ev.end ? ` – ${fmtTime(ev.end)}` : ''}`}
                </p>
                {ev.location && (
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3" /> {ev.location}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}