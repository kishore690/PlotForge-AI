import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  PenSquare, BookOpenText, Heart, Flame, ArrowRight, Bookmark,
  Shuffle, LayoutTemplate, Upload,
} from 'lucide-react';
import StoryCard from '../components/story/StoryCard';
import Button from '../components/common/Button';
import { deleteStory, updateStory } from "../services/libraryService";
import AnimatedCounter from '../components/common/AnimatedCounter';
import { useEffect, useState } from "react";
import {
  getDashboard,
  getMyStories
} from "../services/dashboardService";
import { getCurrentUser } from "../services/userService";
import libraryAtmosphere from "../assets/library-atmosphere.jpg";
const quickActions = [
  { label: 'Start with a prompt', icon: PenSquare, to: '/new-story' },
  { label: 'Explore templates', icon: LayoutTemplate, to: '/new-story?templates=1' },
  { label: 'Surprise me', icon: Shuffle, to: '/new-story?random=1' },
  { label: 'Browse library', icon: Upload, to: '/library' },
];

export default function Dashboard() {

  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [recentStories, setRecentStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const stats = dashboard
  ? [
      {
        label: "Total Stories",
        value: dashboard.totalStories,
        icon: BookOpenText,
      },
      {
        label: "Completed",
        value: dashboard.completedStories,
        icon: Bookmark,
      },
      {
        label: "Drafts",
        value: dashboard.draftStories,
        icon: Heart,
      },
      {
        label: "Words Generated",
        value: dashboard.totalWords,
        icon: Flame,
      },
    ]
  : [];
  const loadDashboard = async () => {

      try {

        const dashboardData = await getDashboard();
        const stories = await getMyStories();
        const user = await getCurrentUser();

        setDashboard(dashboardData);
        setRecentStories(stories.slice(0, 4));
        setCurrentUser(user);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {
    loadDashboard();

}, []);
    const openStory = (story) => {

    navigate(`/read-story/${story.id}`);

    };
    const removeStory = async (id) => {

    try {

        await deleteStory(id);

        await loadDashboard();

    } catch (error) {

        console.error(error);

    }

};

  const toggleFavorite = async (story) => {
    try {
      const updated = await updateStory(story.id, { favorite: !story.favorite });
      setRecentStories((items) => items.map((item) => item.id === updated.id ? updated : item));
    } catch (error) { console.error(error); }
  };

  const toggleSaved = async (story) => {
    try {
      const updated = await updateStory(story.id, { saved: !story.saved });
      setRecentStories((items) => items.map((item) => item.id === updated.id ? updated : item));
    } catch (error) { console.error(error); }
  };

    
    
  

if (loading) {
  return (
    <div className="flex items-center justify-center h-screen text-white text-xl">
      Loading Dashboard...
    </div>
  );
}


  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome banner */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        aria-labelledby="dashboard-welcome"
        className="relative isolate overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: `url(${libraryAtmosphere})` }} />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0B0C10] via-[#0B0C10]/95 to-[#0B0C10]/60" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0B0C10]/65 via-transparent to-[#0B0C10]/10" />
        <div className="grid min-h-[300px] items-center gap-8 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:p-11">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your writing workspace</p>
            <h2 id="dashboard-welcome" className="font-serif-display text-3xl leading-tight text-white sm:text-4xl">A new story starts with one idea.</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">Welcome back, {String(currentUser?.fullName || currentUser?.username || "Writer").replace(/\s+/g, " ").replace(/[.,\s]+$/g, "")}. Shape a world, build your cast, and turn a spark into a story.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/new-story"><Button size="lg" icon={PenSquare}>Create a story</Button></Link>
              <Button variant="secondary" size="lg" icon={BookOpenText} onClick={() => navigate('/library')}>Open my library</Button>
            </div>
          </div>
          <div className="hidden min-w-44 rounded-2xl border border-white/15 bg-black/25 px-5 py-4 backdrop-blur-sm sm:block lg:mr-2">
            <p className="text-xs uppercase tracking-wide text-white/60">Your collection</p>
            <p className="mt-2 text-3xl font-semibold text-white">{dashboard?.totalStories ?? 0}</p>
            <p className="mt-1 text-sm text-white/70">{dashboard?.totalStories === 1 ? 'story created' : 'stories created'}</p>
          </div>
        </div>
      </motion.section>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {quickActions.map((a, i) => (
          <motion.div
            key={a.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={a.to}
              className="flex min-h-28 flex-col items-center justify-center gap-2 bg-card border border-border rounded-2xl px-3 py-4 hover:bg-card-hover hover:border-primary/40 transition-colors sm:min-h-32"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <a.icon size={16} className="text-primary" />
              </div>
              <span className="text-center text-xs font-medium text-ink-soft">{a.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ delay: i * 0.08 }}
            className="relative rounded-2xl p-[1px] bg-gradient-to-br from-primary/40 via-border to-border overflow-hidden group"
          >
            <div className="absolute inset-0 rounded-2xl bg-primary/0 group-hover:bg-primary/5 blur-xl transition-all" />
            <div className="relative bg-card rounded-2xl p-5 h-full flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <s.icon size={19} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-semibold text-ink">
                  <AnimatedCounter value={s.value} suffix={s.suffix || ''} />
                </p>
                <p className="text-xs text-ink-soft truncate">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent stories */}
      <section aria-labelledby="recent-stories-heading">
        <div className="flex items-center justify-between mb-4">
          <h3 id="recent-stories-heading" className="font-semibold text-ink">Recent stories</h3>
          <Link to="/library" className="text-xs text-ink-soft hover:text-ink flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {recentStories.length > 0 ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {recentStories.map((s) => (
    <StoryCard
        key={s.id}
        story={s}
        onOpen={openStory}
        onToggleFavorite={() => toggleFavorite(s)}
        onToggleSaved={() => toggleSaved(s)}
        onDelete={removeStory}
    />
))}
        </div> : <div className="rounded-2xl border border-dashed border-border bg-card/70 px-6 py-8 text-center sm:py-10"><div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><BookOpenText size={20} /></div><p className="font-medium text-ink">Your first story is waiting</p><p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-ink-soft">Start with a simple idea. You can shape the genre, characters, and setting as you go.</p><Link to="/new-story" className="mt-4 inline-flex text-sm font-medium text-primary hover:text-primary-hover">Write your first story <ArrowRight size={15} className="ml-1" /></Link></div>}
      </section>
    </div>
  );
}
