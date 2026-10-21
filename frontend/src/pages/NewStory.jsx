import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowLeft, LayoutTemplate, BookOpen, WandSparkles } from 'lucide-react';
import ChipGroup from '../components/story/ChipGroup';
import Slider from '../components/story/Slider';
import CharacterBuilder from '../components/story/CharacterBuilder';
import WorldBuilder from '../components/story/WorldBuilder';
import StoryPreview from '../components/story/StoryPreview';
import StoryViewer from '../components/story/StoryViewer';
import StoryTemplates from '../components/story/StoryTemplates';
import Button from '../components/common/Button';
import { genres, lengths, styles, audiences, languages, complexities } from '../data/stories';
import { createStory, generateStory } from "../services/storyService";
import { updateStory } from "../services/libraryService";
import { getPreferences } from "../services/preferencesService";
import { createStoryTitle } from "../utils/storyTitle";
const promptSuggestions = [
  'A retired dragon slayer is hired to protect the last dragon alive.',
  'Two sisters inherit a bookstore where every book writes itself.',
  'A city where it has rained for forty years finally sees the sun.',
];


export default function NewStory() {
  const [form, setForm] = useState(() => ({
    prompt: '',
    ...getPreferences().storyDefaults,
    language: getPreferences().language,
  }));
  const [characters, setCharacters] = useState([]);
  const [world, setWorld] = useState({});
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [generated, setGenerated] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTemplates, setShowTemplates] = useState(searchParams.get('templates') === '1');
  const [story, setStory] = useState(null);
  const [generationStage, setGenerationStage] = useState(0);
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  useEffect(() => {
    if (searchParams.get('random') !== '1') return;
    const prompt = promptSuggestions[Math.floor(Math.random() * promptSuggestions.length)];
    setForm((current) => ({ ...current, prompt }));
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);
  useEffect(() => {
    if (!generating) { setGenerationStage(0); return undefined; }
    const timer = window.setInterval(() => setGenerationStage((stage) => Math.min(stage + 1, 3)), 2600);
    return () => window.clearInterval(timer);
  }, [generating]);
  const updateCharacter = (i, field, value) => {
    setCharacters((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const handleGenerate = async () => {

    if (!form.prompt.trim()) {
        setGenerationError("Add a story idea before generating.");
        return;
    }

    try {

        setGenerating(true);
        setGenerationError('');

        const storyPayload = {
    title: createStoryTitle(form.prompt),

    prompt: form.prompt,
    genre: form.genre,

    length: form.length,
    style: form.style,
    audience: form.audience,
    language: form.language,
    creativity: form.creativity,
    complexity: form.complexity,

    characterCount: form.characterCount,
    autoCharacters: form.autoCharacters,
    autoWorld: form.autoWorld,

    characters: JSON.stringify(characters),
    world: JSON.stringify(world),
};

        // Reuse the saved draft if generation failed previously so retries do not create duplicates.
        const createdStory = story?.id && !story.generatedStory
          ? await updateStory(story.id, storyPayload)
          : await createStory(storyPayload);
        setStory(createdStory);

        // Generate AI story
        const generatedStory = await generateStory(createdStory.id);

        setStory(generatedStory);

        const preferences = getPreferences();
        if (preferences.notifications.storyCompleted && document.hidden && "Notification" in window && Notification.permission === "granted") {
          new Notification("Your PlotForge story is ready", { body: generatedStory.title || "Open PlotForge to read your story." });
        }

        setGenerated(true);

    } catch (error) {

        console.error(error);

        setGenerationError(error.message || "Failed to generate story. Please try again.");

    } finally {

        setGenerating(false);

    }

};

  if (generating) {
    const stages = ["Reading your idea", "Building the world and characters", "Writing the story", "Polishing the ending"];
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center px-4 py-12">
        <section aria-live="polite" className="w-full rounded-3xl border border-border bg-card p-7 shadow-xl sm:p-10">
          <div className="mb-7 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><WandSparkles size={22} /></div>
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your story is taking shape</p><h2 className="mt-1 text-xl font-semibold text-ink">A little imagination, in progress</h2></div>
          </div>
          <div className="mb-6 rounded-2xl border border-border bg-bg px-5 py-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">Your starting idea</p>
            <p className="text-sm leading-6 text-ink">{form.prompt}</p>
          </div>
          <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-border"><motion.div className="h-full w-1/3 rounded-full bg-primary" animate={{ x: ["-110%", "310%"] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} /></div>
          <div className="space-y-3">
            {stages.map((stage, index) => <div key={stage} className={`flex items-center gap-3 text-sm transition-colors ${index <= generationStage ? "text-ink" : "text-ink-soft/60"}`}><span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${index < generationStage ? "bg-primary text-white" : index === generationStage ? "bg-primary/15 text-primary" : "border border-border"}`}>{index < generationStage ? "✓" : index + 1}</span>{stage}{index === generationStage && <span className="ml-auto text-xs text-primary">Working…</span>}</div>)}
          </div>
          <div className="mt-7 flex items-center gap-2 border-t border-border pt-5 text-xs text-ink-soft"><BookOpen size={14} />Keep this page open while the story is being written.</div>
        </section>
      </div>
    );
  }

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
    onStoryChange={setStory}
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
            <label htmlFor="story-prompt" className="block text-xs font-medium text-ink-soft uppercase tracking-wide">Your Story Idea</label>
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
                set('genre', t.genre);
                setShowTemplates(false);
              }}
            />
          )}

          <textarea
            id="story-prompt"
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

        {generationError && (
          <p role="alert" className="mt-4 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-ink">
            {generationError}
          </p>
        )}
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
