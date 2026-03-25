import { AppLayout } from "@/components/layout";
import { useCreateTransfer, useGetAccounts } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Wallet, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const transferSchema = z.object({
  fromAccountId: z.string().min(1, "Select an account"),
  toIban: z.string().min(10, "Valid IBAN is required"),
  toName: z.string().min(2, "Recipient name is required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  currency: z.string().default("USD"),
  description: z.string().optional(),
});

type TransferForm = z.infer<typeof transferSchema>;

export default function Transfers() {
  const { data: accounts } = useGetAccounts();
  const transferMutation = useCreateTransfer();
  const [successData, setSuccessData] = useState<any>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      currency: "USD",
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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-4 border border-primary/20">
            <ArrowRight className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Send Money</h1>
          <p className="text-muted-foreground mt-2">Instant transfers anywhere in the world.</p>
        </div>

        {successData ? (
          <div className="glass-card rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 z-0 pointer-events-none" />
            <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-6 relative z-10" />
            <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Transfer Successful</h2>
            <p className="text-muted-foreground mb-8 relative z-10">
              You sent {formatCurrency(successData.amount)} to <strong className="text-white">{successData.recipient}</strong>.
            </p>
            <div className="p-4 bg-black/20 rounded-xl mb-8 border border-white/5 relative z-10">
              <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
              <p className="font-mono text-white/80 text-sm">{successData.transactionId}</p>
            </div>
            <button 
              onClick={() => setSuccessData(null)}
              className="w-full py-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 relative z-10"
            >
              Send Another Transfer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
            
            {/* From Account */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80 ml-1">From Account</label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <select 
                  {...register("fromAccountId")}
                  className="w-full bg-background/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white appearance-none outline-none focus:border-primary/50 transition-colors cursor-pointer"
                >
                  <option value="" disabled className="bg-background">Select Account</option>
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
                <label className="text-sm font-medium text-white/80 ml-1">Recipient Name</label>
                <input 
                  {...register("toName")}
                  placeholder="e.g. John Doe"
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                />
                {errors.toName && <p className="text-destructive text-sm px-1">{errors.toName.message}</p>}
              </div>

              {/* IBAN */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80 ml-1">Recipient IBAN</label>
                <input 
                  {...register("toIban")}
                  placeholder="e.g. US12 3456 7890"
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-4 text-white font-mono outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                />
                {errors.toIban && <p className="text-destructive text-sm px-1">{errors.toIban.message}</p>}
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <label className="text-sm font-medium text-white/80 ml-1">Amount</label>
              <div className="relative flex items-center">
                <span className="absolute left-6 text-2xl font-light text-white/40">$</span>
                <input 
                  type="number"
                  step="0.01"
                  {...register("amount")}
                  placeholder="0.00"
                  className="w-full bg-background/50 border border-white/10 rounded-xl pl-12 pr-20 py-6 text-3xl font-bold text-white outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
                />
                <span className="absolute right-6 text-muted-foreground font-semibold bg-white/5 px-3 py-1 rounded-lg border border-white/10">USD</span>
              </div>
              {errors.amount && <p className="text-destructive text-sm px-1">{errors.amount.message}</p>}
              {selectedAccount && (
                <p className="text-sm text-muted-foreground text-right px-1">
                  Available: <span className="text-white">{formatCurrency(selectedAccount.balance)}</span>
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3 pt-2">
              <label className="text-sm font-medium text-white/80 ml-1">Description (Optional)</label>
              <input 
                {...register("description")}
                placeholder="What's this for?"
                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
              />
            </div>

            <button 
              type="submit"
              disabled={transferMutation.isPending}
              className="w-full mt-6 py-5 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_20px_-5px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_-5px_rgba(0,229,255,0.6)] flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:hover:shadow-[0_0_20px_-5px_rgba(0,229,255,0.4)]"
            >
              {transferMutation.isPending ? "Processing..." : "Send Securely"}
              {!transferMutation.isPending && <ArrowRight className="w-5 h-5" />}
            </button>
            {transferMutation.isError && (
              <p className="text-destructive text-center text-sm mt-4 bg-destructive/10 py-2 rounded-lg">
                Transfer failed. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </AppLayout>
  );
}
