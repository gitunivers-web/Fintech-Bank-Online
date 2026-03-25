import { AppLayout } from "@/components/layout";
import { useGetAccountTransactions } from "@workspace/api-client-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, Filter, ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function Transactions() {
  const { data, isLoading } = useGetAccountTransactions("all", { limit: 50 });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1">Consultez et recherchez tout votre historique.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <button className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4" /> Filtres
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="p-4 pl-6">Transaction</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Date & Heure</th>
                <th className="p-4">Statut</th>
                <th className="p-4 pr-6 text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Chargement...</td>
                </tr>
              ) : data?.transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Aucune transaction trouvée.</td>
                </tr>
              ) : (
                data?.transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-background border border-white/10 flex items-center justify-center text-lg">
                          {tx.icon || "💸"}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{tx.merchant || tx.description}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">{tx.id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-xs text-white/80 capitalize">
                        {tx.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground capitalize">
                      {format(new Date(tx.date), 'dd MMM yyyy', { locale: fr })}<br/>
                      <span className="text-xs">{format(new Date(tx.date), 'HH:mm')}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        tx.status === 'completed' ? 'text-emerald-400' : 
                        tx.status === 'pending' ? 'text-amber-400' : 'text-destructive'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          tx.status === 'completed' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 
                          tx.status === 'pending' ? 'bg-amber-400' : 'bg-destructive'
                        }`} />
                        {tx.status === 'completed' ? 'Complété' : tx.status === 'pending' ? 'En attente' : 'Échoué'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`font-bold flex items-center gap-1 text-lg tracking-tight ${tx.type === 'credit' ? 'text-emerald-400' : 'text-white'}`}>
                          {tx.type === 'credit' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4 text-white/40" />}
                          {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-muted-foreground bg-black/20">
          <span>Affichage de 1 à {data?.transactions.length || 0} sur {data?.total || 0} entrées</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-50">Précédent</button>
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-md transition-colors">Suivant</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
