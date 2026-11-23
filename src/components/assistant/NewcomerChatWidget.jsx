import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NexaAvatarCall from '@/components/assistant/NexaAvatarCall';

// Floating entry point to the live voice-and-video assistant.
export default function NewcomerChatWidget({ userCity, userProvince }) {
  const [open, setOpen] = useState(false);
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
            className="fixed bottom-24 right-4 md:bottom-8 md:right-6 z-40 w-12 h-12 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-foreground" />
            </span>
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
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">Nexa</p>
                  <p className="text-[10px] text-white/70">Live voice · Settlement help</p>
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

            <div className="p-3">
              <NexaAvatarCall guest={guest} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}