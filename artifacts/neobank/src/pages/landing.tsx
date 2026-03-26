import { Link } from "wouter";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  ArrowRight, ShieldCheck, Zap, Globe, Smartphone,
  ChevronRight, Check, TrendingUp, Lock, Wifi,
  CreditCard, BadgeCheck, Star
} from "lucide-react";

// ─── Animated counter ────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1600, delay = 600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = Date.now() + delay;
    let raf: number;
    const tick = () => {
      const now = Date.now();
      if (now < start) { raf = requestAnimationFrame(tick); return; }
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return value;
}

// ─── Transaction ticker ───────────────────────────────────────────────────────
const tickerItems = [
  { label: "Virement SWIFT reçu", amount: "+48 200,00 $", color: "text-emerald-400", from: "Holdings Group LLC" },
  { label: "Conversion EUR→CHF", amount: "250 000 €", color: "text-primary", from: "Change de devises" },
  { label: "Dividende ETF S&P500", amount: "+3 840,00 $", color: "text-emerald-400", from: "KovaBank Invest" },
  { label: "Virement SEPA entrant", amount: "+12 500,00 €", color: "text-emerald-400", from: "Société Générale" },
  { label: "Or physique alloué", amount: "50 000,00 $", color: "text-amber-400", from: "KovaBank Vault" },
  { label: "Paiement Visa Infinite", amount: "-4 290,00 €", color: "text-white/70", from: "Four Seasons Genève" },
  { label: "Obligation EUR 3,8%", amount: "+1 420,00 €", color: "text-emerald-400", from: "Portefeuille Obligat." },
  { label: "Conversion USD→GBP", amount: "80 000 $", color: "text-primary", from: "Change de devises" },
];

function Ticker() {
  const repeated = [...tickerItems, ...tickerItems];
  return (
    <div className="relative overflow-hidden py-4 border-y border-white/[0.05] bg-white/[0.015]">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050d1a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050d1a] to-transparent z-10 pointer-events-none" />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="flex gap-8 whitespace-nowrap w-max"
      >
        {repeated.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" style={{ color: item.color.replace("text-", "") === "emerald-400" ? "#34d399" : item.color.replace("text-", "") === "primary" ? "#00e5ff" : item.color.replace("text-", "") === "violet-400" ? "#a78bfa" : "#ffffff" }} />
            <span className="text-xs text-white/40 font-medium">{item.from}</span>
            <span className="text-xs text-white/25">·</span>
            <span className="text-xs text-white/60">{item.label}</span>
            <span className={`text-xs font-bold ${item.color}`}>{item.amount}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Floating info bubbles that cycle around the cards ───────────────────────
const infoBubbles = [
  {
    id: "recv",
    icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />,
    label: "Virement reçu",
    value: "+2 450,00 €",
    valueColor: "text-emerald-400",
    pos: "top-[12%] left-[4%]",
  },
  {
    id: "secure",
    icon: <Lock className="w-3.5 h-3.5 text-sky-400" />,
    label: "Paiement 3DS",
    value: "Sécurisé ✓",
    valueColor: "text-sky-400",
    pos: "top-[6%] right-[2%]",
  },
  {
    id: "tap",
    icon: <Wifi className="w-3.5 h-3.5 text-violet-400" />,
    label: "Visa Sans Contact",
    value: "-34,90 €",
    valueColor: "text-white",
    pos: "bottom-[22%] left-[2%]",
  },
  {
    id: "perf",
    icon: <TrendingUp className="w-3.5 h-3.5 text-amber-400" />,
    label: "Portefeuille",
    value: "+12,4% ce mois",
    valueColor: "text-amber-400",
    pos: "bottom-[8%] right-[4%]",
  },
  {
    id: "opened",
    icon: <BadgeCheck className="w-3.5 h-3.5 text-primary" />,
    label: "Compte ouvert",
    value: "en 3 min 12 s",
    valueColor: "text-primary",
    pos: "top-[42%] right-[-2%]",
  },
];

function FloatingBubble({
  bubble,
  delay,
}: {
  bubble: (typeof infoBubbles)[0];
  delay: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cycle = infoBubbles.length * 3200;
    const timer = setTimeout(() => setVisible(true), delay);
    const hide = setTimeout(() => setVisible(false), delay + 2400);
    const restart = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 2400);
    }, cycle);
    return () => {
      clearTimeout(timer);
      clearTimeout(hide);
      clearInterval(restart);
    };
  }, [delay]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={bubble.id}
          initial={{ opacity: 0, scale: 0.8, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -4 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`absolute ${bubble.pos} z-20 pointer-events-none`}
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0d1829]/90 border border-white/10 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            {bubble.icon}
            <div>
              <p className="text-[10px] text-white/50 leading-none mb-0.5">{bubble.label}</p>
              <p className={`text-xs font-semibold leading-none ${bubble.valueColor}`}>{bubble.value}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Scroll-aware navbar ──────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050d1a]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_40px_rgba(0,0,0,0.6)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-sky-400 to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="font-black text-white text-base leading-none tracking-tighter">N</span>
            </div>
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary to-accent opacity-30 blur-sm -z-10" />
          </div>
          <span className="font-black text-white text-xl tracking-tight">Kova<span className="text-primary">Bank</span></span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Fonctionnalités", href: "#features" },
            { label: "Tarifs", href: "#plans" },
            { label: "Crédits", href: "#loans" },
            { label: "À propos", href: "#" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:block px-5 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-bold rounded-xl bg-primary text-[#050d1a] hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:shadow-[0_0_30px_rgba(0,229,255,0.45)] hover:-translate-y-0.5"
          >
            Ouvrir un compte
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── Hero cards with tilt 3D ─────────────────────────────────────────────────
function HeroCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 180, damping: 28 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 180, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const balance = useCountUp(124500, 1800, 700);
  const formatted = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(balance);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex-1 relative w-full max-w-lg aspect-square cursor-none"
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 to-violet-500/15 rounded-full blur-[100px]" />

        {/* Balance card */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-1/4 left-0 w-64 h-40 rounded-2xl glass-panel p-6 flex flex-col justify-between overflow-hidden"
          style={{ translateZ: 20 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-0" />
          <div className="relative z-10 flex justify-between items-start">
            <div className="w-10 h-6 bg-white/20 rounded-md" />
            <Zap className="text-primary w-6 h-6" />
          </div>
          <div className="relative z-10">
            <p className="text-white/60 text-xs mb-1 uppercase tracking-wider font-medium">Solde Total</p>
            <p className="text-white font-bold text-2xl tabular-nums">{formatted}</p>
          </div>
        </motion.div>

        {/* NEO card */}
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-0 w-72 h-48 rounded-2xl bg-gradient-to-br from-secondary to-background border border-white/10 shadow-2xl p-6 flex flex-col justify-between"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}images/card-texture.png)`,
            backgroundSize: "cover",
            backgroundBlendMode: "overlay",
            translateZ: 40,
          }}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg tracking-widest text-white/90">NEO</span>
            <Globe className="text-white/50 w-6 h-6" />
          </div>
          <div>
            <p className="text-white/80 font-mono tracking-[0.2em] mb-2 text-lg">•••• •••• •••• 4092</p>
            <div className="flex justify-between text-xs text-white/60 uppercase tracking-wider font-medium">
              <span>Alex Carter</span>
              <span>12/28</span>
            </div>
          </div>
        </motion.div>

        {/* Floating info bubbles */}
        {infoBubbles.map((bubble, i) => (
          <FloatingBubble key={bubble.id} bubble={bubble} delay={i * 3200} />
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050d1a] overflow-hidden relative selection:bg-primary/30 text-white font-sans">
      {/* Deep background atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-primary/10 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-violet-600/8 rounded-full blur-[140px] translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-sky-900/10 rounded-full blur-[180px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <Navbar />

      {/* ── Hero ── */}
      <section className="relative z-10 min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 w-full py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 text-center lg:text-left max-w-2xl"
          >
            {/* Trust pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md mb-10"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-primary text-xs font-bold tracking-widest uppercase">Régulé FSA · Îles Caïmans · CIMA · Multi-devises</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-[clamp(3rem,7vw,5.5rem)] font-black text-white leading-[1.05] tracking-tight mb-6">
              Votre patrimoine,
              <br />
              <span
                className="bg-gradient-to-r from-primary via-sky-300 to-violet-400 bg-clip-text text-transparent"
              >
                sans frontières.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Banque offshore de premier ordre. Comptes multi-devises, gestion de patrimoine internationale
              et confidentialité absolue — depuis les Îles Caïmans.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
              <Link
                href="/login"
                className="group relative px-8 py-4 w-full sm:w-auto text-center rounded-2xl font-bold bg-primary text-[#050d1a] shadow-[0_0_40px_-10px_rgba(0,229,255,0.6)] hover:shadow-[0_0_60px_-8px_rgba(0,229,255,0.8)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">Ouvrir un compte</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 w-full sm:w-auto text-center rounded-2xl font-semibold border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                Essayer la démo →
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 justify-center lg:justify-start">
              {[
                { icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, text: "Confidentialité totale" },
                { icon: <Star className="w-4 h-4 text-amber-400" />, text: "Multi-devises 35+" },
                { icon: <BadgeCheck className="w-4 h-4 text-primary" />, text: "Régulé FSA CIMA" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
                  {b.icon}
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: tilt 3D cards */}
          <HeroCards />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-medium">Découvrir</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── Transaction ticker ── */}
      <Ticker />

      {/* ── Stats bar ── */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "12 000+", label: "Clients privés" },
              { value: "4,2 Md $+", label: "Actifs gérés" },
              { value: "35+", label: "Devises supportées" },
              { value: "99,98 %", label: "Disponibilité SLA" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="text-center"
              >
                <h3 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">{stat.value}</h3>
                <p className="text-white/35 text-xs font-semibold uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 py-36">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4">Fonctionnalités</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight">Tout ce dont vous avez besoin</h2>
            <p className="text-lg text-white/40 max-w-xl mx-auto">Une infrastructure bancaire offshore de premier ordre, pensée pour les clients privés exigeants.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Globe, title: "Comptes Multi-devises", desc: "Ouvrez des comptes en USD, EUR, CHF, GBP et 31 autres devises en quelques minutes." },
              { icon: Lock, title: "Confidentialité Absolue", desc: "Juridiction offshore, secret bancaire renforcé et protection de vos données garantie." },
              { icon: CreditCard, title: "Cartes Métal Mondiales", desc: "Cartes Visa Infinite acceptées dans 200+ pays, sans frais de conversion de devises." },
              { icon: TrendingUp, title: "Gestion de Patrimoine", desc: "Portefeuilles d'investissement sur mesure, ETF, obligations et métaux précieux." },
              { icon: Zap, title: "Virements SWIFT/SEPA", desc: "Transferts internationaux instantanés vers 180 pays, frais fixes et transparents." },
              { icon: ShieldCheck, title: "Structure Réglementée", desc: "Agréé FSA et CIMA aux Îles Caïmans. Audit annuel indépendant de vos comptes." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.6 }}
                className="group relative p-8 rounded-3xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-400 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 py-36 border-y border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4">Démarrage rapide</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight">Accès en 3 étapes</h2>
            <p className="text-lg text-white/40 max-w-xl mx-auto">Un processus d'intégration rapide et sécurisé, conforme aux exigences réglementaires internationales.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[3.5rem] left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {[
              { step: "01", title: "Demande d'adhésion", desc: "Soumettez votre dossier en ligne. Un conseiller privé vous contacte sous 24 heures." },
              { step: "02", title: "Vérification KYC/AML", desc: "Vérification d'identité sécurisée conforme aux normes FATF. Confidentialité garantie." },
              { step: "03", title: "Accès immédiat", desc: "Compte multi-devises actif, carte Visa Infinite émise et conseiller dédié assigné." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="relative text-center"
              >
                <div className="w-16 h-16 mx-auto mb-8 rounded-2xl border border-primary/30 bg-primary/5 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                  <span className="text-primary font-black text-lg tracking-tight">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans ── */}
      <section id="plans" className="relative z-10 py-36">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4">Nos offres</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight">Un tarif pour chacun</h2>
            <p className="text-lg text-white/40 max-w-xl mx-auto">Des offres transparentes qui s'adaptent à vos besoins et à votre style de vie.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Standard */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.6 }}
              className="p-8 rounded-3xl border border-white/[0.07] bg-white/[0.03] flex flex-col"
            >
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-1">Essentiel</h3>
                <p className="text-white/35 text-sm">Entrée dans le privé</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-black text-white">29 $</span>
                <span className="text-white/35 text-sm"> / mois</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {["1 compte multi-devises", "Carte Visa Infinite", "Virements SWIFT/SEPA", "Support 24/7"].map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-white/60 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full py-3.5 rounded-xl font-bold text-sm bg-white/[0.06] hover:bg-white/[0.1] text-white transition-all border border-white/[0.08] text-center block">
                Ouvrir un compte
              </Link>
            </motion.div>

            {/* Premium — featured */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="relative flex flex-col"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/20 via-sky-500/10 to-transparent blur-sm" />
              <div className="relative flex flex-col flex-1 p-8 rounded-3xl border border-primary/30 bg-[#071525] shadow-[0_0_60px_rgba(0,229,255,0.12)]">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-[#050d1a] text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  Le plus populaire
                </div>
                <div className="mb-8 mt-2">
                  <h3 className="text-xl font-bold text-white mb-1">Privé</h3>
                  <p className="text-primary/70 text-sm">Banque privée complète</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-black text-white">149 $</span>
                  <span className="text-white/35 text-sm"> / mois</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {["5 comptes multi-devises", "2 cartes métal Infinite", "SWIFT gratuits illimités", "Conseiller privé dédié"].map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-white text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="w-full py-3.5 rounded-xl font-bold text-sm bg-primary text-[#050d1a] hover:bg-primary/90 transition-all shadow-[0_0_24px_rgba(0,229,255,0.3)] text-center block">
                  Essayer Premium
                </Link>
              </div>
            </motion.div>

            {/* Elite */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="p-8 rounded-3xl border border-amber-400/20 bg-white/[0.03] flex flex-col"
            >
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-1">Patrimoine</h3>
                <p className="text-amber-400/70 text-sm">Gestion de fortune</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-black text-white">490 $</span>
                <span className="text-white/35 text-sm"> / mois</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {["Comptes illimités 35 devises", "Cartes métal nominatives", "0 % frais de change", "Family office & structuration"].map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-white/80 text-sm">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full py-3.5 rounded-xl font-bold text-sm bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 transition-all border border-amber-400/20 text-center block">
                Rejoindre Elite
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Loans ── */}
      <section id="loans" className="relative z-10 py-36 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-xl"
            >
              <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4">Crédits</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Vos projets, financés</h2>
              <p className="text-white/40">Des offres de crédit transparentes, avec des taux compétitifs et une réponse de principe en quelques secondes.</p>
            </motion.div>
            <Link href="/login" className="flex items-center gap-2 text-primary font-bold text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
              Simuler un prêt <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: "Prêt Personnel", rate: "dès 3,5 % TAEG", amount: "Jusqu'à 75 000 €", accent: "from-sky-500/15 to-transparent", border: "border-sky-500/20", badge: "sky" },
              { title: "Crédit Auto", rate: "dès 2,9 % TAEG", amount: "Jusqu'à 100 000 €", accent: "from-emerald-500/15 to-transparent", border: "border-emerald-500/20", badge: "green" },
              { title: "Crédit Immobilier", rate: "dès 3,2 % TAEG", amount: "Jusqu'à 1 500 000 €", accent: "from-violet-500/15 to-transparent", border: "border-violet-500/20", badge: "violet" },
            ].map((loan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className={`group relative p-8 rounded-3xl border ${loan.border} bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-300 overflow-hidden hover:-translate-y-1`}
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${loan.accent} rounded-bl-full`} />
                <h3 className="text-xl font-bold text-white mb-6 relative z-10 tracking-tight">{loan.title}</h3>
                <div className="space-y-2.5 relative z-10">
                  <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-black/20 border border-white/[0.05]">
                    <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">Taux</span>
                    <span className="font-bold text-emerald-400 text-sm">{loan.rate}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-black/20 border border-white/[0.05]">
                    <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">Montant</span>
                    <span className="font-bold text-white text-sm">{loan.amount}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-36">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2.5rem] overflow-hidden border border-white/[0.08]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#071525] to-violet-900/20" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            <div className="relative z-10 p-14 md:p-20 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight">Rejoindre KovaBank ?</h2>
              <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">Intégrez une communauté exclusive de clients privés et gérez votre patrimoine international depuis une seule interface.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold bg-white text-[#050d1a] hover:bg-white/90 transition-all text-base shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105"
              >
                Accéder à la démo <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="font-black text-[#050d1a] text-sm">K</span>
                </div>
                <span className="font-black text-white text-lg tracking-tight">Kova<span className="text-primary">Bank</span></span>
              </div>
              <p className="text-white/35 text-sm leading-relaxed max-w-xs">
                Banque offshore privée. Comptes multi-devises, gestion de patrimoine et confidentialité internationale.
              </p>
              <p className="text-white/20 text-xs mt-6 leading-relaxed">
                Régulé par la FSA et la CIMA — Îles Caïmans. Juridiction internationale reconnue.
              </p>
            </div>
            {[
              { title: "Services", links: ["Comptes Multi-devises", "Cartes Visa Infinite", "Gestion Patrimoniale", "SWIFT & SEPA", "Métaux Précieux"] },
              { title: "Société", links: ["À propos", "Conformité & AML", "Presse", "Carrières"] },
              { title: "Légal", links: ["CGU", "Politique de confidentialité", "Sécurité", "Réglementation FSA", "Tarifaire"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-white/35 text-sm hover:text-white/70 transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/25 text-xs">© {new Date().getFullYear()} KovaBank Ltd. Tous droits réservés.</p>
            <p className="text-white/20 text-xs text-center">KovaBank Ltd est régulée par la FSA et la CIMA (Îles Caïmans). L'investissement comporte des risques de perte en capital.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
