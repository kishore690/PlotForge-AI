import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Card({ children, className, hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={clsx(
        'bg-card border border-border rounded-2xl transition-colors duration-200',
        hover && 'hover:bg-card-hover hover:border-[#3a3a3a]',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
