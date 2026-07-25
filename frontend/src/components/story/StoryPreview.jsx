import { motion } from 'framer-motion';
import { Clock, Users, Globe2, Sparkles } from 'lucide-react';

export default function StoryPreview({ form }) {
  const estMinutes = { Short: 5, Medium: 12, Long: 25 }[form.length] || 8;

  return (
    <motion.div
      layout
      className="bg-card border border-border rounded-2xl p-5 sticky top-20"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={15} className="text-primary" />
        <h3 className="text-sm font-semibold text-ink">Live Preview</h3>
      </div>

      <div
        className="h-28 rounded-xl mb-4 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#2a0d0d,#0a0505)' }}
      >
        <span className="text-xs text-ink-soft italic">Cover art generates with your story</span>
      </div>

      <dl className="space-y-3 text-xs">
        <Row label="Genre" value={form.genre || '—'} />
        <Row label="Writing Style" value={form.style || '—'} />
        <Row label="Audience" value={form.audience || '—'} />
        <Row label="Language" value={form.language} />
        <Row label="Complexity" value={form.complexity} />
        <Row
          label="Characters"
          value={form.autoCharacters ? 'AI-generated' : `${form.characterCount} custom`}
          icon={Users}
        />
        <Row
          label="World"
          value={form.autoWorld ? 'AI-generated' : (form.worldName || 'Not set')}
          icon={Globe2}
        />
        <Row label="Est. Reading Time" value={`${estMinutes} min`} icon={Clock} />
        <Row label="Est. Chapters" value={{ Short: 3, Medium: 6, Long: 10 }[form.length] || 5} />
        <Row label="Difficulty" value={form.complexity} />
        <Row label="Mood" value={form.style} />
      </dl>
    </motion.div>
  );
}

function Row({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
      <span className="text-ink-soft flex items-center gap-1.5">
        {Icon && <Icon size={12} />} {label}
      </span>
      <span className="text-ink font-medium truncate max-w-[140px]">{value}</span>
    </div>
  );
}
