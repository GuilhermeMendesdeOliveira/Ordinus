import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiClient } from "./api-client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "advogado" | "estagiario";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<Pick<User, 'name' | 'email'>>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Skip staff auth check on portal pages
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/portal')) {
        setIsLoading(false);
        return;
      }

      if (apiClient.isAuthenticated()) {
        try {
          const result = await apiClient.getMe();
          if (result.success && result.data) {
            setUser(result.data.user ?? result.data);
          } else {
            apiClient.clearTokens();
          }
        } catch {
          apiClient.clearTokens();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await apiClient.login(email, password);

    if (result.success && result.data) {
      const raw = result.data.user ?? result.data;
      const loggedInUser: User = {
        id: raw.id,
        name: raw.name,
        email: raw.email,
        role: raw.role,
        avatar: raw.avatar,
      };
      setUser(loggedInUser);
      return true;
    }

    return false;
  };

  const logout = async () => {
    setUser(null);
    await apiClient.logout();
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const updateUser = (data: Partial<Pick<User, 'name' | 'email'>>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...data };
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser, isLoading }}>
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
