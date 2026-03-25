import { AppLayout } from "@/components/layout";
import { useGetAccounts } from "@workspace/api-client-react";
import { Wallet, Copy, ExternalLink, Activity, TrendingUp, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Accounts() {
  const { data: accounts, isLoading } = useGetAccounts();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("IBAN copié !");
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Vos Comptes</h1>
        <p className="text-muted-foreground mt-1">Gérez vos soldes et vos informations bancaires.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts?.map((acc) => (
          <div key={acc.id} className="glass-card rounded-3xl p-6 relative overflow-hidden group cursor-pointer border border-white/10 shadow-2xl">
            {/* dynamic gradient background */}
            <div 
              className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30 pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${acc.color || 'var(--primary)'}, transparent)` }}
            />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                {acc.isDefault && (
                  <span className="text-[10px] uppercase tracking-widest bg-primary/20 text-primary px-3 py-1.5 rounded-full font-bold border border-primary/20">
                    Principal
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-1">{acc.type === 'checking' ? 'Compte Courant' : 'Compte Épargne'}</p>
                <h3 className="text-2xl font-bold text-white mb-2">{acc.name}</h3>
                <div className="flex items-end gap-3">
                  <p className="text-3xl font-extrabold text-white">
                    {formatCurrency(acc.balance)}
                  </p>
                  <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-md mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+2.4%</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between group/iban">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">IBAN</p>
                  <p className="text-sm font-mono text-white/90 tracking-widest">
                    {acc.iban.replace(/(.{4})/g, '$1 ')}
                  </p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); copyToClipboard(acc.iban); }}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white" 
                  title="Copier l'IBAN"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm font-medium border border-white/10 transition-colors flex items-center justify-center gap-2 text-white">
                  <Activity className="w-4 h-4" /> Relevés
                </button>
                <button className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm font-medium border border-white/10 transition-colors flex items-center justify-center gap-2 text-white">
                  <ExternalLink className="w-4 h-4" /> Détails
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Open New Account Card */}
        <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors border-dashed border-white/20 min-h-[320px] group">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Ouvrir un nouveau compte</h3>
          <p className="text-muted-foreground text-sm max-w-[200px]">
            Ajoutez un compte d'épargne, courant ou professionnel en quelques secondes.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
