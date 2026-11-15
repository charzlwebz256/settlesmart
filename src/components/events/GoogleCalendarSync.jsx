import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarCheck, Loader2, LogOut, RefreshCw } from 'lucide-react';

// Workspace-registered "User Google Calendar" connector (APP_USER mode)
const CONNECTOR_ID = '6a4b29efdb6c44ab9da95d9f';

/** Connect, sync and disconnect the visitor's own Google Calendar. */
export default function GoogleCalendarSync() {
  const [status, setStatus] = useState('checking');
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const res = await base44.functions.invoke('fetchMyGoogleCalendar', {});
      setCount((res.data?.events || []).length);
      setStatus('connected');
      setError(null);
      return true;
    } catch {
      setStatus('disconnected');
      return false;
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      const authed = await base44.auth.isAuthenticated();
      if (!alive) return;
      if (!authed) {
        setStatus('signed-out');
        return;
      }
      await load();
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleConnect = async () => {
    setBusy(true);
    setError(null);
    try {
      const url = await base44.connectors.connectAppUser(CONNECTOR_ID);
      const popup = window.open(url, '_blank');
      const timer = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(timer);
          load().then((ok) => {
            if (!ok) {
              setError(
                'Google did not finish the sign-in. If it showed "Access blocked", this calendar app\'s own Google configuration is rejecting the request and needs to be switched to Base44 credentials.'
              );
            }
            setBusy(false);
          });
        }
      }, 500);
      setTimeout(() => {
        clearInterval(timer);
        setBusy(false);
      }, 120000);
    } catch (err) {
      const message = err?.message || 'Could not start Google authorization';
      setError(
        /denied|blocked|verif|403/i.test(message)
          ? 'Google blocked the sign-in: the calendar app needs its permissions approved before other people can connect.'
          : message
      );
      setBusy(false);
    }
  };

  const handleSync = async () => {
    setBusy(true);
    await load();
    setBusy(false);
  };

  const handleDisconnect = async () => {
    setBusy(true);
    try {
      await base44.connectors.disconnectAppUser(CONNECTOR_ID);
      setStatus('disconnected');
      setCount(0);
    } catch (err) {
      setError(err?.message || 'Could not disconnect');
    }
    setBusy(false);
  };

  if (status === 'checking' || status === 'signed-out') return null;

  const connected = status === 'connected';

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/50 bg-card px-4 py-3">
      <div className="flex items-center gap-2">
        {connected ? (
          <CalendarCheck className="h-4 w-4 flex-shrink-0 text-primary" />
        ) : (
          <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
        )}
        <div>
          <p className="text-xs font-semibold text-foreground">Google Calendar</p>
          <p className="text-[11px] text-muted-foreground">
            {connected
              ? `Connected · ${count} upcoming event${count === 1 ? '' : 's'} synced`
              : 'Connect to see your own events alongside community events.'}
          </p>
          <p className="text-[10px] text-muted-foreground/80">
            Access requested: read-only view of your Google Calendar events.
          </p>
          {error && <p className="text-[11px] text-destructive">{error}</p>}
        </div>
      </div>

      <div className="flex gap-2">
        {connected ? (
          <>
            <Button size="sm" variant="outline" onClick={handleSync} disabled={busy} className="rounded-xl gap-1.5">
              <RefreshCw className={busy ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />
              Sync now
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDisconnect} disabled={busy} className="rounded-xl gap-1.5 text-muted-foreground">
              <LogOut className="h-3.5 w-3.5" />
              Disconnect
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={handleConnect} disabled={busy} className="rounded-xl gap-1.5">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Calendar className="h-3.5 w-3.5" />}
            Connect calendar
          </Button>
        )}
      </div>
    </div>
  );
}