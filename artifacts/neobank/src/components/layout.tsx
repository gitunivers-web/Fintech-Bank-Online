import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  CreditCard,
  Briefcase,
  PiggyBank,
  Settings,
  LogOut,
  Menu,
  Bell,
  Crown,
  Send,
  TrendingUp,
  X,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const navGroups = [
  {
    label: "Aperçu",
    items: [
      { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
    ],
  },
  {
    label: "Mes finances",
    items: [
      { icon: Wallet, label: "Comptes", path: "/accounts" },
      { icon: ArrowRightLeft, label: "Transactions", path: "/transactions", badge: true },
      { icon: CreditCard, label: "Cartes", path: "/cards" },
      { icon: Send, label: "Virements", path: "/transfers" },
    ],
  },
  {
    label: "Financement & épargne",
    items: [
      { icon: Briefcase, label: "Crédits", path: "/loans" },
      { icon: PiggyBank, label: "Épargne", path: "/savings" },
      { icon: TrendingUp, label: "Investissements", path: "/savings" },
    ],
  },
  {
    label: "Compte",
    items: [
      { icon: Settings, label: "Paramètres", path: "/profile" },
    ],
  },
];

const tierConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  premium: { label: "Premium", color: "text-amber-300", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  elite:   { label: "Elite",   color: "text-violet-300", bg: "bg-violet-400/10", border: "border-violet-400/20" },
  standard:{ label: "Standard",color: "text-sky-300",  bg: "bg-sky-400/10",  border: "border-sky-400/20"  },
};

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tier = tierConfig[user?.tier || "standard"] || tierConfig.standard;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 group" onClick={() => setMobileMenuOpen(false)}>
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary via-sky-400 to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="font-black text-[#050d1a] text-sm leading-none">N</span>
            </div>
          </div>
          <span className="font-black text-white text-lg tracking-tight">Neo<span className="text-primary">Bank</span></span>
        </Link>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-3 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/20 select-none">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 relative group
                      ${isActive
                        ? "text-white"
                        : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-bg"
                        className="absolute inset-0 bg-gradient-to-r from-primary/12 via-primary/6 to-transparent rounded-xl border border-primary/15"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <div className="flex items-center gap-3 relative z-10">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-primary" : "group-hover:text-white/70"}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2 relative z-10">
                      {item.badge && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,229,255,0.9)]" />
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary/50" />}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* User card */}
      <div className="p-3 mt-3">
        <div className={`p-3.5 rounded-2xl border ${tier.border} ${tier.bg} mb-2 relative overflow-hidden`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user?.avatarUrl || `${import.meta.env.BASE_URL}images/avatar.png`}
                alt="User"
                className="w-9 h-9 rounded-full object-cover border border-white/10"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop"; }}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Crown className={`w-3 h-3 ${tier.color}`} />
                <p className={`text-xs font-semibold ${tier.color}`}>{tier.label}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/8 transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#050d1a] text-foreground flex overflow-hidden">
      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-white/[0.025] backdrop-blur-2xl border-r border-white/[0.05] relative z-20 shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-white/[0.05] bg-[#050d1a]/80 backdrop-blur-xl relative z-20">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="font-black text-[#050d1a] text-sm">N</span>
            </div>
            <span className="font-black text-white text-base tracking-tight">Neo<span className="text-primary">Bank</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="text-white/40 hover:text-white relative transition-colors">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,229,255,0.9)]" />
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="text-white/60 hover:text-white transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 md:p-8">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 flex flex-col bg-[#070f20] border-r border-white/[0.06] lg:hidden"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setMobileMenuOpen(false)} className="text-white/40 hover:text-white p-1 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
