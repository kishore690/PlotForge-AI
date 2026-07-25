import { motion } from 'framer-motion';
import {
  Swords, Ghost, Rocket, Search as SearchIcon, HeartHandshake,
  Landmark, Sparkles, Cpu, Cog, Orbit,
} from 'lucide-react';

const templates = [
  { label: 'Fantasy Adventure', icon: Swords, prompt: 'A reluctant hero sets out to reclaim a stolen crown from a forest that eats travelers whole.' },
  { label: 'Horror', icon: Ghost, prompt: 'A lighthouse keeper starts receiving radio messages from a shipwreck that sank a century ago.' },
  { label: 'Sci-Fi', icon: Rocket, prompt: 'The last human colony ship must choose between waking its founders or continuing the journey alone.' },
  { label: 'Mystery', icon: SearchIcon, prompt: 'A detective is hired to solve a murder that, according to every witness, happened to her.' },
  { label: 'Romance', icon: HeartHandshake, prompt: 'Two rival chefs are forced to co-host a cooking show neither of them wanted to do.' },
  { label: 'Historical', icon: Landmark, prompt: 'A young scribe in an ancient court discovers a forbidden manuscript hidden beneath the library.' },
  { label: 'Mythology', icon: Sparkles, prompt: 'The last mortal blacksmith is summoned by a dying god to forge one final weapon.' },
  { label: 'Cyberpunk', icon: Cpu, prompt: 'A hacker who erases memories for a living finds one she cannot bring herself to delete.' },
  { label: 'Steampunk', icon: Cog, prompt: 'An airship engineer discovers her city\'s floating engine is powered by something alive.' },
  { label: 'Space Exploration', icon: Orbit, prompt: 'A solo astronaut mapping a new moon picks up a signal that shouldn\'t exist.' },
];

export default function StoryTemplates({ onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
      {templates.map((t, i) => (
        <motion.button
          key={t.label}
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onSelect(t)}
          className="flex flex-col items-center gap-2 bg-card border border-border rounded-xl py-4 px-2 hover:bg-card-hover hover:border-primary/40 transition-colors text-center"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <t.icon size={15} className="text-primary" />
          </div>
          <span className="text-[11px] font-medium text-ink-soft leading-tight">{t.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
