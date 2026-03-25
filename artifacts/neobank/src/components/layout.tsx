import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { framerMotion } from "framer-motion";
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
  Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Wallet, label: "Accounts", path: "/accounts" },
  { icon: ArrowRightLeft, label: "Transactions", path: "/transactions" },
  { icon: CreditCard, label: "Cards", path: "/cards" },
  { icon: ArrowRightLeft, label: "Transfers", path: "/transfers" },
  { icon: Briefcase, label: "Loans", path: "/loans" },
  { icon: PiggyBank, label: "Savings", path: "/savings" },
  { icon: Settings, label: "Settings", path: "/profile" },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-card/40 backdrop-blur-2xl border-r border-white/5 relative z-20">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
              <span className="font-bold text-white text-lg leading-none">N</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">NeoBank</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-6">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group
                  ${isActive ? 'text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl border border-primary/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
                <span className="font-medium relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-4 flex items-center gap-3">
            <img 
              src={user?.avatarUrl || `${import.meta.env.BASE_URL}images/avatar.png`} 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover border border-white/10"
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop" }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.tier} Member</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className="absolute inset-0 bg-mesh opacity-30 z-0 pointer-events-none" />
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-background/80 backdrop-blur-md relative z-20">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="font-bold text-white">N</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-white">
              <Bell className="w-6 h-6" />
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar p-4 md:p-8">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl lg:hidden flex flex-col"
          >
            <div className="p-4 flex justify-end border-b border-white/5">
              <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2">
                <Menu className="w-6 h-6 rotate-90" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium ${location === item.path ? 'bg-primary/10 text-primary' : 'text-white'}`}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </Link>
              ))}
              <div className="pt-8 mt-8 border-t border-white/10">
                <button onClick={logout} className="flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium text-destructive w-full text-left">
                  <LogOut className="w-6 h-6" />
                  Sign Out
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
