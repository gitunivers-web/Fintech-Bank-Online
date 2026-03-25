import { AppLayout } from "@/components/layout";
import { useGetCards } from "@workspace/api-client-react";
import { CreditCard, Lock, Unlock, Eye, Settings, Plus, Wifi } from "lucide-react";
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

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Cards</h1>
          <p className="text-muted-foreground mt-1">Manage physical and virtual debit cards.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" /> Get New Card
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit mb-8">
        <button 
          onClick={() => setActiveTab('physical')}
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'physical' ? 'bg-white/10 text-white shadow-sm' : 'text-muted-foreground hover:text-white'}`}
        >
          Physical Cards
        </button>
        <button 
          onClick={() => setActiveTab('virtual')}
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'virtual' ? 'bg-white/10 text-white shadow-sm' : 'text-muted-foreground hover:text-white'}`}
        >
          Virtual Cards
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading cards...</div>
        ) : filteredCards.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center col-span-1 xl:col-span-2">
            <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No {activeTab} cards found</h3>
            <p className="text-muted-foreground">You don't have any active {activeTab} cards at the moment.</p>
          </div>
        ) : (
          filteredCards.map((card) => (
            <div key={card.id} className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch bg-card/40 rounded-3xl p-6 border border-white/5 shadow-2xl">
              
              {/* Premium Card UI */}
              <motion.div 
                whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
                className="w-[340px] h-[215px] rounded-2xl relative overflow-hidden shadow-2xl shadow-black/50 border border-white/20 shrink-0"
                style={{
                  backgroundImage: `url(${import.meta.env.BASE_URL}images/card-texture.png)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className={`absolute inset-0 opacity-40 mix-blend-overlay ${card.color ? '' : 'bg-gradient-to-br from-primary to-accent'}`} style={card.color ? { backgroundColor: card.color } : {}} />
                
                {card.isLocked && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                    <Lock className="w-10 h-10 text-white/80 mb-2" />
                    <span className="font-bold tracking-wider uppercase text-white/80">Card Locked</span>
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
                    <div className="font-mono text-lg tracking-[0.25em] text-white text-shadow-sm mb-2 drop-shadow-md">
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
              <div className="flex-1 flex flex-col justify-center space-y-3 w-full">
                <button 
                  onClick={() => toggleNumbers(card.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                >
                  <div className="flex items-center gap-3 text-white">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Show Card Details</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="flex items-center gap-3 text-white">
                    {card.isLocked ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-destructive" />}
                    <span className="font-medium">{card.isLocked ? 'Unlock Card' : 'Lock Card'}</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="flex items-center gap-3 text-white">
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Card Settings</span>
                  </div>
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}
