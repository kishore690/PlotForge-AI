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
                backgroundColor: done ? '#DC2626' : active ? 'rgba(220,38,38,0.15)' : '#181818',
                borderColor: done || active ? '#DC2626' : '#2A2A2A',
              }}
              className="w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-semibold text-white"
            >
              {done ? <Check size={12} /> : <span className={active ? 'text-red-400' : 'text-ink-soft'}>{i + 1}</span>}
            </motion.div>
            <span className={`text-xs whitespace-nowrap ${active ? 'text-ink font-medium' : 'text-ink-soft'}`}>{label}</span>
            {i < chapters.length - 1 && <span className="w-6 h-px bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
