import { useEffect, useState } from "react";
import { BookOpenText, Bookmark, Heart, Type, UserRound } from "lucide-react";
import { getCurrentUser } from "../services/userService";
import { getDashboard } from "../services/dashboardService";
import { getMyStories } from "../services/libraryService";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [stories, setStories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCurrentUser(), getDashboard(), getMyStories()])
      .then(([user, stats, library]) => { setProfile(user); setDashboard(stats); setStories(library); })
      .catch((err) => setError(err.message || "Could not load profile."));
  }, []);

  const values = dashboard ? [
    { label: "Stories Created", value: dashboard.totalStories, icon: BookOpenText },
    { label: "Favorites", value: stories.filter((story) => story.favorite).length, icon: Heart },
    { label: "Completed", value: dashboard.completedStories, icon: Bookmark },
    { label: "Words Generated", value: dashboard.totalWords.toLocaleString(), icon: Type },
  ] : [];

  if (error) return <p role="alert" className="mx-auto max-w-4xl py-10 text-red-400">{error}</p>;
  if (!profile) return <div className="flex h-64 items-center justify-center text-ink-soft">Loading profile...</div>;
  const nameParts = (profile.fullName || profile.username || profile.email || "U").trim().split(/\s+/).filter(Boolean);
  const initials = (nameParts.length > 1
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
    : nameParts[0].slice(0, 2)).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-card border border-border rounded-2xl p-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-[#45A29E] flex items-center justify-center text-2xl font-serif-display text-[#0B0C10] shrink-0">{initials || <UserRound />}</div>
        <div><h2 className="text-xl font-semibold">{profile.fullName || profile.username}</h2><p className="text-sm text-ink-soft">{profile.email}</p><p className="mt-1 text-xs text-ink-soft">Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "recently"}</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {values.map((item) => <div key={item.label} className="bg-card border border-border rounded-2xl p-5 text-center"><item.icon size={18} className="text-primary mx-auto mb-2" /><p className="text-lg font-semibold text-ink">{item.value}</p><p className="text-xs text-ink-soft">{item.label}</p></div>)}
      </div>
    </div>
  );
}
