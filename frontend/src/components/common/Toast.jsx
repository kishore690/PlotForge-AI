import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

const icons = { success: CheckCircle2, error: XCircle, info: Info };
const colors = { success: 'text-success', error: 'text-primary', info: 'text-ink-soft' };

export default function Toast({ toasts = [] }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type] || Info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="glass border border-border rounded-xl px-4 py-3 flex items-center gap-2.5 shadow-xl min-w-[240px]"
            >
              <Icon size={18} className={colors[t.type]} />
              <span className="text-sm text-ink">{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
