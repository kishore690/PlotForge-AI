import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function ChipGroup({ label, options, value, onChange, multi = false }) {
  const isSelected = (opt) => (multi ? value.includes(opt) : value === opt);

  const toggle = (opt) => {
    if (multi) {
      onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
    } else {
      onChange(opt);
    }
  };

  return (
    <div className="mb-5">
      <label className="block text-xs font-medium text-ink-soft mb-2 uppercase tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = isSelected(opt);
          return (
            <motion.button
              key={opt}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => toggle(opt)}
              className={clsx(
                'relative px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150',
                active
                  ? 'bg-primary/15 border-primary/50 text-primary'
                  : 'bg-card border-border text-ink-soft hover:text-ink hover:border-[#3a3a3a]'
              )}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
