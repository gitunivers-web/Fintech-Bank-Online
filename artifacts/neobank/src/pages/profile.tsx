import { AppLayout } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { User, Mail, Phone, MapPin, Shield, Bell, CreditCard, Award, Copy, Moon, Edit3, Fingerprint } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papiers !");
  };

  const userIban = "FR76 1234 5678 9012 3456 7890 123";

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/30 via-accent/20 to-transparent z-0" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 pt-8">
            <div className="w-32 h-32 rounded-full p-1.5 bg-background border border-white/20 shadow-2xl relative group">
              <img 
                src={user.avatarUrl || `${import.meta.env.BASE_URL}images/avatar.png`} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop" }}
              />
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground border-4 border-background opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left mb-2 md:mb-0">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white tracking-tight">{user.firstName} {user.lastName}</h1>
                <div className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                  <Award className="w-4 h-4" /> {user.tier} Member
                </div>
              </div>
              <p className="text-white/60 font-medium">Membre depuis {new Date(user.memberSince).getFullYear()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Personal Information */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold text-white">Informations Personnelles</h3>
              <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                <Edit3 className="w-4 h-4" /> Modifier
              </button>
            </div>
            
            <div className="glass-card rounded-3xl p-6 divide-y divide-white/5">
              {[
                { icon: Mail, label: "Adresse Email", value: user.email },
                { icon: Phone, label: "Numéro de téléphone", value: user.phone },
                { icon: MapPin, label: "Adresse postale", value: user.address || "123 Financial District, Tech City" },
                { icon: User, label: "ID Client", value: user.id },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 py-5 first:pt-2 last:pb-2">
                  <div className="mt-0.5 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground border border-white/5">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-white font-medium text-lg">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Informations Bancaires</h3>
              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between group">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-medium">Votre IBAN Principal</p>
                  <p className="text-lg font-mono text-white tracking-widest">{userIban}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(userIban)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white" 
                  title="Copier l'IBAN"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Settings / Preferences */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white px-2">Paramètres</h3>
            
            <div className="space-y-4">
              {/* Security */}
              <div className="glass-card rounded-3xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-bold">Sécurité</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Fingerprint className="w-4 h-4 text-emerald-400" />
                      Authentification (2FA)
                    </div>
                    <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" />
                    </div>
                  </div>
                  <button className="w-full text-left text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                    Changer le mot de passe
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div className="glass-card rounded-3xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-bold">Notifications</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">Push Mobile</span>
                    <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">Alertes Email</span>
                    <div className="w-10 h-6 bg-white/10 rounded-full relative cursor-pointer border border-white/10">
                      <div className="w-4 h-4 bg-white/50 rounded-full absolute left-1 top-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div className="glass-card rounded-3xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-bold">Apparence</h4>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Mode Sombre</span>
                  <div className="w-10 h-6 bg-indigo-500 rounded-full relative cursor-not-allowed opacity-80">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
