import { useState, useEffect, useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';
import {
  Stethoscope,
  Award,
  GraduationCap,
  Heart,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  Menu,
  X,
  Droplets,
  Activity,
  ShieldCheck,
  Wind,
  ArrowUp,
  Mail,
  User,
  Building2,
  BookOpen,
  Quote,
  CheckCircle,
  BadgeCheck,
  Layers,
  Star,
} from 'lucide-react';
import sujithPortrait from './images/sujith.jpg';

/* ════════════════════════════════════════════
   Scroll-reveal hook
   ════════════════════════════════════════════ */
function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, className = '', delay = 0, direction = 'up' }: {
  children: ReactNode; className?: string; delay?: number; direction?: 'up' | 'left' | 'right' | 'scale';
}) {
  const { ref, visible } = useReveal();
  const dirClass = {
    up: 'anim-fade-up',
    left: 'anim-slide-left',
    right: 'anim-slide-right',
    scale: 'anim-scale-in',
  }[direction];
  return (
    <div
      ref={ref}
      className={`${visible ? dirClass : 'opacity-0'} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

/* ── Scroll progress bar ── */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setPct(Math.min(1, Math.max(0, scrolled)));
    };
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    window.addEventListener('resize', fn);
    return () => { window.removeEventListener('scroll', fn); window.removeEventListener('resize', fn); };
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-primary-500 via-accent-300 to-primary-500 origin-left transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${pct})` }}
      />
    </div>
  );
}

/* ── Count-up number that animates when scrolled into view ── */
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const { ref, visible } = useReveal<HTMLSpanElement>(0.4);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/* ── Decorative gold rule with center node ── */
function GoldRule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="w-10 gold-rule" />
      <div className="gold-node w-1.5 h-1.5 rotate-45 bg-accent-400" />
      <div className="w-10 gold-rule" />
    </div>
  );
}

/* ════════════════════════════════════════════
   Section heading
   ════════════════════════════════════════════ */
function SectionHeading({ tag, title, subtitle, light = false }: { tag: string; title: string; subtitle?: string; light?: boolean }) {
  return (
    <Reveal className="text-center mb-16 md:mb-20">
      <span className="eyebrow gold-shine">
        <span className="w-6 h-px bg-accent-400/60" />
        {tag}
        <span className="w-6 h-px bg-accent-400/60" />
      </span>
      <h2 className={`mt-5 font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-semibold leading-[1.08] tracking-tightest ${light ? 'text-white' : 'text-ink-900'}`}>
        {title}
      </h2>
      <GoldRule className="mt-6" />
      {subtitle && <p className={`mt-7 text-lg max-w-2xl mx-auto leading-relaxed ${light ? 'text-white/60' : 'text-ink-500'}`}>{subtitle}</p>}
    </Reveal>
  );
}

/* ════════════════════════════════════════════
   Monogram crest
   ════════════════════════════════════════════ */
function Monogram({ scrolled }: { scrolled?: boolean }) {
  return (
    <span
      className={`relative w-10 h-10 rounded-xl flex items-center justify-center font-heading text-lg font-semibold transition-all duration-500 ${
        scrolled
          ? 'bg-gradient-to-br from-primary-800 to-primary-950 text-accent-200 shadow-glow-sm'
          : 'bg-white/10 backdrop-blur-md border border-white/20 text-white'
      }`}
    >
      <span className="absolute inset-1 rounded-lg border border-accent-300/30" />
      S
    </span>
  );
}

/* ════════════════════════════════════════════
   Navbar
   ════════════════════════════════════════════ */
const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('');
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Scrollspy — highlight the section currently in view
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const links = navLinks;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-ink-50/65 backdrop-blur-xl shadow-glass border-b border-ink-200/50' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group">
          <Monogram scrolled={scrolled} />
          <span className="flex flex-col leading-none">
            <span className={`font-heading text-lg font-semibold transition-colors duration-500 ${scrolled ? 'text-ink-900' : 'text-white'}`}>
              Dr. Sujith M S
            </span>
            <span className={`text-[10px] font-semibold tracking-[0.2em] uppercase mt-1 transition-colors duration-500 ${scrolled ? 'text-accent-600' : 'text-accent-300/80'}`}>
              Physician · Diabetologist
            </span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={`link-underline px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                  scrolled
                    ? isActive ? 'text-primary-700' : 'text-ink-600 hover:text-primary-700'
                    : isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {l.label}
              </a>
            );
          })}
          <a
            href="#contact"
            className="btn-shine ml-4 px-6 py-2.5 bg-primary-700 text-white text-sm font-semibold rounded-xl ring-1 ring-inset ring-accent-300/30 hover:bg-primary-800 hover:shadow-glow-sm transition-all duration-300"
          >
            Get in Touch
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          className={`md:hidden p-2 rounded-xl transition-colors duration-300 ${scrolled ? 'text-ink-700 hover:bg-ink-100' : 'text-white hover:bg-white/10'}`}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-ink-50/95 backdrop-blur-2xl border-t border-ink-200 px-6 py-4 space-y-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-ink-700 hover:text-primary-700 hover:bg-primary-50 rounded-xl font-medium transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="block mt-2 px-4 py-3 bg-primary-700 text-white text-center rounded-xl font-semibold"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ════════════════════════════════════════════
   Hero
   ════════════════════════════════════════════ */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const spotRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setLoaded(true); }, []);

  const onMove = (e: ReactMouseEvent<HTMLElement>) => {
    const el = spotRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const credentials = ['MBBS', 'DNB (Internal Medicine)', 'PGDCED'];

  return (
    <section id="hero" onMouseMove={onMove} className="grain relative min-h-screen flex flex-col overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-ink-950" />
      <div className="aurora absolute inset-0 opacity-[0.09]">
        <span className="top-[12%] -left-24 w-[520px] h-[520px] bg-primary-400 animate-float-slow" />
        <span className="bottom-[8%] -right-24 w-[620px] h-[620px] bg-primary-300 animate-float-slow" style={{ animationDelay: '3s' }} />
        <span className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] bg-accent-400 anim-pulse-soft" />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
      {/* Cursor spotlight */}
      <div ref={spotRef} className="spotlight hidden lg:block" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(6,42,38,0.55)_100%)]" />

      <div className="relative z-10 flex-1 flex items-center w-full">
        <div className="max-w-6xl mx-auto px-6 py-28 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="space-y-7">
            <div className={`transition-all duration-700 ${loaded ? 'anim-fade-up' : 'opacity-0'}`}>
              <span className="inline-flex items-center gap-2.5 px-5 py-2 glass-dark rounded-full text-accent-200 text-xs font-semibold tracking-[0.18em] uppercase">
                <ShieldCheck className="w-4 h-4 text-accent-300" />
                KMC Reg. No. 105870
              </span>
            </div>

            <div className={`transition-all duration-700 ${loaded ? 'anim-fade-up delay-1' : 'opacity-0'}`}>
              <p className="gold-shine font-heading italic text-xl mb-3">Compassionate medicine, delivered with precision.</p>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-[4.7rem] font-semibold text-white leading-[1.02] tracking-tightest">
                Dr. Sujith{' '}
                <span className="gradient-text">M S</span>
              </h1>
            </div>

            <div className={`transition-all duration-700 ${loaded ? 'anim-fade-up delay-2' : 'opacity-0'}`}>
              <p className="text-2xl md:text-[1.7rem] text-white/80 font-light font-heading">
                Consultant Physician &amp; Diabetologist
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {credentials.map((c) => (
                  <span key={c} className="px-3 py-1 rounded-full border border-white/15 text-white/70 text-xs font-medium tracking-wide">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className={`transition-all duration-700 ${loaded ? 'anim-fade-up delay-3' : 'opacity-0'}`}>
              <p className="text-white/60 text-lg leading-relaxed max-w-xl">
                Known for his patience, diagnostic excellence, and empathetic approach — building trust and comfort through compassionate communication.
              </p>
            </div>

            <div className={`transition-all duration-700 ${loaded ? 'anim-fade-up delay-4' : 'opacity-0'}`}>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#contact"
                  className="btn-shine group px-8 py-4 bg-white text-primary-900 rounded-2xl font-semibold ring-1 ring-accent-300/30 hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get in Touch
                  <span className="inline-block ml-1.5 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </a>
                <a
                  href="#about"
                  className="px-8 py-4 border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/10 hover:border-accent-300/40 transition-all duration-300"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>

          {/* Right: Visual element */}
          <div className={`flex justify-center order-first lg:order-none mb-2 lg:mb-0 transition-all duration-700 ${loaded ? 'anim-scale-in delay-3' : 'opacity-0'}`}>
            <div className="relative anim-float">
              {/* Decorative gold frame offset */}
              <div className="absolute -inset-3 rounded-[2.4rem] border border-accent-300/30 anim-pulse-soft" />
              <div className="absolute -inset-3 rounded-[2.4rem] bg-gradient-to-br from-accent-300/10 via-transparent to-primary-400/10 blur-sm" />

              {/* Portrait card */}
              <div className="relative w-[16rem] h-[20rem] sm:w-[20rem] sm:h-[24rem] lg:w-[22rem] lg:h-[26rem] rounded-[2.2rem] p-1.5 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md overflow-hidden shadow-lift">
                <img
                  src={sujithPortrait}
                  alt="Dr. Sujith M S, Consultant Physician and Diabetologist"
                  className="w-full h-full object-cover object-top rounded-[1.8rem]"
                  loading="eager"
                />
                {/* Bottom gradient for legibility */}
                <div className="absolute inset-x-1.5 bottom-1.5 h-32 rounded-b-[1.8rem] bg-gradient-to-t from-primary-950/80 via-primary-950/20 to-transparent" />
                {/* Name plate */}
                <div className="absolute bottom-5 left-6 right-6">
                  <p className="font-heading text-xl sm:text-2xl font-semibold text-white leading-tight">Dr. Sujith M S</p>
                  <p className="text-accent-200/90 text-xs sm:text-sm font-medium tracking-wide">Consultant Physician &amp; Diabetologist</p>
                </div>
              </div>
              {/* Floating badges — hidden on the narrowest screens to avoid clipping */}
              <div className="hidden sm:block absolute -bottom-5 -right-5 px-6 py-3.5 glass rounded-2xl shadow-glass-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary-700" />
                  </div>
                  <span className="text-sm font-semibold text-ink-800">Verified Practitioner</span>
                </div>
              </div>
              <div className="hidden sm:block absolute -top-5 -left-5 px-6 py-3.5 glass rounded-2xl shadow-glass-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-accent-600 fill-accent-400" />
                  </div>
                  <span className="text-sm font-semibold text-ink-800">Patient-First Care</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Bottom credential strip */}
      <div className={`relative z-10 border-t border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-y-3 text-center">
          {[
            { k: 'Specialty', v: 'Internal Medicine' },
            { k: 'Focus', v: 'Diabetes & Hypertension' },
            { k: 'Practice', v: 'Multiple Clinics, Bangalore' },
            { k: 'Approach', v: 'Evidence-Based Care' },
          ].map((s, i) => (
            <div key={s.k} className={`px-3 ${i < 3 ? 'md:border-r md:border-white/10' : ''}`}>
              <p className={`flow-text flow-${i + 1} text-[10px] font-semibold tracking-[0.2em] uppercase`}>{s.k}</p>
              <p className="mt-1 text-sm text-white/80 font-medium">{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#about" className="absolute bottom-32 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors duration-300">
        <span className="text-[10px] tracking-[0.25em] uppercase font-medium">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </a>
    </section>
  );
}

/* ════════════════════════════════════════════
   Stats / trust band
   ════════════════════════════════════════════ */
const stats = [
  { icon: GraduationCap, value: 3, suffix: '', label: 'Qualifications', sub: 'MBBS · DNB · PGDCED' },
  { icon: Layers, value: 4, suffix: '', label: 'Areas of Expertise', sub: 'Specialised care' },
  { icon: Building2, value: 3, suffix: '', label: 'Practice Locations', sub: 'Across Bangalore' },
  { icon: BadgeCheck, value: null as number | null, suffix: '', label: 'KMC Verified', sub: 'Reg. No. 105870' },
];

function Stats() {
  return (
    <section className="relative bg-ink-50 pt-16 md:pt-20 pb-4">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative bg-white rounded-3xl border border-ink-100 shadow-glass-lg overflow-hidden">
          <div className="absolute top-0 left-12 right-12 h-px gold-line" />
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-x divide-ink-100/80 [&>*]:border-ink-100/80">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1} direction="up">
                <div className="group flex flex-col items-center text-center px-6 py-9 hover:bg-ink-50/60 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-950 flex items-center justify-center mb-4 shadow-glow-sm group-hover:scale-105 transition-transform duration-300">
                    <s.icon className="w-6 h-6 text-accent-100" />
                  </div>
                  <p className="font-heading text-4xl md:text-5xl font-semibold text-ink-900 leading-none tracking-tightest">
                    {s.value === null
                      ? <CheckCircle className="w-9 h-9 text-primary-600 inline-block" />
                      : <CountUp to={s.value} suffix={s.suffix} />}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-ink-800">{s.label}</p>
                  <p className="mt-1 text-xs text-ink-400">{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   About
   ════════════════════════════════════════════ */
const aboutHighlights = [
  { icon: User, label: 'Consultant Physician', detail: 'Expert Care' },
  { icon: Droplets, label: 'Diabetologist', detail: 'Specialized' },
  { icon: Heart, label: 'Patient-Centric', detail: 'Compassionate' },
  { icon: Award, label: 'DNB Internal Medicine', detail: 'Qualified' },
];

function About() {
  return (
    <section id="about" className="section-padding bg-ink-50 relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeading tag="About" title="Meet Dr. Sujith" />

        <div className="grid lg:grid-cols-5 gap-14 items-start">
          {/* Bio */}
          <div className="lg:col-span-3 space-y-6">
            <Reveal direction="left">
              <div className="flex gap-4">
                <Quote className="w-9 h-9 text-accent-300 shrink-0 -mt-1" />
                <p className="text-xl text-ink-700 leading-[1.7] font-heading italic">
                  Going beyond conventional treatment — building trust and comfort through compassionate communication.
                </p>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.05}>
              <p className="text-lg text-ink-600 leading-[1.85]">
                Dr. Sujith M S is a highly respected Consultant Physician &amp; Diabetologist with qualifications in MBBS, DNB (Internal Medicine), and PGDCED. He completed his MBBS from Shimoga Institute of Medical Science and Research Centre and pursued his DNB in Internal Medicine.
              </p>
            </Reveal>
            <Reveal direction="left" delay={0.1}>
              <p className="text-lg text-ink-600 leading-[1.85]">
                Currently, he consults across multiple trusted clinics and hospitals in Bangalore — including Narayana Health, Clinique HealthTree, and SS Clinic. With a strong foundation in Internal Medicine, Dr. Sujith specializes in the management of Diabetes, Hypertension, Infectious Diseases, and Respiratory Conditions.
              </p>
            </Reveal>

            <Reveal direction="left" delay={0.2}>
              <div className="pt-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent-200" />
                <span className="text-[11px] text-accent-600 font-semibold tracking-[0.2em] uppercase">Core Values</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-200" />
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.25}>
              <div className="grid grid-cols-2 gap-3 stagger">
                {['Empathetic Care', 'Diagnostic Excellence', 'Patient Trust', 'Compassionate Communication'].map((v) => (
                  <div key={v} className="anim-fade-up flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white border border-ink-100 shadow-glass hover-lift cursor-default">
                    <span className="w-1.5 h-1.5 rotate-45 bg-accent-400 shrink-0" />
                    <span className="text-sm font-medium text-ink-700">{v}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Highlights */}
          <div className="lg:col-span-2 space-y-4 stagger">
            {aboutHighlights.map((s, i) => (
              <Reveal key={s.label} direction="right" delay={0.1 + i * 0.08}>
                <div className="group hover-lift card-premium flex items-center gap-5 p-5 bg-white rounded-2xl border border-ink-100 shadow-glass">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-100 flex items-center justify-center shrink-0">
                    <s.icon className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <p className="text-sm text-ink-400 font-medium">{s.label}</p>
                    <p className="text-lg font-semibold text-ink-800">{s.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   Expertise
   ════════════════════════════════════════════ */
const specialties = [
  {
    icon: Droplets,
    title: 'Diabetes Management',
    desc: 'Comprehensive diabetes care including Type 1, Type 2, and gestational diabetes with personalized treatment plans and continuous monitoring.',
  },
  {
    icon: Activity,
    title: 'Hypertension',
    desc: 'Expert management of high blood pressure with evidence-based protocols to prevent cardiovascular complications.',
  },
  {
    icon: ShieldCheck,
    title: 'Infectious Diseases',
    desc: 'Diagnosis and treatment of a wide range of infectious diseases with focus on accurate identification and targeted therapy.',
  },
  {
    icon: Wind,
    title: 'Respiratory Conditions',
    desc: 'Specialized care for asthma, COPD, and pulmonary infections with an advanced, methodical diagnostic approach.',
  },
];

function Expertise() {
  return (
    <section id="expertise" className="section-padding bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.5] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(12,110,92,0.05) 1px, transparent 0)', backgroundSize: '42px 42px' }} />

      <div className="relative max-w-6xl mx-auto">
        <SectionHeading
          tag="Specializations"
          title="Areas of Expertise"
          subtitle="Specialized care across multiple medical disciplines — always with a patient-first approach."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialties.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} direction="up">
              <div className="group card-premium relative h-full bg-ink-50/60 rounded-2xl p-7 border border-ink-100 shadow-glass hover-lift hover:border-accent-200">
                {/* Gold top accent */}
                <div className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-accent-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-700 to-primary-950 flex items-center justify-center shadow-glow-sm transition-transform duration-300 group-hover:scale-105">
                    <s.icon className="w-6 h-6 text-accent-100" />
                  </div>
                  <span className="font-heading text-3xl text-ink-200 group-hover:text-accent-300 transition-colors duration-300 select-none">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-ink-900 mb-3 group-hover:text-primary-800 transition-colors duration-300">
                  {s.title}
                </h3>
                <p className="text-ink-500 leading-relaxed text-[15px]">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   Education
   ════════════════════════════════════════════ */
const educationData = [
  {
    degree: 'PGDCED',
    institution: 'Post Graduate Diploma in Clinical Endocrinology & Diabetes',
    icon: BookOpen,
  },
  {
    degree: 'DNB (Internal Medicine)',
    institution: 'Diplomate of National Board in Internal Medicine',
    icon: Award,
  },
  {
    degree: 'MBBS',
    institution: 'Bachelor of Medicine & Bachelor of Surgery — Shimoga Institute of Medical Science and Research Centre',
    icon: GraduationCap,
  },
];

function Education() {
  return (
    <section id="education" className="section-padding bg-ink-50 relative">
      <div className="max-w-3xl mx-auto">
        <SectionHeading tag="Education" title="Qualifications" />

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-accent-200 via-primary-200 to-accent-200 hidden sm:block" />

          <div className="space-y-8">
            {educationData.map((e, i) => (
              <Reveal key={e.degree} delay={i * 0.15} direction="left">
                <div className="group flex gap-6 items-start">
                  {/* Timeline dot */}
                  <div className="relative z-10 shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-950 flex items-center justify-center shadow-glow-sm ring-1 ring-accent-300/25 transition-transform duration-300 group-hover:scale-105">
                      <e.icon className="w-7 h-7 text-accent-100" />
                    </div>
                  </div>
                  {/* Content card */}
                  <div className="flex-1 card-premium p-6 bg-white rounded-2xl border border-ink-100 shadow-glass hover-lift hover:border-accent-200">
                    <h3 className="text-xl font-semibold text-ink-900 group-hover:text-primary-800 transition-colors duration-300">
                      {e.degree}
                    </h3>
                    <p className="mt-2 text-ink-500 leading-relaxed">{e.institution}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   Experience — practice locations
   ════════════════════════════════════════════ */
const practices = [
  { name: 'Narayana Health', location: 'Bangalore' },
  { name: 'Clinique HealthTree', location: 'Bangalore' },
  { name: 'SS Clinic', location: 'Bangalore' },
];

function Experience() {
  return (
    <section id="experience" className="section-padding bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.5] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(12,110,92,0.04) 1px, transparent 0)', backgroundSize: '42px 42px' }} />

      <div className="relative max-w-5xl mx-auto">
        <SectionHeading
          tag="Experience"
          title="Where I Practice"
          subtitle="Dr. Sujith consults across multiple trusted clinics and hospitals in Bangalore — available by appointment."
        />

        {/* Practice location cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {practices.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1} direction="up">
              <div className="group card-premium relative h-full bg-gradient-to-br from-primary-950 to-primary-900 rounded-2xl p-7 shadow-lift overflow-hidden grain hover-lift">
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-accent-400/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-accent-300/20 flex items-center justify-center mb-5 group-hover:border-accent-300/40 transition-colors duration-300">
                    <Building2 className="w-6 h-6 text-accent-200" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-white">{p.name}</h3>
                  <div className="mt-2 flex items-center gap-2 text-white/60 text-sm">
                    <MapPin className="w-4 h-4 text-accent-300" />
                    {p.location}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-accent-200/90 text-xs font-medium tracking-wide">
                    <Clock className="w-3.5 h-3.5" />
                    By Appointment
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Summary info bar */}
        <Reveal direction="up" delay={0.1}>
          <div className="grid sm:grid-cols-3 gap-6 p-6 md:p-8 bg-ink-50/70 rounded-2xl border border-ink-100">
            {[
              { icon: Stethoscope, label: 'Specialty', value: 'Internal Medicine & Diabetology' },
              { icon: Clock, label: 'Availability', value: 'Mon – Sat, By Appointment' },
              { icon: ShieldCheck, label: 'Registration', value: 'KMC Reg. No. 105870' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-700 to-primary-950 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-accent-100" />
                </div>
                <div>
                  <p className="text-[11px] text-ink-400 font-semibold tracking-[0.15em] uppercase">{item.label}</p>
                  <p className="mt-0.5 text-ink-800 font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   Testimonials
   NOTE: Placeholder reviews — replace with genuine,
   consented patient testimonials before publishing.
   ════════════════════════════════════════════ */
const testimonials = [
  {
    quote: 'Dr. Sujith took the time to explain my diabetes management in a way I could finally understand. Patient, thorough, and genuinely caring.',
    name: 'R. Menon',
    context: 'Diabetes Care',
  },
  {
    quote: 'A calm, reassuring approach and an accurate diagnosis. I never felt rushed during my consultation and every question was answered.',
    name: 'P. Sharma',
    context: 'Internal Medicine',
  },
  {
    quote: 'Knowledgeable and compassionate. He follows up personally and makes you feel genuinely heard and cared for.',
    name: 'A. Nair',
    context: 'Hypertension',
  },
];

function Testimonials() {
  return (
    <section id="testimonials" className="section-padding relative overflow-hidden grain bg-gradient-to-br from-primary-950 to-primary-900">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <SectionHeading
          tag="Testimonials"
          title="In Their Words"
          subtitle="What patients say about their care and experience."
          light
        />

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.12} direction="up">
              <div className="group h-full flex flex-col bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-7 hover:border-accent-300/30 transition-colors duration-300">
                <Quote className="w-9 h-9 text-accent-300/80" />
                <div className="mt-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 text-accent-400 fill-accent-400" />
                  ))}
                </div>
                <p className="mt-5 text-white/75 leading-relaxed flex-1">“{t.quote}”</p>
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 ring-1 ring-accent-300/25 flex items-center justify-center text-accent-100 font-heading font-semibold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-accent-200/70">{t.context}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-white/40">Reviews are shared with patient consent.</p>
      </div>
    </section>
  );
}

/* ── Floating-label field (Google / Material style) ── */
function FloatingField({
  label, type = 'text', required = false, multiline = false,
}: { label: string; type?: string; required?: boolean; multiline?: boolean }) {
  const isDate = type === 'date';
  const inputCls =
    'peer w-full px-4 py-3.5 bg-transparent border border-ink-200 rounded-xl text-ink-800 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 transition-all duration-200';

  // Label rests inside the field when empty, floats to the top border on focus / when filled.
  const rest = multiline
    ? 'peer-placeholder-shown:top-4 peer-placeholder-shown:translate-y-0'
    : 'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2';
  const labelCls =
    'absolute left-3 px-1.5 font-medium pointer-events-none transition-all duration-200 ' +
    'top-0 -translate-y-1/2 text-xs text-primary-600 bg-white ' +
    (isDate ? '' : `${rest} peer-placeholder-shown:text-base peer-placeholder-shown:text-ink-400 peer-placeholder-shown:bg-transparent `) +
    'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-primary-600 peer-focus:bg-white';

  return (
    <div className="relative">
      {multiline ? (
        <textarea required={required} placeholder=" " rows={3} className={`${inputCls} resize-none`} />
      ) : (
        <input type={type} required={required} placeholder=" " className={inputCls} />
      )}
      <label className={labelCls}>{label}</label>
    </div>
  );
}

/* ════════════════════════════════════════════
   Contact
   ════════════════════════════════════════════ */
function Contact() {
  return (
    <section id="contact" className="section-padding bg-ink-50 relative">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          tag="Contact"
          title="Get in Touch"
          subtitle="Have a question or would like to connect? Send a message and Dr. Sujith will get back to you."
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Info cards */}
          <div className="space-y-5">
            {[
              { icon: Phone, title: 'Phone', detail: '+91 97383 49897', href: 'tel:+919738349897' },
              { icon: Mail, title: 'Email', detail: 'sujith.suhas@gmail.com', href: 'mailto:sujith.suhas@gmail.com' },
              { icon: MapPin, title: 'Practice Locations', detail: 'Narayana Health · Clinique HealthTree · SS Clinic\nBangalore' },
              { icon: Clock, title: 'Working Hours', detail: 'Monday – Saturday\nBy Appointment' },
            ].map((c, i) => {
              const inner = (
                <div className="group card-premium flex items-start gap-4 p-5 bg-white rounded-2xl border border-ink-100 shadow-glass hover-lift hover:border-accent-200">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-700 to-primary-950 flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-accent-100" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-800">{c.title}</p>
                    <p className="mt-1 text-ink-500 text-sm leading-relaxed whitespace-pre-line group-hover:text-primary-700 transition-colors duration-300">{c.detail}</p>
                  </div>
                </div>
              );
              return (
                <Reveal key={c.title} direction="left" delay={i * 0.08}>
                  {c.href ? <a href={c.href} className="block">{inner}</a> : <div className="cursor-default">{inner}</div>}
                </Reveal>
              );
            })}
          </div>

          {/* Message / connect form */}
          <Reveal direction="right" delay={0.2}>
            <div className="border-beam relative bg-white rounded-3xl p-8 border border-ink-100 shadow-glass-lg">
              <h3 className="text-xl font-heading font-semibold text-ink-900 mb-1">Send a Message</h3>
              <p className="text-sm text-ink-400 mb-7">Have a question or would like to connect? I’ll get back to you.</p>
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for reaching out! Dr. Sujith will get back to you shortly.');
                }}
              >
                <FloatingField label="Full Name" type="text" required />
                <FloatingField label="Email Address" type="email" required />
                <FloatingField label="Phone (optional)" type="tel" />
                <FloatingField label="Message" multiline required />
                <button
                  type="submit"
                  className="btn-shine w-full py-4 bg-primary-800 text-white font-semibold rounded-xl ring-1 ring-inset ring-accent-300/30 hover:bg-primary-900 hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   Footer
   ════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-400 relative overflow-hidden grain">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '26px 26px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px gold-line" />

      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-10 items-start">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-700 to-primary-950 flex items-center justify-center font-heading text-lg font-semibold text-accent-200">
                <span className="absolute inset-1 rounded-lg border border-accent-300/30" />
                S
              </span>
              <span className="font-heading text-xl font-semibold text-white">Dr. Sujith M S</span>
            </div>
            <p className="text-sm leading-relaxed text-ink-400">
              Consultant Physician &amp; Diabetologist dedicated to providing compassionate, evidence-based medical care.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-xs tracking-[0.18em] uppercase">Quick Links</h4>
            <div className="space-y-3">
              {['About', 'Expertise', 'Education', 'Experience', 'Testimonials', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="block text-sm hover:text-accent-300 transition-colors duration-300 link-underline w-fit">
                  {l}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-xs tracking-[0.18em] uppercase">Get in Touch</h4>
            <div className="space-y-2.5 text-sm text-ink-400">
              <a href="tel:+919738349897" className="flex items-center gap-2.5 hover:text-accent-300 transition-colors duration-300">
                <Phone className="w-4 h-4 text-accent-400/80" /> +91 97383 49897
              </a>
              <a href="mailto:sujith.suhas@gmail.com" className="flex items-center gap-2.5 hover:text-accent-300 transition-colors duration-300">
                <Mail className="w-4 h-4 text-accent-400/80" /> sujith.suhas@gmail.com
              </a>
              <p className="flex items-start gap-2.5 pt-1">
                <MapPin className="w-4 h-4 text-accent-400/80 mt-0.5 shrink-0" /> Multiple clinics across Bangalore
              </p>
            </div>
            <p className="mt-4 text-sm text-ink-500">KMC Reg. No. 105870</p>
          </div>
        </div>

        <div className="section-divider mt-12 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-500">
          <p>&copy; {new Date().getFullYear()} Dr. Sujith M S. All rights reserved.</p>
          <p className="text-xs">Medical information on this site is for reference only.</p>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════
   ScrollToTop
   ════════════════════════════════════════════ */
function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-8 right-8 z-40 w-12 h-12 rounded-2xl bg-primary-800 text-accent-100 ring-1 ring-accent-300/30 shadow-glass-lg hover:shadow-glow hover:-translate-y-1 transition-all duration-300 flex items-center justify-center ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

/* ════════════════════════════════════════════
   App
   ════════════════════════════════════════════ */
function App() {
  return (
    <div className="min-h-screen bg-ink-50">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Expertise />
      <Education />
      <Experience />
      <Testimonials />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
