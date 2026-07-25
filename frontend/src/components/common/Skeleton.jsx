import clsx from 'clsx';

export default function Skeleton({ className }) {
  return (
    <div className={clsx('animate-pulse bg-card-hover rounded-lg', className)} />
  );
}
