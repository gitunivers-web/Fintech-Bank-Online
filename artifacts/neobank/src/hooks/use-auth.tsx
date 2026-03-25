import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useGetUserProfile, useDemoLogin, UserProfile } from "@workspace/api-client-react";
import { useLocation } from "wouter";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Try to fetch profile on mount to restore session
  const { data: profile, isLoading: isProfileLoading, isError } = useGetUserProfile({
    query: {
      retry: false,
      staleTime: Infinity,
    }
  });

  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, [profile]);

  const loginMutation = useDemoLogin();

  const login = async () => {
    try {
      const res = await loginMutation.mutateAsync();
      if (res.success && res.user) {
        setUser(res.user);
        setLocation("/dashboard");
      }
    } catch (error) {
      console.error("Login failed", error);
      // Fallback for demo purposes if backend is missing
      const mockUser: UserProfile = {
        id: "demo-123",
        firstName: "Alex",
        lastName: "Carter",
        email: "alex@neobank.demo",
        phone: "+1 555 0192",
        memberSince: new Date().toISOString(),
        tier: "premium",
      };
      setUser(mockUser);
      setLocation("/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    setLocation("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading: isProfileLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
