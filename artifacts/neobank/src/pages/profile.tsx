import { AppLayout } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { User, Mail, Phone, MapPin, Shield, Bell, CreditCard, Award } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-accent/20 z-0" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 pt-8">
            <div className="w-32 h-32 rounded-full p-1 bg-background border border-white/10 shadow-xl">
              <img 
                src={user.avatarUrl || `${import.meta.env.BASE_URL}images/avatar.png`} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop" }}
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h1 className="text-3xl font-bold text-white">{user.firstName} {user.lastName}</h1>
                <span className="bg-gradient-to-r from-amber-200 to-yellow-600 text-black text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3 h-3" /> {user.tier}
                </span>
              </div>
              <p className="text-muted-foreground">Member since {new Date(user.memberSince).getFullYear()}</p>
            </div>
            
            <button className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Personal Information */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-white px-2">Personal Information</h3>
            <div className="glass-card rounded-2xl p-6 divide-y divide-white/5">
              {[
                { icon: Mail, label: "Email Address", value: user.email },
                { icon: Phone, label: "Phone Number", value: user.phone },
                { icon: MapPin, label: "Address", value: user.address || "123 Financial District, Tech City" },
                { icon: User, label: "Customer ID", value: user.id },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="mt-0.5 text-muted-foreground">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings / Preferences */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white px-2">Preferences</h3>
            <div className="glass-card rounded-2xl p-4 space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Security</p>
                    <p className="text-xs text-muted-foreground">Password, 2FA</p>
                  </div>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Notifications</p>
                    <p className="text-xs text-muted-foreground">Push, Email, SMS</p>
                  </div>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Limits</p>
                    <p className="text-xs text-muted-foreground">Spending & ATM</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
