import clsx from 'clsx';

const tones = {
  primary: 'bg-primary/15 text-primary border-primary/30',
  neutral: 'bg-white/5 text-ink-soft border-border',
  success: 'bg-success/15 text-success border-success/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
};

export default function Badge({ children, tone = 'neutral', className }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border',
      tones[tone],
      className
    )}>
      {children}
    </span>
  );
}
