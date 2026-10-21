import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { applySavedAppearance } from '../../services/preferencesService';
import { Bookmark, BookOpen, LayoutDashboard, PenSquare, UserRound } from 'lucide-react';
import AnimatedStoryBackdrop from '../common/AnimatedStoryBackdrop';

const titles = {
  '/dashboard': 'Dashboard',
  '/new-story': 'New Story',
  '/library': 'Story Library',
  '/saved': 'Saved Stories',
  '/favorites': 'Favorites',
  '/history': 'Chat History',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const title = titles[pathname] || 'PlotForge AI';
  const reduceMotion = useReducedMotion();

  useEffect(() => { applySavedAppearance(); }, []);

  return (
    <div className="app-atmosphere relative isolate flex min-h-screen">
      <AnimatedStoryBackdrop />
      <Sidebar />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Navbar title={title} />
        <main className="flex-1 px-4 py-5 pb-24 sm:px-6 sm:py-6 md:pb-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={reduceMotion ? false : { opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -3 }}
              transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-sidebar/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-lg md:hidden">
        {[
          { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
          { to: '/new-story', label: 'Create', icon: PenSquare },
          { to: '/library', label: 'Library', icon: BookOpen },
          { to: '/saved', label: 'Saved', icon: Bookmark },
          { to: '/profile', label: 'Profile', icon: UserRound },
        ].map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-ink-soft hover:text-ink'}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span></NavLink>)}
      </nav>
    </div>
  );
}
