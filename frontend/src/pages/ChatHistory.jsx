import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { History, BookOpen } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import { stories } from '../data/stories';

function groupLabel(dateStr) {
  const date = new Date(dateStr);
  const now = new Date('2026-07-22');
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) return 'Today';
  if (diffDays <= 2) return 'Yesterday';
  if (diffDays <= 7) return 'Last Week';
  return 'Last Month';
}

export default function ChatHistory() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => stories.filter((s) => s.title.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  const groups = filtered.reduce((acc, s) => {
    const label = groupLabel(s.createdAt);
    acc[label] = acc[label] || [];
    acc[label].push(s);
    return acc;
  }, {});

  const order = ['Today', 'Yesterday', 'Last Week', 'Last Month'];

  return (
    <div className="max-w-3xl mx-auto">
      <SearchBar value={query} onChange={setQuery} className="mb-8" />

      {filtered.length === 0 ? (
        <EmptyState icon={History} title="No history yet" subtitle="Your generated stories will show up here in a timeline." actionLabel="Create New Story" onAction={() => (window.location.href = '/new-story')} />
      ) : (
        <div className="relative pl-6 border-l border-border space-y-10">
          {order.filter((k) => groups[k]?.length).map((label) => (
            <div key={label} className="relative">
              <span className="absolute -left-[29px] top-0 w-3 h-3 rounded-full bg-primary" />
              <h3 className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-4">{label}</h3>
              <div className="space-y-3">
                {groups[label].map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:bg-card-hover transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.cover }}>
                      <BookOpen size={15} className="text-white/80" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink truncate">{s.title}</p>
                      <p className="text-xs text-ink-soft">{s.genre} · {s.createdAt}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
