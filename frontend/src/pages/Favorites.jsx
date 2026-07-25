import { useState, useMemo } from 'react';
import { Heart } from 'lucide-react';
import StoryCard from '../components/story/StoryCard';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import { stories as initial } from '../data/stories';

export default function Favorites() {
  const [stories, setStories] = useState(initial);
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => stories.filter((s) => s.favorite && s.title.toLowerCase().includes(query.toLowerCase())),
    [stories, query]
  );

  const toggleFavorite = (id) => setStories((prev) => prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s)));
  const remove = (id) => setStories((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="max-w-6xl mx-auto">
      <SearchBar value={query} onChange={setQuery} className="mb-6 max-w-sm" />
      {filtered.length === 0 ? (
        <EmptyState icon={Heart} title="No favorites yet" subtitle="Tap the heart on any story to keep it close." actionLabel="Browse Library" onAction={() => (window.location.href = '/library')} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => <StoryCard key={s.id} story={s} onToggleFavorite={toggleFavorite} onDelete={remove} />)}
        </div>
      )}
    </div>
  );
}
