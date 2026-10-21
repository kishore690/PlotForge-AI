import { useState, useMemo } from 'react';
import { Heart } from 'lucide-react';
import StoryCard from '../components/story/StoryCard';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import { deleteStory, getMyStories, updateStory } from "../services/libraryService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => stories.filter((s) => s.favorite && s.title.toLowerCase().includes(query.toLowerCase())),
    [stories, query]
  );

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

  const toggleFavorite = async (id) => {
    const story = stories.find((item) => item.id === id);
    if (!story) return;
    try {
      const updated = await updateStory(id, { favorite: !story.favorite });
      setStories((prev) => prev.map((item) => item.id === id ? updated : item));
    } catch (error) { console.error(error); }
  };
  const toggleSaved = async (id) => {
    const story = stories.find((item) => item.id === id);
    if (!story) return;
    try {
      const updated = await updateStory(id, { saved: !story.saved });
      setStories((prev) => prev.map((item) => item.id === id ? updated : item));
    } catch (error) { console.error(error); }
  };
  const remove = async (id) => {
    try {
      await deleteStory(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <SearchBar value={query} onChange={setQuery} className="mb-6 max-w-sm" />
      {filtered.length === 0 ? (
        <EmptyState icon={Heart} title="No favorites yet" subtitle="Tap the heart on any story to keep it close." actionLabel="Browse Library" onAction={() => navigate('/library')} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => <StoryCard key={s.id} story={s} onOpen={(story) => navigate(`/read-story/${story.id}`)} onToggleFavorite={toggleFavorite} onToggleSaved={toggleSaved} onDelete={remove} />)}
        </div>
      )}
    </div>
  );
}
