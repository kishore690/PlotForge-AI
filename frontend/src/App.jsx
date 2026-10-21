import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NewStory = lazy(() => import('./pages/NewStory'));
const StoryLibrary = lazy(() => import('./pages/StoryLibrary'));
const SavedStories = lazy(() => import('./pages/SavedStories'));
const Favorites = lazy(() => import('./pages/Favorites'));
const ChatHistory = lazy(() => import('./pages/ChatHistory'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const ReadStory = lazy(() => import('./pages/ReadStory'));
export default function App() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-bg text-sm text-ink-soft">Loading PlotForge…</div>}>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login register />} />

      <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-story" element={<NewStory />} />
        <Route path="/library" element={<StoryLibrary />} />
        <Route path="/saved" element={<SavedStories />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/history" element={<ChatHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/read-story/:id" element={<ReadStory />} />
      </Route>
    </Routes>
    </Suspense>
  );
}

function RequireAuth({ children }) {
  const location = useLocation();
  return localStorage.getItem('token')
    ? children
    : <Navigate to="/login" replace state={{ from: location }} />;
}
