import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, PenSquare, Library, Bookmark, Heart, History,
  User, Settings, LogOut, ChevronsLeft, Feather,
} from 'lucide-react';
import clsx from 'clsx';

const menu = [
  { to: '/dashboard', label: 'Dashboard', icon: Sparkles },
  { to: '/new-story', label: 'New Story', icon: PenSquare },
  { to: '/library', label: 'Story Library', icon: Library },
  { to: '/saved', label: 'Saved Stories', icon: Bookmark },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/history', label: 'Chat History', icon: History },
];

const bottomMenu = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 248 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 bg-sidebar border-r border-border py-5 px-3"
    >
      <div className="flex items-center gap-2.5 px-2 mb-8 overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-red-900 flex items-center justify-center shrink-0">
          <Feather size={16} className="text-white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <span className="font-serif-display text-lg font-medium whitespace-nowrap tracking-tight">
            PlotForge <span className="text-primary">AI</span>
          </span>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {menu.map((item) => (
          <SidebarLink key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 pt-3 border-t border-border">
        {bottomMenu.map((item) => (
          <SidebarLink key={item.to} item={item} collapsed={collapsed} />
        ))}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-soft hover:text-ink hover:bg-card transition-colors"
        >
          <LogOut size={18} strokeWidth={1.75} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className="mt-3 self-end mr-1 w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
      >
        <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronsLeft size={14} />
        </motion.span>
      </button>
    </motion.aside>
  );
}

function SidebarLink({ item, collapsed }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) => clsx(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-200',
        isActive ? 'text-ink bg-card' : 'text-ink-soft hover:text-ink hover:bg-card/60'
      )}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="active-pill"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Icon size={18} strokeWidth={1.75} className={clsx('shrink-0', isActive && 'text-primary')} />
          {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}
