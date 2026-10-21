import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

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
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Bell size={15} className="text-primary" />
            <span className="text-sm font-semibold text-ink">Notifications</span>
          </div>
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-ink">No recent notifications</p>
            <p className="mt-1 text-xs text-ink-soft">Turn on story completion alerts in Settings to get browser notifications.</p>
          </div>
          <Link to="/settings" onClick={onClose} className="flex items-center justify-center gap-2 border-t border-border py-3 text-xs text-ink-soft hover:text-ink">
            <Settings size={13} /> Notification settings
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
