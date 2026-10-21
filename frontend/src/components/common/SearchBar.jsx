import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search stories…', className = '', onKeyDown }) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{ scale: focused ? 1.015 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${focused ? 'text-primary' : 'text-ink-soft'}`} />
      <input
        type="search"
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={`w-full bg-card border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:outline-none transition-all duration-200 ${
          focused ? 'border-primary/60 shadow-[0_0_0_4px_rgba(102,252,241,0.12)]' : 'border-border'
        }`}
      />
    </motion.div>
  );
}
