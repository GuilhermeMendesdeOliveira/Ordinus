import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiClient } from "./api-client";

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  cpfCnpj?: string;
}

interface ClientAuthContextType {
  client: ClientUser | null;
  isAuthenticated: boolean;
  login: (processNumber: string, cpfCnpj: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<ClientUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          const result = await apiClient.getPortalMe();
          if (result.success && result.data) {
            const raw = result.data.client ?? result.data;
            setClient({
              id: raw.id,
              name: raw.name ?? raw.client ?? "",
              email: raw.email ?? "",
              cpfCnpj: raw.cpfCnpj ?? raw.cpf_cnpj,
            });
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

  const login = async (processNumber: string, cpfCnpj: string): Promise<boolean> => {
    const result = await apiClient.portalLogin(processNumber, cpfCnpj);

    if (result.success && result.data) {
      const raw = result.data.client ?? result.data;
      const clientUser: ClientUser = {
        id: raw.id,
        name: raw.name ?? raw.client ?? "",
        email: raw.email ?? "",
        cpfCnpj: raw.cpfCnpj ?? raw.cpf_cnpj,
      };
      setClient(clientUser);
      return true;
    }

    return false;
  };

  const logout = async () => {
    setClient(null);
    await apiClient.portalLogout();
    // Redirect to portal login page
    if (typeof window !== 'undefined') {
      window.location.href = '/portal/login';
    }
  };

  return (
    <ClientAuthContext.Provider value={{ client, isAuthenticated: !!client, login, logout, isLoading }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
}
