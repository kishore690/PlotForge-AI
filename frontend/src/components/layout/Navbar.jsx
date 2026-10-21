import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../common/SearchBar';
import NotificationDropdown from './NotificationDropdown';
import { getCurrentUser } from '../../services/userService';

const getInitials = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
};

export default function Navbar({ title = 'Dashboard' }) {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchKeyDown = (event) => {
    if (event.key !== 'Enter' || !searchQuery.trim()) return;
    navigate(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <header className="sticky top-0 z-30 glass border-b border-border px-6 py-3.5 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-lg font-semibold text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-3 flex-1 max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search your stories…"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
          >
            <Bell size={16} />
          </button>
          <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Open profile menu"
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg bg-card border border-border hover:bg-card-hover transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-[#45A29E] flex items-center justify-center text-[10px] font-semibold text-[#0B0C10]">{getInitials(user?.fullName || user?.username || user?.email)}</div>
            <ChevronDown size={14} className="text-ink-soft" />
          </button>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
            >
              <Link to="/profile" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-ink-soft hover:text-ink hover:bg-card-hover">Profile</Link>
              <Link to="/settings" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-ink-soft hover:text-ink hover:bg-card-hover">Settings</Link>
              <button onClick={() => { localStorage.removeItem('token'); setOpen(false); navigate('/login', { replace: true }); }} className="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-card-hover">Logout</button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
