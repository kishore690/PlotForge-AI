import { motion, useReducedMotion } from 'framer-motion';

const storyPath = 'M-100 720 C 130 645, 205 420, 400 475 S 665 695, 810 530 S 1000 210, 1170 300 S 1370 420, 1540 160';
const storyNodes = [[400, 475], [810, 530], [1170, 300]];

export default function AnimatedStoryBackdrop() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(102,252,241,.045),transparent_52%),linear-gradient(145deg,#0B0C10,#1F2833_52%,#0B0C10)]" />
      <motion.div
        className="absolute -left-40 top-[8%] h-[30rem] w-[30rem] rounded-full blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(102,252,241,.12), rgba(102,252,241,0) 70%)' }}
        animate={reduceMotion ? undefined : { x: [0, 100, 15, 0], y: [0, 50, 125, 0], scale: [1, 1.12, 0.94, 1] }}
        transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-52 bottom-[-14rem] h-[38rem] w-[38rem] rounded-full blur-[125px]"
        style={{ background: 'radial-gradient(circle, rgba(69,162,158,.12), rgba(69,162,158,0) 68%)' }}
        animate={reduceMotion ? undefined : { x: [0, -80, -20, 0], y: [0, -80, -120, 0], scale: [1, 0.92, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 29, ease: 'easeInOut' }}
      />
      <svg className="absolute inset-0 h-full w-full text-primary/30" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
        <motion.path
          d={storyPath}
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="3 12"
          animate={reduceMotion ? undefined : { pathLength: [0.45, 0.82, 0.45], opacity: [0.2, 0.48, 0.2] }}
          transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
        />
        {storyNodes.map(([cx, cy], index) => <motion.g
          key={`${cx}-${cy}`}
          animate={reduceMotion ? undefined : { opacity: [0.22, 0.7, 0.22], scale: [0.82, 1.18, 0.82] }}
          transition={{ repeat: Infinity, duration: 5 + index * 1.5, delay: index * 0.7, ease: 'easeInOut' }}
        >
          <circle cx={cx} cy={cy} r="14" fill="rgba(102,252,241,.07)" />
          <circle cx={cx} cy={cy} r="2.3" fill="currentColor" />
        </motion.g>)}
      </svg>
      {!reduceMotion && <>
        <motion.span className="absolute left-[17%] top-[23%] text-lg text-primary/40" animate={{ y: [0, -12, 0], rotate: [0, 20, 0], opacity: [0.2, 0.55, 0.2] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}>✦</motion.span>
        <motion.span className="absolute right-[19%] top-[28%] text-lg text-[#45A29E]/55" animate={{ y: [0, 14, 0], rotate: [0, -25, 0], opacity: [0.12, 0.45, 0.12] }} transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}>✧</motion.span>
      </>}
    </div>
  );
}
