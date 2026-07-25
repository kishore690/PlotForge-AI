import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import NewStory from './pages/NewStory';
import StoryLibrary from './pages/StoryLibrary';
import SavedStories from './pages/SavedStories';
import Favorites from './pages/Favorites';
import ChatHistory from './pages/ChatHistory';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ReadStory from './pages/ReadStory';
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login register />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-story" element={<NewStory />} />
        <Route path="/library" element={<StoryLibrary />} />
        <Route path="/saved" element={<SavedStories />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/history" element={<ChatHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/read-story" element={<ReadStory />} />
      </Route>
    </Routes>
  );
}
