import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library, Upload } from 'lucide-react';
import StoryCard from '../components/story/StoryCard';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import { useEffect } from "react";
import { getMyStories, deleteStory, updateStory, importStory } from "../services/libraryService";
import { useNavigate, useSearchParams } from "react-router-dom";
export default function StoryLibrary() {
  const [stories, setStories] = useState([]);
const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const [query, setQuery] = useState(searchTerm);
  const [genre, setGenre] = useState('All');
  const [sort, setSort] = useState('recent');
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const fileInput = useRef(null);
  const navigate = useNavigate();
  useEffect(() => setQuery(searchTerm), [searchTerm]);
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

    navigate(`/read-story/${story.id}`);

};

  const filtered = useMemo(() => {
    let list = stories.filter((s) =>
      `${s.title || ''} ${s.prompt || ''}`.toLowerCase().includes(query.toLowerCase()) &&
      (genre === 'All' || s.genre === genre)
    );
    if (sort === 'recent') list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === 'updated') list = [...list].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    if (sort === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [stories, query, genre, sort]);

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

        setStories((prev) =>
            prev.filter((s) => s.id !== id)
        );

    } catch (error) {

        console.error(error);

    }

};
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setImporting(true);
    setImportMessage('');
    try {
      const content = await file.text();
      if (!content.trim()) throw new Error('That file is empty. Choose a .txt or .md story file.');
      const title = file.name.replace(/\.(txt|md)$/i, '').replace(/[-_]/g, ' ').trim() || 'Imported Story';
      const story = await importStory({ title, genre: 'Imported', generatedStory: content });
      setStories((items) => [story, ...items]);
      setImportMessage(`Imported “${story.title}”.`);
    } catch (error) {
      setImportMessage(error.message || 'Could not import that story.');
    } finally {
      setImporting(false);
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
      <div className="flex items-center justify-between gap-4 mb-5">
        <p className="text-sm text-ink-soft">Your drafts and completed stories</p>
        <>
          <input ref={fileInput} type="file" accept=".txt,.md,text/plain,text/markdown" onChange={handleImport} className="hidden" />
          <button type="button" disabled={importing} onClick={() => fileInput.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-ink-soft hover:text-ink disabled:opacity-60"><Upload size={15} />{importing ? 'Importing…' : 'Import story'}</button>
        </>
      </div>
      {importMessage && <p role="status" className="mb-4 text-sm text-ink-soft">{importMessage}</p>}
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
          <option value="updated">Recently updated</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No stories found"
          subtitle="Try a different search term or genre filter."
          actionLabel="Create New Story"
          onAction={() => navigate('/new-story')}
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
    onToggleSaved={toggleSaved}
    onDelete={remove}
/>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
