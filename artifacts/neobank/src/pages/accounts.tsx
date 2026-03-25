import { AppLayout } from "@/components/layout";
import { useGetAccounts } from "@workspace/api-client-react";
import { Wallet, Copy, ExternalLink, Activity } from "lucide-react";

export default function Accounts() {
  const { data: accounts, isLoading } = useGetAccounts();

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
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
        <h1 className="text-3xl font-bold text-white tracking-tight">Your Accounts</h1>
        <p className="text-muted-foreground mt-1">Manage your balances and banking details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts?.map((acc) => (
          <div key={acc.id} className="glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer">
            {/* dynamic gradient background based on color if provided, else fallback */}
            <div 
              className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20 pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${acc.color || 'var(--primary)'}, transparent)` }}
            />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/5">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                {acc.isDefault && (
                  <span className="text-[10px] uppercase tracking-widest bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">
                    Default
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-1">{acc.type} Account</p>
                <h3 className="text-2xl font-bold text-white">{acc.name}</h3>
                <p className="text-3xl font-extrabold text-white mt-2">
                  {formatCurrency(acc.balance, acc.currency)}
                </p>
              </div>
              
              <div className="p-4 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">IBAN</p>
                  <p className="text-sm font-mono text-white/90">{acc.iban}</p>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white" title="Copy IBAN">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-white/5 hover:bg-white/10 py-2.5 rounded-xl text-sm font-medium border border-white/10 transition-colors flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4" /> Statements
                </button>
                <button className="flex-1 bg-white/5 hover:bg-white/10 py-2.5 rounded-xl text-sm font-medium border border-white/10 transition-colors flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Details
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Open New Account Card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors border-dashed border-white/20 min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-3xl font-light text-primary">+</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Open new account</h3>
          <p className="text-muted-foreground text-sm max-w-[200px]">
            Add a savings, checking, or business account in seconds.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
