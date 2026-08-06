import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

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
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: "1",
    name: "Jeniffer Lemes",
    email: "jeniffer@advocacia.com",
    password: "123456",
    role: "admin",
  },
  {
    id: "2",
    name: "Rafael Mendes",
    email: "rafael@advocacia.com",
    password: "123456",
    role: "advogado",
  },
  {
    id: "3",
    name: "Helena Aragao",
    email: "helena@advocacia.com",
    password: "123456",
    role: "advogado",
  },
  {
    id: "4",
    name: "Vitor Salles",
    email: "vitor@advocacia.com",
    password: "123456",
    role: "estagiario",
  },
];

const AUTH_STORAGE_KEY = "ordinus_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
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

export function getMockUsers() {
  return MOCK_USERS.map(({ password, ...user }) => user);
}
