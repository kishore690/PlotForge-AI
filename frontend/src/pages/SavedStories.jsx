import { useState, useMemo } from 'react';
import { Bookmark } from 'lucide-react';
import StoryCard from '../components/story/StoryCard';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import { stories as initial } from '../data/stories';

export default function SavedStories() {
  const [stories, setStories] = useState(initial.filter((s) => s.progress > 0));
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => stories.filter((s) => s.title.toLowerCase().includes(query.toLowerCase())),
    [stories, query]
  );

  const toggleFavorite = (id) => setStories((prev) => prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s)));
  const remove = (id) => setStories((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="max-w-6xl mx-auto">
      <SearchBar value={query} onChange={setQuery} className="mb-6 max-w-sm" />
      {filtered.length === 0 ? (
        <EmptyState icon={Bookmark} title="No saved stories yet" subtitle="Stories you save will appear here for quick access." actionLabel="Browse Library" onAction={() => (window.location.href = '/library')} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => <StoryCard key={s.id} story={s} onToggleFavorite={toggleFavorite} onDelete={remove} />)}
        </div>
      )}
    </div>
  );
}
