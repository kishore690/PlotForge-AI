import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  PenSquare, BookOpenText, Heart, Flame, ArrowRight, Bookmark,
  Clock, Shuffle, LayoutTemplate, Upload,
} from 'lucide-react';
import StoryCard from '../components/story/StoryCard';
import Button from '../components/common/Button';
import { deleteStory } from "../services/libraryService";
import AnimatedCounter from '../components/common/AnimatedCounter';
import { useEffect, useState } from "react";
import {
  getDashboard,
  getMyStories
} from "../services/dashboardService";
const quickActions = [
  { label: 'New Story', icon: PenSquare, to: '/new-story' },
  { label: 'Random Prompt', icon: Shuffle, to: '/new-story' },
  { label: 'Story Templates', icon: LayoutTemplate, to: '/new-story?templates=1' },
  { label: 'Import Story', icon: Upload, to: '/library' },
];

export default function Dashboard() {

  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [recentStories, setRecentStories] = useState([]);
  const [loading, setLoading] = useState(true);
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

        setDashboard(dashboardData);
        setRecentStories(stories.slice(0, 4));

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

    navigate("/read-story", {
        state: { story }
    });

    };
    const removeStory = async (id) => {

    try {

        await deleteStory(id);

        await loadDashboard();

    } catch (error) {

        console.error(error);

    }

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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card border border-border rounded-2xl p-8 overflow-hidden"
      >
        <motion.div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif-display text-2xl mb-1.5">Welcome back, Kishore 👋</h2>
            <p className="text-sm text-ink-soft">Ready to create another masterpiece?</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="lg" icon={BookOpenText} onClick={() => navigate('/library')}>
              Continue Writing
            </Button>
            <Link to="/new-story">
              <Button size="lg" icon={PenSquare}>New Story</Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickActions.map((a, i) => (
          <motion.div
            key={a.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={a.to}
              className="flex flex-col items-center justify-center gap-2 bg-card border border-border rounded-2xl py-5 hover:bg-card-hover hover:border-[#3a3a3a] transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <a.icon size={16} className="text-primary" />
              </div>
              <span className="text-xs font-medium text-ink-soft">{a.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-ink">Recent Stories</h3>
          <Link to="/library" className="text-xs text-ink-soft hover:text-ink flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentStories.map((s) => (
    <StoryCard
        key={s.id}
        story={s}
        onOpen={openStory}
        onDelete={removeStory}
    />
))}
        </div>
      </div>
    </div>
  );
}
