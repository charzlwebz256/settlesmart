import { useState } from 'react';
import { X, Mic, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NexaAvatarCall from '@/components/assistant/NexaAvatarCall';
import NexaTextChat from '@/components/assistant/NexaTextChat';
import { NEXA_PORTRAIT } from '@/data/nexaPortrait';
import { cn } from '@/lib/utils';

// Floating entry point to Nexa: a live voice-and-video call or a written chat.
export default function NewcomerChatWidget({ userCity, userProvince }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('talk');
  const guest = userCity || userProvince ? { city: userCity, province: userProvince } : null;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            aria-label="Talk with Nexa, the settlement guide"
            className="fixed bottom-24 right-4 md:bottom-8 md:right-6 z-40 w-14 h-14 rounded-full overflow-hidden shadow-lg shadow-primary/30 ring-2 ring-primary/40 hover:scale-105 transition-transform"
          >
            <img src={NEXA_PORTRAIT} alt="Nexa" className="w-full h-full object-cover" />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-card" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-[calc(100vw-2rem)] max-w-sm bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2.5 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <img src={NEXA_PORTRAIT} alt="Nexa" className="w-8 h-8 rounded-full object-cover ring-2 ring-white/40" />
                <div>
                  <p className="font-semibold text-sm leading-tight">Nexa</p>
                  <p className="text-[10px] text-white/70">
                    {mode === 'talk' ? 'Live voice · Settlement help' : 'Text chat · Settlement help'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-1 border-b border-border/50 p-1.5">
              <button
                onClick={() => setMode('talk')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors',
                  mode === 'talk' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Mic className="h-3.5 w-3.5" /> Talk
              </button>
              <button
                onClick={() => setMode('type')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors',
                  mode === 'type' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Keyboard className="h-3.5 w-3.5" /> Type
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-3">
              {mode === 'talk' ? (
                <NexaAvatarCall guest={guest} />
              ) : (
                <NexaTextChat guest={guest} className="h-[380px]" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}