import { AppLayout } from "@/components/layout";
import { useGetSavingsGoals } from "@workspace/api-client-react";
import { Target, Plus, ChevronRight } from "lucide-react";

export default function Savings() {
  const { data: goals, isLoading } = useGetSavingsGoals();

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Savings Goals</h1>
          <p className="text-muted-foreground mt-1">Automate your savings and reach your targets faster.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 font-medium transition-all border border-white/10">
          <Plus className="w-4 h-4" /> Create Goal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-1 lg:col-span-2 p-12 text-center text-muted-foreground">Loading...</div>
        ) : goals?.map((goal) => {
          const progress = Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100));
          
          return (
            <div key={goal.id} className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden group cursor-pointer">
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${goal.color}, transparent 70%)` }}
              />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg" style={{ backgroundColor: `${goal.color}20`, borderColor: `${goal.color}40` }}>
                    <Target className="w-7 h-7" style={{ color: goal.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{goal.category}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <ChevronRight className="w-4 h-4 text-white/60" />
                </div>
              </div>

              <div className="mb-4 relative z-10">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-3xl font-extrabold text-white">{formatCurrency(goal.currentAmount)}</p>
                  <p className="text-sm font-medium text-muted-foreground">of {formatCurrency(goal.targetAmount)}</p>
                </div>
                
                {/* Progress Bar */}
                <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%`, backgroundColor: goal.color }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs font-bold" style={{ color: goal.color }}>{progress.toFixed(1)}%</span>
                  <span className="text-xs text-white/40">Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              </div>

              {goal.autoSaveAmount && goal.autoSaveFrequency !== 'none' && (
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-sm relative z-10">
                  <span className="text-muted-foreground">Auto-save is active</span>
                  <span className="text-white font-medium bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                    +{formatCurrency(goal.autoSaveAmount)} / {goal.autoSaveFrequency}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
