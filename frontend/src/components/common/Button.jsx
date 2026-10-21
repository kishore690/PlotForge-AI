import { motion } from 'framer-motion';
import clsx from 'clsx';

const variants = {
  primary: 'bg-primary text-[#0B0C10] hover:bg-primary-hover shadow-[0_0_0_0_rgba(102,252,241,0)] hover:shadow-[0_8px_24px_-8px_rgba(102,252,241,0.28)]',
  secondary: 'bg-card border border-border text-ink hover:bg-card-hover',
  ghost: 'bg-transparent text-ink-soft hover:text-ink hover:bg-card',
  danger: 'bg-transparent border border-primary/40 text-primary hover:bg-primary/10',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 rounded-xl',
  lg: 'text-base px-6 py-3.5 rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight,
  className,
  disabled,
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.01, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.985, y: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 32, mass: 0.7 }}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-250 disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && !iconRight && <Icon size={16} strokeWidth={2} />}
      {children}
      {Icon && iconRight && <Icon size={16} strokeWidth={2} />}
    </motion.button>
  );
}
