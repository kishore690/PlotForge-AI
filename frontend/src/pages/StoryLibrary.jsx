import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library } from 'lucide-react';
import StoryCard from '../components/story/StoryCard';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import { useEffect } from "react";
import { getMyStories, deleteStory } from "../services/libraryService";
import { useNavigate } from "react-router-dom";
export default function StoryLibrary() {
  const [stories, setStories] = useState([]);
const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const [sort, setSort] = useState('recent');
  const navigate = useNavigate();
  useEffect(() => {
    

    const loadStories = async () => {

        try {

            const data = await getMyStories();

            setStories(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    loadStories();

  }, []);
  const openStory = (story) => {

    navigate("/read-story", {
        state: { story }
    });

};

  const filtered = useMemo(() => {
    let list = stories.filter((s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) &&
      (genre === 'All' || s.genre === genre)
    );
    if (sort === 'recent') list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [stories, query, genre, sort]);

  const toggleFavorite = (id) =>
    setStories((prev) => prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s)));
  const remove = async (id) => {

    try {

        await deleteStory(id);

        setStories((prev) =>
            prev.filter((s) => s.id !== id)
        );

    } catch (error) {

        console.error(error);

    }

};
if (loading) {
    return (
        <div className="flex items-center justify-center h-screen text-white text-xl">
            Loading Stories...
        </div>
    );
}
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar value={query} onChange={setQuery} className="flex-1" />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-ink-soft focus:outline-none focus:border-primary/50"
        >
          <option>All</option>
          {[...new Set(stories.map((s) => s.genre))].map((g) => (
    <option key={g}>{g}</option>
))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-ink-soft focus:outline-none focus:border-primary/50"
        >
          <option value="recent">Most recent</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No stories found"
          subtitle="Try a different search term or genre filter."
          actionLabel="Create New Story"
          onAction={() => (window.location.href = '/new-story')}
        />
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((s) => (
              <StoryCard
    key={s.id}
    story={s}
    onOpen={openStory}
    onToggleFavorite={toggleFavorite}
    onDelete={remove}
/>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
