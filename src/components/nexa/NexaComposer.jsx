import { useRef } from 'react';
import { Send, Mic, MicOff, Paperclip, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Text box for Nexa: type, speak or attach a document.
export default function NexaComposer({
  value,
  onChange,
  onSend,
  sending,
  attachment,
  uploading,
  onPickFile,
  onRemoveFile,
  onMic,
  listening,
  micSupported,
}) {
  const fileRef = useRef(null);

  return (
    <div className="border-t border-border/50 p-2.5">
      {attachment && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-lg bg-secondary px-2.5 py-1.5">
          <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-secondary-foreground">
            <Paperclip className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{attachment.name}</span>
          </span>
          <button onClick={onRemoveFile} aria-label="Remove document" className="text-muted-foreground hover:text-destructive">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        className="flex items-end gap-1.5"
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPickFile(file);
            e.target.value = '';
          }}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => fileRef.current?.click()}
          disabled={uploading || sending}
          aria-label="Attach a document"
          className="h-9 w-9 flex-shrink-0 rounded-xl text-muted-foreground"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
        </Button>

        {micSupported && (
          <Button
            type="button"
            size="icon"
            variant={listening ? 'default' : 'ghost'}
            onClick={onMic}
            aria-label={listening ? 'Stop listening' : 'Ask by voice'}
            className={cn('h-9 w-9 flex-shrink-0 rounded-xl', !listening && 'text-muted-foreground', listening && 'animate-pulse')}
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          rows={1}
          placeholder={listening ? 'Listening…' : 'Ask Nexa about life in Canada'}
          className="max-h-28 min-h-[38px] flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
        />

        <Button
          type="submit"
          size="icon"
          disabled={sending || uploading || (!value.trim() && !attachment)}
          aria-label="Send"
          className="h-9 w-9 flex-shrink-0 rounded-xl"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}