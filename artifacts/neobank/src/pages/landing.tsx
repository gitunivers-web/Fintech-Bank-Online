import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Globe, Smartphone } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/30">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-mesh opacity-50 z-0 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
            <span className="font-bold text-white text-xl">N</span>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">NeoBank</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#cards" className="hover:text-white transition-colors">Cards</a>
          <a href="#loans" className="hover:text-white transition-colors">Loans</a>
        </div>
        <Link 
          href="/login"
          className="px-6 py-2.5 rounded-full font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-all shadow-lg hover:shadow-xl"
        >
          Enter Demo
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-semibold mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            The Future of Banking is Here
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Banking, completely <br/>
            <span className="text-gradient">reimagined.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0">
            Experience seamless global transfers, intelligent savings, and instant credit decisions. Your wealth, elevated by technology.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link 
              href="/login"
              className="px-8 py-4 w-full sm:w-auto text-center rounded-2xl font-bold bg-primary text-primary-foreground shadow-[0_0_40px_-10px_rgba(0,229,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(0,229,255,0.7)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Open Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/login"
              className="px-8 py-4 w-full sm:w-auto text-center rounded-2xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
            >
              Try Interactive Demo
            </Link>
          </div>
        </motion.div>

        {/* Floating Cards Graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 relative w-full max-w-lg aspect-square"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-[80px]" />
          
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-1/4 left-0 w-64 h-40 rounded-2xl glass-panel p-6 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-0" />
            <div className="relative z-10 flex justify-between items-start">
              <div className="w-10 h-6 bg-white/20 rounded-md" />
              <Zap className="text-primary w-6 h-6" />
            </div>
            <div className="relative z-10">
              <p className="text-white/60 text-xs mb-1">Total Balance</p>
              <p className="text-white font-bold text-2xl">$124,500.00</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-0 w-72 h-48 rounded-2xl bg-gradient-to-br from-secondary to-background border border-white/10 shadow-2xl p-6 flex flex-col justify-between"
            style={{
              backgroundImage: `url(${import.meta.env.BASE_URL}images/card-texture.png)`,
              backgroundSize: 'cover',
              backgroundBlendMode: 'overlay'
            }}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg tracking-widest text-white/90">NEO</span>
              <Globe className="text-white/50 w-6 h-6" />
            </div>
            <div>
              <p className="text-white/80 font-mono tracking-[0.2em] mb-2">•••• •••• •••• 4092</p>
              <div className="flex justify-between text-xs text-white/60 uppercase tracking-wider">
                <span>Alex Carter</span>
                <span>12/28</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Feature Grid */}
      <section id="features" className="relative z-10 py-24 bg-card/30 border-y border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to build wealth</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">No hidden fees, no complicated processes. Just pure financial power at your fingertips.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Global Transfers", desc: "Send money in 30+ currencies with real exchange rates." },
              { icon: ShieldCheck, title: "Bank-grade Security", desc: "Your money is protected by cutting-edge encryption." },
              { icon: Smartphone, title: "Smart Analytics", desc: "Understand your spending with automated categorization." },
            ].map((f, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
