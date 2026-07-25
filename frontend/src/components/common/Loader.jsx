import { motion } from 'framer-motion';
import { Feather } from 'lucide-react';

export default function Loader({ label = 'PlotForge is crafting your story…', full = false }) {
  return (
    <div className={full ? 'fixed inset-0 z-50 flex items-center justify-center bg-bg' : 'flex flex-col items-center justify-center py-16'}>
      <div className="relative w-20 h-20 flex items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-primary/20"
        />
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-t-primary border-r-primary/60 border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        />
        <motion.span
          className="absolute inset-2 rounded-full bg-primary/50 blur-lg"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.05, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        />
        <motion.div
          className="relative z-10 w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-red-900 flex items-center justify-center"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <Feather size={16} className="text-white" strokeWidth={2} />
        </motion.div>
      </div>
      <motion.p
        className="mt-5 text-sm text-ink-soft tracking-wide"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        {label}
      </motion.p>
    </div>
  );
}
