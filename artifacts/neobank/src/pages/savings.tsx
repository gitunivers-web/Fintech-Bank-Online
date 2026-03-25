import { AppLayout } from "@/components/layout";
import { useGetSavingsGoals } from "@workspace/api-client-react";
import { Target, Plus, ChevronRight, TrendingUp, Trophy, ArrowRight } from "lucide-react";

export default function Savings() {
  const { data: goals, isLoading } = useGetSavingsGoals();

  const formatCurrency = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const totalSaved = goals?.reduce((acc, goal) => acc + goal.currentAmount, 0) || 0;
  const totalTarget = goals?.reduce((acc, goal) => acc + goal.targetAmount, 0) || 0;
  const completedGoals = goals?.filter(g => g.currentAmount >= g.targetAmount).length || 0;

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Vos Épargnes</h1>
          <p className="text-muted-foreground mt-1">Automatisez vos économies et atteignez vos objectifs plus vite.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 font-medium transition-all border border-white/10">
          <Plus className="w-4 h-4" /> Créer un objectif
        </button>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Épargné</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalSaved)}</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
            <Trophy className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Objectifs Atteints</p>
            <p className="text-2xl font-bold text-white">{completedGoals} sur {goals?.length || 0}</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Rendement Moyen</p>
            <p className="text-2xl font-bold text-white">4.2%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-1 lg:col-span-2 p-12 text-center text-muted-foreground">Chargement...</div>
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
                <div className="flex justify-between items-end mb-3">
                  <p className="text-3xl font-extrabold text-white">{formatCurrency(goal.currentAmount)}</p>
                  <p className="text-sm font-medium text-muted-foreground">sur {formatCurrency(goal.targetAmount)}</p>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out relative shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"
                    style={{ 
                      width: `${progress}%`, 
                      background: `linear-gradient(90deg, ${goal.color}80, ${goal.color})` 
                    }}
                  >
                    <div className="absolute inset-0 w-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-sm font-bold" style={{ color: goal.color }}>{progress.toFixed(1)}% complété</span>
                  <span className="text-xs text-white/40 font-medium bg-white/5 px-2 py-1 rounded-md">Cible: {new Date(goal.targetDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {goal.autoSaveAmount && goal.autoSaveFrequency !== 'none' && (
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-sm relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-muted-foreground">Épargne automatique active</span>
                  </div>
                  <span className="text-white font-medium bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1">
                    +{formatCurrency(goal.autoSaveAmount)} / {goal.autoSaveFrequency === 'monthly' ? 'mois' : 'sem'}
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
