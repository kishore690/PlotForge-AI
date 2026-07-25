import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

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

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
