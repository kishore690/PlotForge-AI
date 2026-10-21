import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Save, X, Bookmark, Heart, Download, Sparkles } from "lucide-react";
import { getStory, updateStory } from "../services/libraryService";
import { generateStory } from "../services/storyService";
import { openStoryPdf } from "../services/storyPdfService";
import ReadAloudControls from "../components/story/ReadAloudControls";

export default function ReadStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ title: "", prompt: "", genre: "" });

  useEffect(() => {
    let active = true;
    getStory(id).then((data) => {
      if (!active) return;
      setStory(data);
      setForm({ title: data.title || "", prompt: data.prompt || "", genre: data.genre || "" });
    }).catch((err) => {
      if (active) setError(err.message || "Could not load this story.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await updateStory(id, form);
      setStory(updated);
      setEditing(false);
    } catch (err) { setError(err.message || "Could not save changes."); }
    finally { setSaving(false); }
  };

  const toggle = async (field) => {
    try {
      const updated = await updateStory(id, { [field]: !story[field] });
      setStory(updated);
    } catch (err) { setError(err.message || "Could not update this story."); }
  };

  const createStory = async () => {
    setGenerating(true);
    setError("");
    try {
      const updated = await generateStory(id);
      setStory(updated);
    } catch (err) { setError(err.message || "Could not generate this story."); }
    finally { setGenerating(false); }
  };

  const downloadPdf = async () => {
    try {
      await openStoryPdf({ title: story.title, genre: story.genre, generatedStory: story.generatedStory });
    } catch (err) { setError(err.message || "Could not create the PDF."); }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-ink-soft">Loading story...</div>;
  if (!story) return <div className="max-w-4xl mx-auto py-10 px-6 text-ink"><button onClick={() => navigate(-1)} className="mb-6 text-ink-soft">← Back</button><p>{error || "Story not found."}</p></div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-ink-soft hover:text-ink"><ArrowLeft size={18} />Back</button>
        <div className="flex items-center gap-2">
          {!!story.generatedStory && <button onClick={downloadPdf} title="Open themed PDF" aria-label="Open themed PDF" className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-ink-soft hover:text-ink"><Download size={16} /><span className="hidden sm:inline">PDF</span></button>}
          <button onClick={() => toggle("saved")} title={story.saved ? "Remove from saved stories" : "Save story"} aria-label={story.saved ? "Remove from saved stories" : "Save story"} aria-pressed={Boolean(story.saved)} className={`rounded-lg border border-border p-2 ${story.saved ? "text-amber-300" : "text-ink-soft hover:text-ink"}`}><Bookmark size={17} fill={story.saved ? "currentColor" : "none"} /></button>
          <button onClick={() => toggle("favorite")} title={story.favorite ? "Remove from favorites" : "Add to favorites"} aria-label={story.favorite ? "Remove from favorites" : "Add to favorites"} aria-pressed={Boolean(story.favorite)} className={`rounded-lg border border-border p-2 ${story.favorite ? "text-primary" : "text-ink-soft hover:text-ink"}`}><Heart size={17} fill={story.favorite ? "currentColor" : "none"} /></button>
          <button onClick={() => { setEditing((value) => !value); setError(""); }} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-ink-soft hover:text-ink">{editing ? <X size={16} /> : <Pencil size={16} />}{editing ? "Cancel" : "Edit details"}</button>
        </div>
      </div>
      {error && <p role="alert" className="mb-4 text-sm text-red-400">{error}</p>}
      {editing ? (
        <form onSubmit={save} className="space-y-4 mb-8 rounded-2xl border border-border bg-card p-6">
          {[["title", "Title"], ["genre", "Genre"]].map(([key, label]) => <label key={key} className="block text-sm text-ink-soft">{label}<input required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-bg p-3 text-ink" /></label>)}
          <label className="block text-sm text-ink-soft">Prompt<textarea required rows={5} value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-bg p-3 text-ink" /></label>
          <button disabled={saving} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-60"><Save size={16} />{saving ? "Saving..." : "Save changes"}</button>
        </form>
      ) : <>
        <h1 className="font-serif-display text-4xl text-ink mb-3">{story.title}</h1>
        <div className="flex gap-3 mb-8"><span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-sm">{story.genre}</span><span className="text-ink-soft">{story.createdAt ? new Date(story.createdAt).toLocaleDateString() : ""}</span></div>
        {story.generatedStory ? <><ReadAloudControls text={story.generatedStory} language={story.language} /><div className="mt-6 leading-8 text-lg whitespace-pre-wrap text-ink-soft">{story.generatedStory}</div></> : <div className="rounded-2xl border border-border bg-card p-6"><p className="text-ink-soft mb-4">This story is still a draft. Generate it to read the finished story here.</p><button onClick={createStory} disabled={generating} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-60"><Sparkles size={16} />{generating ? "Generating story…" : "Generate story"}</button></div>}
      </>}
    </div>
  );
}
