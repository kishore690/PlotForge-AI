import { motion } from 'framer-motion';
import clsx from 'clsx';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover shadow-[0_0_0_0_rgba(220,38,38,0)] hover:shadow-[0_8px_24px_-8px_rgba(220,38,38,0.6)]',
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
      whileHover={disabled ? {} : { scale: 1.015 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed',
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
