import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Feather, Wand2, BookOpenText, Users2, ArrowRight, Star } from 'lucide-react';
import Button from '../components/common/Button';
import libraryAtmosphere from '../assets/library-atmosphere.jpg';
import AnimatedStoryBackdrop from '../components/common/AnimatedStoryBackdrop';

const features = [
  { icon: Wand2, title: 'Guided Story Builder', desc: 'Tune genre, tone, length, and complexity before a single word is written.' },
  { icon: Users2, title: 'Character & World Builder', desc: 'Cast your own characters and worlds, or let the AI invent them for you.' },
  { icon: BookOpenText, title: 'Kindle-Style Reader', desc: 'Read, continue, and bookmark stories in a distraction-free book layout.' },
];

const steps = [
  { title: 'Describe your idea', desc: 'A sentence is enough — genre, tone, and characters are yours to shape.' },
  { title: 'Tune the details', desc: 'Pick a writing style, audience, and how complex the plot should get.' },
  { title: 'Read & continue', desc: 'Your story opens like a book — save it, export it, or keep writing.' },
];

const testimonials = [
  { name: 'Ariana K.', role: 'Indie novelist', quote: 'It writes like it understands pacing, not just prompts.' },
  { name: 'Devraj S.', role: 'Game narrative designer', quote: 'The world builder alone saved me a week of lore-writing.' },
  { name: 'Marisol T.', role: 'Creative writing teacher', quote: 'My students finish stories now instead of abandoning drafts.' },
];

const faqs = [
  { q: 'Do I need to write anything myself?', a: 'No — one line is enough. You can also fill in as much detail as you want.' },
  { q: 'Can I control tone and audience?', a: 'Yes. Writing style, audience, language, and complexity are all adjustable before generating.' },
  { q: 'Can I keep writing after it generates?', a: 'Every story supports continuation, regeneration, and chapter-by-chapter editing.' },
];

export default function Landing() {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-bg">
      <AnimatedStoryBackdrop />
      <div className="relative z-10">
        <NavBar />
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
}

function NavBar() {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[#45A29E] flex items-center justify-center">
            <Feather size={16} className="text-white" />
          </div>
          <span className="font-serif-display text-lg tracking-tight">PlotForge <span className="text-primary">AI</span></span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-ink-soft">
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
          <a href="#how" className="hover:text-ink transition-colors">How it works</a>
          <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-ink-soft hover:text-ink transition-colors">Log in</Link>
          <Link to="/register"><Button size="sm">Get Started</Button></Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
      <motion.div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary mb-6">
          Generative Storytelling, Reimagined
        </span>
        <h1 className="font-serif-display text-4xl md:text-6xl font-medium leading-[1.1] max-w-3xl mx-auto mb-6">
          Every Story Begins With <span className="ink-underline text-primary">Your Imagination</span>
        </h1>
        <p className="text-ink-soft text-base md:text-lg max-w-xl mx-auto mb-9 leading-relaxed">
          Describe a spark of an idea. PlotForge AI builds the cast, the world, and the prose —
          then hands you a book, not a chat log.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/register"><Button size="lg" icon={ArrowRight} iconRight>Start Creating</Button></Link>
          <a href="#how"><Button size="lg" variant="secondary">Learn More</Button></a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative mt-16 mx-auto max-w-3xl"
      >
        <div className="rounded-2xl border border-border bg-card p-2 shadow-2xl">
          <div
            className="rounded-xl h-72 md:h-96 flex items-center justify-center relative overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(115deg, rgba(10,10,14,.72), rgba(10,10,14,.45) 48%, rgba(10,10,14,.82)), url(${libraryAtmosphere})` }}
          >
            <motion.div
              className="absolute w-40 h-40 rounded-full bg-primary/20 blur-3xl"
              animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
              transition={{ repeat: Infinity, duration: 8 }}
            />
            <div className="relative z-10 text-center">
              <Feather size={42} className="text-primary mx-auto mb-4 drop-shadow-lg" strokeWidth={1.2} />
              <p className="font-serif-display text-2xl text-white drop-shadow-md">A world begins with a word.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 hover:bg-card-hover transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <f.icon size={20} className="text-primary" strokeWidth={1.75} />
            </div>
            <h3 className="font-semibold text-ink mb-2">{f.title}</h3>
            <p className="text-sm text-ink-soft leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="font-serif-display text-3xl text-center mb-14">How it works</h2>
      <div className="grid md:grid-cols-3 gap-8 relative">
        <div className="hidden md:block absolute top-6 left-[16.5%] right-[16.5%] h-px bg-border" />
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="relative text-center"
          >
            <div className="w-12 h-12 rounded-full bg-card border border-primary/40 text-primary font-serif-display text-lg flex items-center justify-center mx-auto mb-4 relative z-10">
              {i + 1}
            </div>
            <h3 className="font-semibold text-ink mb-2">{s.title}</h3>
            <p className="text-sm text-ink-soft leading-relaxed max-w-xs mx-auto">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="font-serif-display text-3xl text-center mb-14">Loved by writers everywhere</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={13} className="text-warning fill-warning" />)}
            </div>
            <p className="text-sm text-ink-soft italic leading-relaxed mb-4">"{t.quote}"</p>
            <p className="text-sm font-medium text-ink">{t.name}</p>
            <p className="text-xs text-ink-soft">{t.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
      <h2 className="font-serif-display text-3xl text-center mb-12">Frequently asked</h2>
      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="bg-card border border-border rounded-xl p-5 group">
            <summary className="cursor-pointer text-sm font-medium text-ink list-none flex items-center justify-between">
              {f.q}
              <span className="text-ink-soft group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-sm text-ink-soft mt-3 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Feather size={16} className="text-primary" />
          <span className="font-serif-display text-sm">PlotForge AI</span>
        </div>
        <p className="text-xs text-ink-soft">© 2026 PlotForge AI. Every story begins with your imagination.</p>
      </div>
    </footer>
  );
}
