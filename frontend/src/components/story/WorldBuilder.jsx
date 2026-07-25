import { motion } from 'framer-motion';
import { Globe2, Wand2 } from 'lucide-react';

const fields = [
  { key: 'worldName', label: 'World Name' },
  { key: 'kingdom', label: 'Kingdom / Country / Planet' },
  { key: 'city', label: 'City' },
  { key: 'timePeriod', label: 'Time Period' },
  { key: 'techLevel', label: 'Technology Level' },
  { key: 'magicSystem', label: 'Magic System' },
  { key: 'climate', label: 'Climate' },
  { key: 'villain', label: 'Main Villain' },
  { key: 'heroGoal', label: 'Hero Goal' },
  { key: 'endingType', label: 'Ending Type' },
  { key: 'theme', label: 'Theme' },
];

export default function WorldBuilder({ world, setWorld, auto, setAuto }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-xs font-medium text-ink-soft uppercase tracking-wide">
          <Globe2 size={14} /> World Builder <span className="text-ink-soft/60 normal-case">(optional)</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-ink-soft cursor-pointer select-none">
          <Wand2 size={13} className="text-primary" />
          Generate AI World Automatically
          <span
            onClick={() => setAuto(!auto)}
            className={`relative inline-block w-9 h-5 rounded-full transition-colors ${auto ? 'bg-primary' : 'bg-border'}`}
          >
            <motion.span
              layout
              className="absolute top-0.5 w-4 h-4 bg-white rounded-full"
              animate={{ left: auto ? 18 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </span>
        </label>
      </div>

      {!auto && (
        <div className="grid grid-cols-2 gap-2.5">
          {fields.map((f) => (
            <input
              key={f.key}
              placeholder={f.label}
              value={world[f.key] || ''}
              onChange={(e) => setWorld({ ...world, [f.key]: e.target.value })}
              className="bg-card border border-border rounded-lg px-3 py-2.5 text-xs text-ink placeholder:text-ink-soft focus:outline-none focus:border-primary/50"
            />
          ))}
        </div>
      )}
    </div>
  );
}
