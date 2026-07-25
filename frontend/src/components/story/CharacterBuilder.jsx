import { motion, AnimatePresence } from 'framer-motion';
import { Users, Wand2 } from 'lucide-react';

const fields = ['Name', 'Age', 'Gender', 'Role', 'Occupation', 'Appearance', 'Personality', 'Background', 'Strength', 'Weakness', 'Abilities', 'Relationship', 'Mood', 'Power Level'];

export default function CharacterBuilder({ count, setCount, auto, setAuto, characters, updateCharacter }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-xs font-medium text-ink-soft uppercase tracking-wide">
          <Users size={14} /> Character Builder
        </label>
        <label className="flex items-center gap-2 text-xs text-ink-soft cursor-pointer select-none">
          <Wand2 size={13} className="text-primary" />
          Generate AI Characters Automatically
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
        <>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`w-9 h-9 rounded-lg text-xs font-semibold border transition-colors ${
                  count === n ? 'bg-primary/15 border-primary/50 text-red-400' : 'bg-card border-border text-ink-soft hover:text-ink'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <AnimatePresence mode="popLayout">
            <div className="grid gap-3">
              {Array.from({ length: count }).map((_, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card border border-border rounded-xl p-4 overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-red-900 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                      {(characters?.[i]?.Name || `C${i + 1}`).slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-xs font-semibold text-ink">Character {i + 1}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {fields.map((f) => (
                      <input
                        key={f}
                        placeholder={f}
                        value={characters?.[i]?.[f] || ''}
                        onChange={(e) => updateCharacter(i, f, e.target.value)}
                        className="bg-bg border border-border rounded-lg px-3 py-2 text-xs text-ink placeholder:text-ink-soft focus:outline-none focus:border-primary/50"
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
