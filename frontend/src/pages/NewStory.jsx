import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowLeft, LayoutTemplate } from 'lucide-react';
import ChipGroup from '../components/story/ChipGroup';
import Slider from '../components/story/Slider';
import CharacterBuilder from '../components/story/CharacterBuilder';
import WorldBuilder from '../components/story/WorldBuilder';
import StoryPreview from '../components/story/StoryPreview';
import StoryViewer from '../components/story/StoryViewer';
import StoryTemplates from '../components/story/StoryTemplates';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { genres, lengths, styles, audiences, languages, complexities } from '../data/stories';
import { createStory, generateStory } from "../services/storyService";
const promptSuggestions = [
  'A retired dragon slayer is hired to protect the last dragon alive.',
  'Two sisters inherit a bookstore where every book writes itself.',
  'A city where it has rained for forty years finally sees the sun.',
];

export default function NewStory() {
  const [form, setForm] = useState({
    prompt: '',
    genre: 'Fantasy',
    length: 'Medium',
    style: 'Cinematic',
    audience: 'Adult',
    language: 'English',
    creativity: 65,
    complexity: 'Moderate',
    characterCount: 2,
    autoCharacters: false,
    autoWorld: true,
  });
  const [characters, setCharacters] = useState([]);
  const [world, setWorld] = useState({});
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [searchParams] = useSearchParams();
  const [showTemplates, setShowTemplates] = useState(searchParams.get('templates') === '1');
  const [story, setStory] = useState(null);
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateCharacter = (i, field, value) => {
    setCharacters((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const handleGenerate = async () => {

    if (!form.prompt.trim()) {
        alert("Please enter a story prompt.");
        return;
    }

    try {

        setGenerating(true);

        // Create story
        const createdStory = await createStory({
            title:
                form.prompt.length > 40
                    ? form.prompt.substring(0, 40)
                    : form.prompt,
            prompt: form.prompt,
            genre: form.genre,
        });

        // Generate AI story
        const generatedStory = await generateStory(createdStory.id);

        setStory(generatedStory);

        setGenerated(true);

    } catch (error) {

        console.error(error);

        alert("Failed to generate story.");

    } finally {

        setGenerating(false);

    }

};

  if (generating) return <Loader label="PlotForge is crafting your story…" />;

  if (generated) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setGenerated(false)}
          className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Back to builder
        </button>
        <div className="h-[70vh]">
          <StoryViewer
    title={story.title}
    genre={story.genre}
    readingTime={{ Short: 5, Medium: 12, Long: 25 }[form.length]}
    story={story}
/>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-ink-soft uppercase tracking-wide">Your Story Idea</label>
            <button
              type="button"
              onClick={() => setShowTemplates((s) => !s)}
              className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-primary transition-colors"
            >
              <LayoutTemplate size={13} /> {showTemplates ? 'Hide templates' : 'Browse templates'}
            </button>
          </div>

          {showTemplates && (
            <StoryTemplates
              onSelect={(t) => {
                set('prompt', t.prompt);
                set('genre', t.label === 'Fantasy Adventure' ? 'Fantasy' : form.genre);
                setShowTemplates(false);
              }}
            />
          )}

          <textarea
            value={form.prompt}
            onChange={(e) => set('prompt', e.target.value)}
            placeholder="Describe the story you want…"
            rows={4}
            maxLength={500}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:border-primary/50 resize-none transition-colors"
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-wrap gap-1.5">
              {promptSuggestions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set('prompt', p)}
                  className="text-[11px] text-ink-soft hover:text-primary border border-border hover:border-primary/40 rounded-full px-2.5 py-1 transition-colors"
                >
                  {p.length > 38 ? p.slice(0, 38) + '…' : p}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-ink-soft shrink-0 ml-2">{form.prompt.length}/500</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <ChipGroup label="Genre" options={genres} value={form.genre} onChange={(v) => set('genre', v)} />
          <ChipGroup label="Story Length" options={lengths} value={form.length} onChange={(v) => set('length', v)} />
          <ChipGroup label="Writing Style" options={styles} value={form.style} onChange={(v) => set('style', v)} />
          <ChipGroup label="Audience" options={audiences} value={form.audience} onChange={(v) => set('audience', v)} />
          <ChipGroup label="Language" options={languages} value={form.language} onChange={(v) => set('language', v)} />
          <Slider label="Creativity Level" value={form.creativity} onChange={(v) => set('creativity', v)} />
          <ChipGroup label="Story Complexity" options={complexities} value={form.complexity} onChange={(v) => set('complexity', v)} />

          <div className="h-px bg-border my-6" />

          <CharacterBuilder
            count={form.characterCount}
            setCount={(v) => set('characterCount', v)}
            auto={form.autoCharacters}
            setAuto={(v) => set('autoCharacters', v)}
            characters={characters}
            updateCharacter={updateCharacter}
          />

          <div className="h-px bg-border my-6" />

          <WorldBuilder
            world={world}
            setWorld={setWorld}
            auto={form.autoWorld}
            setAuto={(v) => set('autoWorld', v)}
          />
        </div>

        <Button variant="primary" size="lg" icon={Sparkles} className="w-full mt-6" onClick={handleGenerate}>
          Generate Story
        </Button>
      </motion.div>

      <div className="hidden lg:block">
        <StoryPreview form={{ ...form, worldName: world.worldName }} />
      </div>
    </div>
  );
}
