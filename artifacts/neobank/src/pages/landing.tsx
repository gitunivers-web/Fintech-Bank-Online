import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Globe, Smartphone, ChevronRight, Check } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/30 text-white font-sans">
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
          <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
          <a href="#plans" className="hover:text-white transition-colors">Tarifs</a>
          <a href="#loans" className="hover:text-white transition-colors">Crédits</a>
        </div>
        <Link 
          href="/login"
          className="px-6 py-2.5 rounded-full font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-all shadow-lg hover:shadow-xl"
        >
          Essayer la démo
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 flex flex-col lg:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-semibold mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Le Futur de la Banque est ici
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            La banque, <br/>
            <span className="text-gradient">réinventée.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Virements mondiaux instantanés, épargne intelligente et décisions de crédit en temps réel. Votre patrimoine, propulsé par la technologie.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link 
              href="/login"
              className="px-8 py-4 w-full sm:w-auto text-center rounded-2xl font-bold bg-primary text-primary-foreground shadow-[0_0_40px_-10px_rgba(0,229,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(0,229,255,0.7)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Ouvrir un compte <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/login"
              className="px-8 py-4 w-full sm:w-auto text-center rounded-2xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
            >
              Essayer la démo interactive
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
              <p className="text-white/60 text-xs mb-1 uppercase tracking-wider font-medium">Solde Total</p>
              <p className="text-white font-bold text-2xl">124 500,00 €</p>
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
              <p className="text-white/80 font-mono tracking-[0.2em] mb-2 text-lg">•••• •••• •••• 4092</p>
              <div className="flex justify-between text-xs text-white/60 uppercase tracking-wider font-medium">
                <span>Alex Carter</span>
                <span>12/28</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Stats Bar */}
      <section className="relative z-10 border-y border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {[
              { value: "500k+", label: "Clients Actifs" },
              { value: "2 Md €+", label: "Transférés" },
              { value: "4.9/5", label: "Note App Store" },
              { value: "98%", label: "Satisfaction" }
            ].map((stat, i) => (
              <div key={i} className="text-center px-4">
                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{stat.value}</h3>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-32 bg-card/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Tout ce dont vous avez besoin</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Une suite complète d'outils financiers pour gérer, faire fructifier et protéger votre argent au quotidien.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Comptes & Virements", desc: "Envoyez et recevez de l'argent instantanément, sans frais cachés à l'international." },
              { icon: Smartphone, title: "Cartes Intelligentes", desc: "Cartes virtuelles et physiques. Verrouillez-les en un clic depuis l'application." },
              { icon: Zap, title: "Épargne Automatique", desc: "Définissez des objectifs et arrondissez vos dépenses pour épargner sans y penser." },
              { icon: Check, title: "Crédits Instantanés", desc: "Financez vos projets personnels ou professionnels avec des réponses en temps réel." },
              { icon: Globe, title: "Investissements", desc: "Gérez votre portefeuille, achetez des actions et des cryptomonnaies simplement." },
              { icon: ShieldCheck, title: "Sécurité Avancée", desc: "Authentification 2FA, biométrie et chiffrement de bout en bout pour votre protection." }
            ].map((f, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ouverture en 3 minutes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Oubliez la paperasse. Ouvrez votre compte en quelques étapes simples directement depuis votre smartphone.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />
            {[
              { step: "1", title: "Créez votre compte", desc: "Téléchargez l'application et entrez vos informations de base en toute sécurité." },
              { step: "2", title: "Vérifiez votre identité", desc: "Prenez une photo de votre pièce d'identité et un selfie pour validation immédiate." },
              { step: "3", title: "Commencez à utiliser", desc: "Votre carte virtuelle est prête. Approvisionnez votre compte et c'est parti !" }
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="w-24 h-24 mx-auto bg-card border-2 border-primary rounded-full flex items-center justify-center text-3xl font-bold text-white mb-8 shadow-[0_0_30px_rgba(0,229,255,0.3)] relative z-10">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans / Pricing */}
      <section id="plans" className="relative z-10 py-32 bg-black/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Un tarif pour chacun</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Des offres transparentes qui s'adaptent à vos besoins et à votre style de vie.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            
            {/* Standard */}
            <div className="glass-card p-8 rounded-3xl h-full border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-2">Standard</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">0 €</span>
                <span className="text-muted-foreground"> /mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white/80"><Check className="w-5 h-5 text-emerald-400" /> 1 compte courant</li>
                <li className="flex items-center gap-3 text-white/80"><Check className="w-5 h-5 text-emerald-400" /> 1 carte physique</li>
                <li className="flex items-center gap-3 text-white/80"><Check className="w-5 h-5 text-emerald-400" /> Virements standards</li>
                <li className="flex items-center gap-3 text-white/40"><Check className="w-5 h-5 text-white/20" /> Support prioritaire</li>
              </ul>
              <button className="w-full py-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10">
                Choisir Standard
              </button>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-b from-primary/20 to-card p-1 rounded-3xl relative transform md:-translate-y-4 shadow-[0_0_50px_rgba(0,229,255,0.2)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                Le plus populaire
              </div>
              <div className="bg-card p-8 rounded-[1.4rem] h-full">
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-white">9.99 €</span>
                  <span className="text-muted-foreground"> /mois</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5 text-primary" /> Jusqu'à 3 comptes</li>
                  <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5 text-primary" /> 2 cartes premium</li>
                  <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5 text-primary" /> Virements instantanés gratuits</li>
                  <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5 text-primary" /> Support prioritaire 24/7</li>
                </ul>
                <button className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                  Essayer Premium
                </button>
              </div>
            </div>

            {/* Elite */}
            <div className="glass-card p-8 rounded-3xl h-full border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-2">Elite</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">19.99 €</span>
                <span className="text-muted-foreground"> /mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white/80"><Check className="w-5 h-5 text-amber-400" /> Comptes illimités</li>
                <li className="flex items-center gap-3 text-white/80"><Check className="w-5 h-5 text-amber-400" /> 5 cartes exclusives en métal</li>
                <li className="flex items-center gap-3 text-white/80"><Check className="w-5 h-5 text-amber-400" /> 0% frais de change</li>
                <li className="flex items-center gap-3 text-white/80"><Check className="w-5 h-5 text-amber-400" /> Conseiller dédié</li>
              </ul>
              <button className="w-full py-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10">
                Rejoindre Elite
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Loans Teaser */}
      <section id="loans" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Vos projets, financés</h2>
              <p className="text-xl text-muted-foreground">Des offres de crédit transparentes, avec des taux compétitifs et une réponse de principe en quelques secondes.</p>
            </div>
            <Link href="/login" className="flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors">
              Simuler un prêt <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Prêt Personnel", rate: "dès 3.5%", amount: "Jusqu'à 50 000 €", color: "from-blue-500/20 to-transparent" },
              { title: "Prêt Auto", rate: "dès 2.9%", amount: "Jusqu'à 75 000 €", color: "from-emerald-500/20 to-transparent" },
              { title: "Prêt Immobilier", rate: "dès 3.8%", amount: "Jusqu'à 1 000 000 €", color: "from-purple-500/20 to-transparent" }
            ].map((loan, i) => (
              <div key={i} className="glass-card rounded-3xl p-8 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${loan.color} rounded-bl-full opacity-50`} />
                <h3 className="text-2xl font-bold text-white mb-6 relative z-10">{loan.title}</h3>
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                    <span className="text-muted-foreground text-sm">TAEG fixe</span>
                    <span className="font-bold text-emerald-400">{loan.rate}</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                    <span className="text-muted-foreground text-sm">Montant</span>
                    <span className="font-bold text-white">{loan.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="glass-card rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl opacity-50" />
            <h2 className="text-5xl font-extrabold text-white mb-6 relative z-10">Prêt à rejoindre NeoBank ?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto relative z-10">Rejoignez plus de 500 000 clients et reprenez le contrôle de vos finances dès aujourd'hui.</p>
            <Link 
              href="/login"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold bg-white text-black hover:bg-white/90 transition-all text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 relative z-10"
            >
              Essayer la démo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-background pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="font-bold text-white">N</span>
                </div>
                <span className="font-display font-bold text-xl tracking-tight text-white">NeoBank</span>
              </div>
              <p className="text-muted-foreground text-sm">La nouvelle génération de services bancaires pour tous.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Produits</h4>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Comptes Courants</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cartes Métal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Épargne & Investissements</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Crédits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Société</h4>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Légal</h4>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sécurité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} NeoBank. Tous droits réservés.</p>
            <div className="text-muted-foreground text-xs text-center md:text-right max-w-xl">
              NeoBank est une institution financière agréée. L'investissement comporte des risques de perte en capital.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
