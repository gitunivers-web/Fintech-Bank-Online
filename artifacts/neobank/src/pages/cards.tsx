import { AppLayout } from "@/components/layout";
import { useGetCards } from "@workspace/api-client-react";
import { CreditCard, Lock, Unlock, Eye, Settings, Plus, Wifi, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Cards() {
  const { data: cards, isLoading } = useGetCards();
  const [activeTab, setActiveTab] = useState<'physical' | 'virtual'>('physical');
  const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});

  const toggleNumbers = (id: string) => {
    setShowNumbers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCards = cards?.filter(c => c.type === activeTab) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getGradient = (index: number) => {
    const gradients = [
      "from-blue-600 to-indigo-900",
      "from-purple-600 to-pink-600",
      "from-slate-800 to-slate-900"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Vos Cartes</h1>
          <p className="text-muted-foreground mt-1">Gérez vos cartes physiques et virtuelles.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" /> Nouvelle Carte
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit mb-8">
        <button 
          onClick={() => setActiveTab('physical')}
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'physical' ? 'bg-white/10 text-white shadow-sm' : 'text-muted-foreground hover:text-white'}`}
        >
          Cartes Physiques
        </button>
        <button 
          onClick={() => setActiveTab('virtual')}
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'virtual' ? 'bg-white/10 text-white shadow-sm' : 'text-muted-foreground hover:text-white'}`}
        >
          Cartes Virtuelles
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Chargement des cartes...</div>
        ) : filteredCards.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center col-span-1 xl:col-span-2">
            <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aucune carte {activeTab} trouvée</h3>
            <p className="text-muted-foreground">Vous n'avez pas de carte {activeTab} active pour le moment.</p>
          </div>
        ) : (
          filteredCards.map((card, idx) => (
            <div key={card.id} className="bg-card/40 rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl flex flex-col gap-6">
              
              <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-center">
                {/* Premium Card UI */}
                <motion.div 
                  whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
                  className="w-[340px] h-[215px] rounded-2xl relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 shrink-0"
                  style={{
                    backgroundImage: `url(${import.meta.env.BASE_URL}images/card-texture.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className={`absolute inset-0 opacity-80 mix-blend-overlay bg-gradient-to-br ${getGradient(idx)}`} />
                  
                  {card.isLocked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                      <Lock className="w-10 h-10 text-white/80 mb-2" />
                      <span className="font-bold tracking-wider uppercase text-white/80">Carte Verrouillée</span>
                    </div>
                  )}

                  <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xl tracking-widest text-white drop-shadow-md">NEO</span>
                      <Wifi className="w-6 h-6 text-white/80 rotate-90" />
                    </div>
                    
                    <div className="mt-auto">
                      <div className="mb-4">
                        <div className="w-10 h-8 rounded bg-gradient-to-br from-amber-200 to-yellow-600 opacity-90 shadow-sm" />
                      </div>
                      <div className="font-mono text-lg tracking-[0.25em] text-white mb-2 drop-shadow-md">
                        {showNumbers[card.id] ? `4092 1249 9381 ${card.last4}` : `•••• •••• •••• ${card.last4}`}
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="uppercase tracking-wider text-sm font-medium text-white/90 drop-shadow-md">
                          {card.cardholderName}
                        </div>
                        <div className="font-mono text-sm text-white/90 drop-shadow-md">
                          {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear.toString().slice(-2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Card Controls */}
                <div className="flex-1 w-full grid grid-cols-2 lg:grid-cols-1 gap-3">
                  <button 
                    onClick={() => toggleNumbers(card.id)}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-white font-medium text-sm"
                  >
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span>Détails</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-white font-medium text-sm">
                    {card.isLocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-destructive" />}
                    <span>{card.isLocked ? 'Déverrouiller' : 'Verrouiller'}</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-white font-medium text-sm col-span-2 lg:col-span-1">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span>Paramètres</span>
                  </button>
                </div>
              </div>

              {/* Card Stats */}
              <div className="pt-6 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Limite Mensuelle</p>
                  <div className="flex justify-between text-sm font-medium text-white mb-2">
                    <span>{formatCurrency(1250)} utilisés</span>
                    <span className="text-white/50">{formatCurrency(3000)}</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '41%' }} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Cashback Cumulé</p>
                  <p className="text-lg font-bold text-emerald-400">{formatCurrency(45.50)}</p>
                </div>
                <div className="hidden md:block text-right">
                  <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors ml-auto">
                    <MoreHorizontal className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}
