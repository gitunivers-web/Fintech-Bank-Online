import { AppLayout } from "@/components/layout";
import { useGetLoanProducts, useSimulateLoan } from "@workspace/api-client-react";
import { useState, useEffect } from "react";
import { Info, Calculator } from "lucide-react";
import { motion } from "framer-motion";

export default function Loans() {
  const { data: products, isLoading } = useGetLoanProducts();
  const simulateMutation = useSimulateLoan();
  
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [amount, setAmount] = useState(10000);
  const [duration, setDuration] = useState(24);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Set default product when loaded
  useEffect(() => {
    if (products && products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
      setAmount(products[0].minAmount * 2);
      setDuration(products[0].minDurationMonths * 2);
    }
  }, [products, selectedProductId]);

  const handleSimulate = async () => {
    if (!selectedProductId) return;
    try {
      const res = await simulateMutation.mutateAsync({
        data: {
          productId: selectedProductId,
          amount,
          durationMonths: duration
        }
      });
      setSimulationResult(res);
    } catch (e) {
      console.error(e);
    }
  };

  // Auto simulate on change (debounced manually for demo feel)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedProductId) {
        handleSimulate();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [amount, duration, selectedProductId]);

  const selectedProduct = products?.find(p => p.id === selectedProductId);

  const formatCurrency = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Crédits</h1>
        <p className="text-muted-foreground mt-1">Un financement flexible adapté à vos projets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Products List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-semibold text-white/80 uppercase tracking-wider text-sm mb-4">Offres Disponibles</h3>
          {isLoading ? (
            <p className="text-muted-foreground">Chargement des offres...</p>
          ) : (
            products?.map(p => (
              <div 
                key={p.id}
                onClick={() => setSelectedProductId(p.id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer ${
                  selectedProductId === p.id 
                    ? 'bg-primary/10 border-primary shadow-[0_0_30px_-10px_rgba(0,229,255,0.4)]' 
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold text-white">{p.name}</h4>
                  <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-md capitalize">
                    {p.type === 'personal' ? 'Personnel' : p.type === 'auto' ? 'Automobile' : 'Immobilier'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{p.description}</p>
                <div className="flex gap-6 text-sm bg-black/20 p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-white/40 block text-xs mb-1 uppercase tracking-wider">Taux dès</span>
                    <span className="font-bold text-emerald-400 text-lg">{p.minRate}% TAEG</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-xs mb-1 uppercase tracking-wider">Jusqu'à</span>
                    <span className="font-bold text-white text-lg">{formatCurrency(p.maxAmount)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Simulator */}
        <div className="lg:col-span-7">
          {selectedProduct && (
            <div className="glass-card rounded-3xl p-6 md:p-8 sticky top-8 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-lg">
                  <Calculator className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Simulateur de Crédit</h2>
                  <p className="text-primary text-sm font-medium uppercase tracking-wider mt-1">{selectedProduct.name}</p>
                </div>
              </div>

              <div className="space-y-10 mb-10">
                {/* Amount Slider */}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Montant souhaité</label>
                    <span className="text-3xl font-extrabold text-white bg-black/30 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min={selectedProduct.minAmount} 
                    max={selectedProduct.maxAmount} 
                    step={1000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-white/40 mt-3 font-mono font-medium">
                    <span>{formatCurrency(selectedProduct.minAmount)}</span>
                    <span>{formatCurrency(selectedProduct.maxAmount)}</span>
                  </div>
                </div>

                {/* Duration Slider */}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Durée</label>
                    <span className="text-3xl font-extrabold text-white bg-black/30 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
                      {duration} Mois
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min={selectedProduct.minDurationMonths} 
                    max={selectedProduct.maxDurationMonths} 
                    step={6}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-white/40 mt-3 font-mono font-medium">
                    <span>{selectedProduct.minDurationMonths}m</span>
                    <span>{selectedProduct.maxDurationMonths}m</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              {simulateMutation.isPending && !simulationResult ? (
                <div className="p-8 text-center text-primary flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Calcul du meilleur taux...
                </div>
              ) : simulationResult ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-black/60 to-black/30 rounded-2xl p-8 border border-white/10 shadow-xl"
                >
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 pb-8 border-b border-white/10">
                    <div className="text-center md:text-left w-full md:w-auto">
                      <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider font-medium">Mensualité</p>
                      <h3 className="text-5xl font-extrabold text-primary drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                        {formatCurrency(simulationResult.monthlyPayment)}
                      </h3>
                    </div>
                    <div className="text-center md:text-right w-full md:w-auto bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-medium">Taux (TAEG)</p>
                      <h3 className="text-2xl font-bold text-emerald-400">{simulationResult.annualRate}%</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-muted-foreground block mb-1">Montant Total</span>
                      <span className="text-white font-bold text-lg">{formatCurrency(amount)}</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-muted-foreground block mb-1">Coût du Crédit</span>
                      <span className="text-white font-bold text-lg">{formatCurrency(simulationResult.totalInterest)}</span>
                    </div>
                  </div>

                  <button className="w-full py-5 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-lg shadow-[0_0_30px_-5px_rgba(0,229,255,0.4)]">
                    Demander ce crédit
                  </button>
                  <p className="text-center text-xs text-white/40 mt-6 flex items-center justify-center gap-1.5">
                    <Info className="w-4 h-4" /> La simulation n'impacte pas votre score de crédit.
                  </p>
                </motion.div>
              ) : null}

            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
