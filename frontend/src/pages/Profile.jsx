import { motion } from 'framer-motion';
import { BookOpenText, Bookmark, Heart, Type, Award } from 'lucide-react';

const stats = [
  { label: 'Stories Created', value: 24, icon: BookOpenText },
  { label: 'Stories Saved', value: 11, icon: Bookmark },
  { label: 'Favorite Genre', value: 'Fantasy', icon: Heart },
  { label: 'Words Generated', value: '128,430', icon: Type },
];

const achievements = ['First Story', '10 Stories Written', 'World Builder', '7-Day Streak', 'Genre Explorer'];

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-red-900 flex items-center justify-center text-2xl font-serif-display shrink-0">
          K
        </div>
        <div>
          <h2 className="text-xl font-semibold">Kishore</h2>
          <p className="text-sm text-ink-soft">kishore@example.com</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5 text-center">
            <s.icon size={18} className="text-primary mx-auto mb-2" />
            <p className="text-lg font-semibold text-ink">{s.value}</p>
            <p className="text-xs text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2"><Award size={15} className="text-primary" /> Achievements</h3>
        <div className="flex flex-wrap gap-2">
          {achievements.map((a) => (
            <span key={a} className="text-xs font-medium bg-primary/10 text-red-400 border border-primary/30 rounded-full px-3 py-1.5">{a}</span>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-ink mb-4">Activity</h3>
        <div className="grid grid-cols-12 gap-1.5">
          {Array.from({ length: 84 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-sm"
              style={{ background: i % 5 === 0 ? '#DC2626' : i % 3 === 0 ? '#7f1d1d' : '#1f1f1f' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
