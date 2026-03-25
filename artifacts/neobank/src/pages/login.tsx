import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Fingerprint } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background FX */}
      <div className="absolute inset-0 bg-mesh opacity-40 z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-8 md:p-12 rounded-[2rem] w-full max-w-md relative z-10 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
          <span className="font-bold text-white text-3xl">N</span>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground mb-8">Access your premium financial dashboard.</p>

        <div className="space-y-4">
          <button 
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>Authenticating <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /></>
              ) : (
                <>Enter Interactive Demo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </button>
          
          <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> No actual credentials required
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mb-4">
            <Fingerprint className="w-8 h-8" />
          </div>
          <p className="text-xs text-white/40 max-w-xs mx-auto">
            This is a mock application demonstrating complex fintech UI patterns and data visualization.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
