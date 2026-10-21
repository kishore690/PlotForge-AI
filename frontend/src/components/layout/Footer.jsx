import { Feather } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-soft">
      <div className="flex items-center gap-1.5">
        <Feather size={12} className="text-primary" />
        <span>PlotForge</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Made for curious storytellers</span>
        <span>v1.0.0</span>
      </div>
    </footer>
  );
}
