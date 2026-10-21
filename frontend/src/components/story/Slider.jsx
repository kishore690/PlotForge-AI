export default function Slider({ label, value, onChange, min = 0, max = 100 }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-ink-soft uppercase tracking-wide">{label}</label>
        <span className="text-xs font-semibold text-primary">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-border accent-primary cursor-pointer"
      />
    </div>
  );
}
