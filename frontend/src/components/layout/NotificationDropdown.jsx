import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Heart, BookOpen, Trophy } from 'lucide-react';

const notifications = [
  { id: 1, icon: Sparkles, title: 'Your story "The Ember Throne" finished generating', time: '5m ago', tone: 'primary' },
  { id: 2, icon: Trophy, title: 'Achievement unlocked: 7-Day Streak', time: '2h ago', tone: 'warning' },
  { id: 3, icon: Heart, title: 'Marigold & Ruin was added to Favorites', time: 'Yesterday', tone: 'primary' },
  { id: 4, icon: BookOpen, title: 'Reminder: continue "The Hollow Choir"', time: '2 days ago', tone: 'neutral' },
];

const toneColor = {
  primary: 'bg-primary/15 text-red-400',
  warning: 'bg-warning/15 text-warning',
  neutral: 'bg-white/5 text-ink-soft',
};

export default function NotificationDropdown({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-ink">Notifications</span>
            <span className="text-xs text-primary">4 new</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-card-hover transition-colors border-b border-border/60 last:border-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${toneColor[n.tone]}`}>
                  <n.icon size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-ink leading-relaxed">{n.title}</p>
                  <p className="text-[11px] text-ink-soft mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={onClose} className="w-full text-center text-xs text-ink-soft hover:text-ink py-2.5 border-t border-border transition-colors">
            Mark all as read
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
