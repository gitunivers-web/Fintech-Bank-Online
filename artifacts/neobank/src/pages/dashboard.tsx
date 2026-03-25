import { AppLayout } from "@/components/layout";
import { useGetUserStats, useGetAccountTransactions, useGetAccounts } from "@workspace/api-client-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowUpRight, ArrowDownLeft, Plus, Send, CreditCard, Clock, Activity } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetUserStats();
  const { data: accountsData } = useGetAccounts();
  // using a static account ID "all" for demo dashboard overview
  const { data: txData } = useGetAccountTransactions("all", { limit: 5 });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

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
            <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
            <p className="text-muted-foreground">Here's what's happening with your money today.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">
              <Plus className="w-4 h-4" /> Add Money
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors shadow-lg shadow-primary/20">
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 col-span-1 md:col-span-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-32 h-32 text-primary" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">Total Balance</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              {formatCurrency(stats.totalBalance)}
            </h2>
            
            <div className="flex gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> Income
                </p>
                <p className="text-lg font-semibold text-white">{formatCurrency(stats.monthlyIncome)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4 text-destructive" /> Expenses
                </p>
                <p className="text-lg font-semibold text-white">{formatCurrency(stats.monthlyExpenses)}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent z-0 pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-auto">
                <p className="text-muted-foreground font-medium">Default Account</p>
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
                <p className="text-muted-foreground mt-4">No accounts found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Balance History</h3>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none">
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
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
                  <XAxis dataKey="date" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                  <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    formatter={(val: number) => [formatCurrency(val), 'Balance']}
                    labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                  />
                  <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Spending Analysis</h3>
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
                  >
                    {stats.spendingByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: number) => formatCurrency(val)}
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Total</span>
                <span className="text-white font-bold text-lg">{formatCurrency(stats.monthlyExpenses)}</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {stats.spendingByCategory.slice(0, 3).map((cat) => (
                <div key={cat.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-muted-foreground">{cat.category}</span>
                  </div>
                  <span className="text-white font-medium">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Recent Transactions
            </h3>
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View All
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
                    <p className="text-xs text-muted-foreground">{format(new Date(tx.date), 'MMM d, h:mm a')} • {tx.category}</p>
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
