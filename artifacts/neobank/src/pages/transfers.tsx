import { AppLayout } from "@/components/layout";
import { useCreateTransfer, useGetAccounts } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Wallet, CheckCircle2, Users } from "lucide-react";
import { useState } from "react";

const transferSchema = z.object({
  fromAccountId: z.string().min(1, "Sélectionnez un compte"),
  toIban: z.string().min(10, "IBAN valide requis"),
  toName: z.string().min(2, "Nom du bénéficiaire requis"),
  amount: z.coerce.number().min(1, "Le montant doit être supérieur à 0"),
  currency: z.string().default("EUR"),
  description: z.string().optional(),
});

type TransferForm = z.infer<typeof transferSchema>;

const RECENT_BENEFICIARIES = [
  { initials: "JD", name: "Jean Dupont", iban: "FR76 1234 5678 9012 3456", color: "bg-blue-500" },
  { initials: "SM", name: "Sophie Martin", iban: "FR76 9876 5432 1098 7654", color: "bg-purple-500" },
  { initials: "PB", name: "Pierre Bernard", iban: "FR76 1111 2222 3333 4444", color: "bg-emerald-500" },
  { initials: "LR", name: "Laura Rousseau", iban: "FR76 5555 6666 7777 8888", color: "bg-amber-500" },
];

export default function Transfers() {
  const { data: accounts } = useGetAccounts();
  const transferMutation = useCreateTransfer();
  const [successData, setSuccessData] = useState<any>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      currency: "EUR",
    }
  });

  const selectedAccountId = watch("fromAccountId");
  const selectedAccount = accounts?.find(a => a.id === selectedAccountId);

  const onSubmit = async (data: TransferForm) => {
    try {
      const res = await transferMutation.mutateAsync({ data });
      if (res.success) {
        setSuccessData({ ...res, amount: data.amount, recipient: data.toName });
        reset();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleBeneficiaryClick = (ben: any) => {
    setValue("toName", ben.name);
    setValue("toIban", ben.iban);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-4 border border-primary/20">
            <ArrowRight className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Effectuer un Virement</h1>
          <p className="text-muted-foreground mt-2">Virements instantanés partout dans le monde.</p>
        </div>

        {successData ? (
          <div className="glass-card rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 z-0 pointer-events-none" />
            <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-6 relative z-10" />
            <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Virement Réussi</h2>
            <p className="text-muted-foreground mb-8 relative z-10">
              Vous avez envoyé {formatCurrency(successData.amount)} à <strong className="text-white">{successData.recipient}</strong>.
            </p>
            <div className="p-4 bg-black/20 rounded-xl mb-8 border border-white/5 relative z-10">
              <p className="text-sm text-muted-foreground mb-1">ID de Transaction</p>
              <p className="font-mono text-white/80 text-sm">{successData.transactionId}</p>
            </div>
            <button 
              onClick={() => setSuccessData(null)}
              className="w-full py-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 relative z-10"
            >
              Faire un autre virement
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Recent Beneficiaries */}
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-white font-medium">Bénéficiaires Récents</h3>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {RECENT_BENEFICIARIES.map((ben, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleBeneficiaryClick(ben)}
                    className="flex flex-col items-center gap-2 min-w-[72px] hover:-translate-y-1 transition-transform group"
                  >
                    <div className={`w-14 h-14 rounded-full ${ben.color} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:ring-2 ring-white/20`}>
                      {ben.initials}
                    </div>
                    <span className="text-xs text-white/80 font-medium truncate w-full text-center">{ben.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
              
              {/* From Account */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80 ml-1">Compte Source</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <select 
                    {...register("fromAccountId")}
                    className="w-full bg-background/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white appearance-none outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="" disabled className="bg-background">Sélectionner un compte</option>
                    {accounts?.map(acc => (
                      <option key={acc.id} value={acc.id} className="bg-background">
                        {acc.name} - {formatCurrency(acc.balance)}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.fromAccountId && <p className="text-destructive text-sm px-1">{errors.fromAccountId.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recipient Name */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/80 ml-1">Nom du Bénéficiaire</label>
                  <input 
                    {...register("toName")}
                    placeholder="ex. Jean Dupont"
                    className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                  />
                  {errors.toName && <p className="text-destructive text-sm px-1">{errors.toName.message}</p>}
                </div>

                {/* IBAN */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/80 ml-1">IBAN du Bénéficiaire</label>
                  <input 
                    {...register("toIban")}
                    placeholder="ex. FR76 1234..."
                    className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-4 text-white font-mono outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                  />
                  {errors.toIban && <p className="text-destructive text-sm px-1">{errors.toIban.message}</p>}
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <label className="text-sm font-medium text-white/80 ml-1">Montant</label>
                <div className="relative flex items-center">
                  <input 
                    type="number"
                    step="0.01"
                    {...register("amount")}
                    placeholder="0.00"
                    className="w-full bg-background/50 border border-white/10 rounded-xl pl-6 pr-20 py-6 text-3xl font-bold text-white outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
                  />
                  <span className="absolute right-6 text-2xl font-light text-white/40">€</span>
                </div>
                {errors.amount && <p className="text-destructive text-sm px-1">{errors.amount.message}</p>}
                {selectedAccount && (
                  <p className="text-sm text-muted-foreground text-right px-1">
                    Disponible: <span className="text-white">{formatCurrency(selectedAccount.balance)}</span>
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-medium text-white/80 ml-1">Motif (Optionnel)</label>
                <input 
                  {...register("description")}
                  placeholder="ex. Remboursement resto"
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                />
              </div>

              <button 
                type="submit"
                disabled={transferMutation.isPending}
                className="w-full mt-6 py-5 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_20px_-5px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_-5px_rgba(0,229,255,0.6)] flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:hover:shadow-[0_0_20px_-5px_rgba(0,229,255,0.4)]"
              >
                {transferMutation.isPending ? "Traitement..." : "Envoyer Sécurisé"}
                {!transferMutation.isPending && <ArrowRight className="w-5 h-5" />}
              </button>
              {transferMutation.isError && (
                <p className="text-destructive text-center text-sm mt-4 bg-destructive/10 py-2 rounded-lg">
                  Le virement a échoué. Veuillez réessayer.
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
