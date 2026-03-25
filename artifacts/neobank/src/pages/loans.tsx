import { AppLayout } from "@/components/layout";
import { useGetLoanProducts, useSimulateLoan } from "@workspace/api-client-react";
import { useState, useEffect } from "react";
import { Briefcase, Info, Check, Calculator } from "lucide-react";
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

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Loan Products</h1>
        <p className="text-muted-foreground mt-1">Flexible financing tailored for your goals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Products List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-semibold text-white/80 uppercase tracking-wider text-sm mb-4">Available Offers</h3>
          {isLoading ? (
            <p className="text-muted-foreground">Loading products...</p>
          ) : (
            products?.map(p => (
              <div 
                key={p.id}
                onClick={() => setSelectedProductId(p.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedProductId === p.id 
                    ? 'bg-primary/10 border-primary shadow-[0_0_20px_-5px_rgba(0,229,255,0.3)]' 
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-white">{p.name}</h4>
                  <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-md capitalize">
                    {p.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{p.description}</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-white/40 block text-xs">Rate from</span>
                    <span className="font-bold text-emerald-400">{p.minRate}% APR</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-xs">Up to</span>
                    <span className="font-bold text-white">{formatCurrency(p.maxAmount)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Simulator */}
        <div className="lg:col-span-7">
          {selectedProduct && (
            <div className="glass-card rounded-3xl p-6 md:p-8 sticky top-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Loan Simulator</h2>
                  <p className="text-primary text-sm font-medium">{selectedProduct.name}</p>
                </div>
              </div>

              <div className="space-y-8 mb-8">
                {/* Amount Slider */}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-medium text-muted-foreground">I want to borrow</label>
                    <span className="text-2xl font-bold text-white bg-black/20 px-4 py-1 rounded-lg border border-white/5">
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
                  <div className="flex justify-between text-xs text-white/40 mt-2 font-mono">
                    <span>{formatCurrency(selectedProduct.minAmount)}</span>
                    <span>{formatCurrency(selectedProduct.maxAmount)}</span>
                  </div>
                </div>

                {/* Duration Slider */}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-medium text-muted-foreground">Duration</label>
                    <span className="text-2xl font-bold text-white bg-black/20 px-4 py-1 rounded-lg border border-white/5">
                      {duration} Months
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
                  <div className="flex justify-between text-xs text-white/40 mt-2 font-mono">
                    <span>{selectedProduct.minDurationMonths}m</span>
                    <span>{selectedProduct.maxDurationMonths}m</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              {simulateMutation.isPending && !simulationResult ? (
                <div className="p-8 text-center text-primary flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Calculating optimal rate...
                </div>
              ) : simulationResult ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-black/40 to-black/20 rounded-2xl p-6 border border-white/5"
                >
                  <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/5">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                      <h3 className="text-4xl font-extrabold text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                        {formatCurrency(simulationResult.monthlyPayment)}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Interest Rate</p>
                      <h3 className="text-2xl font-bold text-emerald-400">{simulationResult.annualRate}%</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <span className="text-muted-foreground block mb-1">Total Loan</span>
                      <span className="text-white font-medium">{formatCurrency(amount)}</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <span className="text-muted-foreground block mb-1">Total Interest</span>
                      <span className="text-white font-medium">{formatCurrency(simulationResult.totalInterest)}</span>
                    </div>
                  </div>

                  <button className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-lg shadow-lg shadow-primary/20">
                    Apply Now
                  </button>
                  <p className="text-center text-xs text-white/40 mt-4 flex items-center justify-center gap-1">
                    <Info className="w-3 h-3" /> No impact on your credit score to check rates.
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
