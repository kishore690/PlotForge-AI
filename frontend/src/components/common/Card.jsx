import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Card({ children, className, hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, transition: { type: 'spring', stiffness: 360, damping: 32 } } : {}}
      className={clsx(
        'bg-card border border-border rounded-2xl transition-colors duration-300',
        hover && 'hover:bg-card-hover hover:border-primary/40',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
