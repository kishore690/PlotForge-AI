import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function AnimatedCounter({ value, duration = 1.2, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  // value can be a number or a string like "128,430" or "128k"
  const numericMatch = typeof value === 'string' ? value.match(/[\d.]+/) : [value];
  const numeric = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const prefix = typeof value === 'string' ? value.slice(0, value.search(/[\d.]/)) : '';
  const trailing = typeof value === 'string' ? value.replace(/^[^\d]*[\d,.]+/, '') : '';

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = numeric / (duration * 60);
    let frame;
    const tick = () => {
      start += step;
      if (start >= numeric) {
        setDisplay(formatNumber(numeric));
        return;
      }
      setDisplay(formatNumber(start));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, numeric, duration]);

  function formatNumber(n) {
    const rounded = Math.round(n);
    return rounded.toLocaleString();
  }

  return (
    <span ref={ref}>
      {prefix}{display}{trailing}{suffix}
    </span>
  );
}
