import { useState } from 'react';
import { Palette, Globe, Bell, Wand2, Shield, UserCog } from 'lucide-react';

const sections = [
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'language', label: 'Language', icon: Globe },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'defaults', label: 'Story Defaults', icon: Wand2 },
  { key: 'privacy', label: 'Privacy', icon: Shield },
  { key: 'account', label: 'Account', icon: UserCog },
];

export default function Settings() {
  const [active, setActive] = useState('appearance');

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
      <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors ${
              active === s.key ? 'bg-card text-ink border border-border' : 'text-ink-soft hover:text-ink'
            }`}
          >
            <s.icon size={16} className={active === s.key ? 'text-primary' : ''} /> {s.label}
          </button>
        ))}
      </nav>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-ink mb-1 capitalize">{active}</h3>
        <p className="text-xs text-ink-soft mb-6">Manage your {active} preferences.</p>

        {active === 'appearance' && (
          <div className="flex gap-3">
            {['Dark', 'Midnight', 'Crimson'].map((t) => (
              <div key={t} className="w-24 h-16 rounded-xl border border-border bg-bg flex items-end justify-center pb-2 text-xs text-ink-soft cursor-pointer hover:border-primary/50">{t}</div>
            ))}
          </div>
        )}

        {active !== 'appearance' && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <span className="text-sm text-ink-soft">Option {i}</span>
                <span className="w-9 h-5 rounded-full bg-primary/60 relative">
                  <span className="absolute top-0.5 left-[18px] w-4 h-4 bg-white rounded-full" />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
