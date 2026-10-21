import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function StoryTimeline({ chapters, current }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 px-1">
      {chapters.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-2 shrink-0">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: done ? 'var(--color-primary)' : active ? 'color-mix(in srgb, var(--color-primary) 15%, transparent)' : 'var(--color-card)',
                borderColor: done || active ? 'var(--color-primary)' : 'var(--color-border)',
              }}
              className="w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-semibold text-white"
            >
              {done ? <Check size={12} /> : <span className={active ? 'text-primary' : 'text-ink-soft'}>{i + 1}</span>}
            </motion.div>
            <span className={`text-xs whitespace-nowrap ${active ? 'text-ink font-medium' : 'text-ink-soft'}`}>{label}</span>
            {i < chapters.length - 1 && <span className="w-6 h-px bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
