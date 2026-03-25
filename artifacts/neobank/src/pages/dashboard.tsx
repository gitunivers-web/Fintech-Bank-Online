import { AppLayout } from "@/components/layout";
import { useGetUserStats, useGetAccountTransactions, useGetAccounts } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ArrowUpRight, ArrowDownLeft, Plus, Send, CreditCard, Clock, Activity, Download, Smartphone, Wallet } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGetUserStats();
  const { data: accountsData } = useGetAccounts();
  // using a static account ID "all" for demo dashboard overview
  const { data: txData } = useGetAccountTransactions("all", { limit: 5 });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  if (statsLoading || !stats) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const defaultAccount = accountsData?.find(a => a.isDefault) || accountsData?.[0];

  return (
    <AppLayout>
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Bienvenue, {user?.firstName}</h1>
            <p className="text-muted-foreground capitalize">{today}</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">
              <Download className="w-4 h-4" /> Relevé
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> Ajouter de l'argent
            </button>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Send, label: "Virement", color: "text-blue-400", bg: "bg-blue-400/10" },
            { icon: Plus, label: "Recharge", color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { icon: Smartphone, label: "Payer", color: "text-purple-400", bg: "bg-purple-400/10" },
            { icon: Wallet, label: "Épargner", color: "text-amber-400", bg: "bg-amber-400/10" }
          ].map((action, i) => (
            <button key={i} className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition-all group">
              <div className={`w-12 h-12 rounded-full ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <span className="font-medium text-white text-sm">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 col-span-1 md:col-span-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-32 h-32 text-primary" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">Solde Total</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              {formatCurrency(stats.totalBalance)}
            </h2>
            
            <div className="flex gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> Revenus
                </p>
                <p className="text-lg font-semibold text-white">{formatCurrency(stats.monthlyIncome)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4 text-destructive" /> Dépenses
                </p>
                <p className="text-lg font-semibold text-white">{formatCurrency(stats.monthlyExpenses)}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent z-0 pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-auto">
                <p className="text-muted-foreground font-medium">Compte Principal</p>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
              </div>
              {defaultAccount ? (
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-white">{defaultAccount.name}</h3>
                  <p className="text-white/60 font-mono text-sm tracking-widest mt-1 mb-4">{defaultAccount.iban}</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(defaultAccount.balance)}</p>
                </div>
              ) : (
                <p className="text-muted-foreground mt-4">Aucun compte trouvé.</p>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Évolution du Solde</h3>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none">
                <option>30 Derniers Jours</option>
                <option>3 Derniers Mois</option>
                <option>Cette Année</option>
              </select>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.balanceHistory} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => format(new Date(val), 'd MMM', { locale: fr })} />
                  <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    formatter={(val: number) => [formatCurrency(val), 'Solde']}
                    labelFormatter={(label) => format(new Date(label), 'd MMMM yyyy', { locale: fr })}
                  />
                  <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Analyse des Dépenses</h3>
            <div className="flex-1 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.spendingByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {stats.spendingByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: number) => formatCurrency(val)}
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }}
                  />
                  <Legend layout="vertical" verticalAlign="middle" align="right" 
                    formatter={(value, entry: any) => <span className="text-white/80 text-xs ml-1">{value}</span>}
                    wrapperStyle={{ paddingLeft: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none md:mr-[100px] lg:mr-[120px]">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider">Total</span>
                <span className="text-white font-bold text-sm">{formatCurrency(stats.monthlyExpenses)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Transactions Récentes
            </h3>
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              Voir Tout
            </button>
          </div>
          
          <div className="space-y-4">
            {txData?.transactions?.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl shadow-inner border border-white/5">
                    {tx.icon || "💸"}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{tx.merchant || tx.description}</p>
                    <p className="text-xs text-muted-foreground capitalize">{format(new Date(tx.date), 'd MMM', { locale: fr })} • {tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-white'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
