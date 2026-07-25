import { motion } from 'framer-motion';
import Button from './Button';

export default function EmptyState({ icon: Icon, title, subtitle, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-24 px-6"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full" />
        <div className="relative w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center">
          {Icon && <Icon size={32} className="text-primary" strokeWidth={1.5} />}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-ink mb-1.5">{title}</h3>
      <p className="text-sm text-ink-soft max-w-sm mb-6">{subtitle}</p>
      {actionLabel && (
        <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
      )}
    </motion.div>
  );
}
