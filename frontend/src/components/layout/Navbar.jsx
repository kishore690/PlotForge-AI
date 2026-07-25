import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Moon, Sun, ChevronDown } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({ title = 'Dashboard' }) {
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 glass border-b border-border px-6 py-3.5 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-lg font-semibold text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-3 flex-1 max-w-md">
        <SearchBar placeholder="Search stories, characters, worlds…" />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setDark((d) => !d)}
          className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
        >
          {dark ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
          </button>
          <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg bg-card border border-border hover:bg-card-hover transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-red-900" />
            <ChevronDown size={14} className="text-ink-soft" />
          </button>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
            >
              <a href="/profile" className="block px-4 py-2.5 text-sm text-ink-soft hover:text-ink hover:bg-card-hover">Profile</a>
              <a href="/settings" className="block px-4 py-2.5 text-sm text-ink-soft hover:text-ink hover:bg-card-hover">Settings</a>
              <button className="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-card-hover">Logout</button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
