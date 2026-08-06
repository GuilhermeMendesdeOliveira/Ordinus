import type { ClientRow } from "@/components/dashboard/DashboardTable";

const DEFAULT_CLIENTS: ClientRow[] = [
  {
    id: "1",
    client: "Construtora Vale Norte",
    matter: "0021458-77.2026",
    status: { label: "Em andamento", tone: "success" },
    date: "28 jul 2026",
    owner: "Dr. Rafael Mendes",
  },
  {
    id: "2",
    client: "Instituto Villa Bela",
    matter: "0018723-04.2026",
    status: { label: "Aguardando", tone: "warning" },
    date: "26 jul 2026",
    owner: "Dra. Helena Aragão",
  },
  {
    id: "3",
    client: "Grupo Aurora Holdings",
    matter: "0014902-31.2026",
    status: { label: "Prazo crítico", tone: "danger" },
    date: "24 jul 2026",
    owner: "Dr. Vitor Salles",
  },
  {
    id: "4",
    client: "Marina Duarte Participações",
    matter: "0011684-59.2026",
    status: { label: "Em andamento", tone: "success" },
    date: "21 jul 2026",
    owner: "Dra. Camila Reis",
  },
];

const LOCAL_STORAGE_KEY = "ordinus_clients";

export function getStoredClients(): ClientRow[] {
  if (typeof window === "undefined") return DEFAULT_CLIENTS;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_CLIENTS));
    return DEFAULT_CLIENTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_CLIENTS;
  }
}

export function setStoredClients(clients: ClientRow[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clients));
  }
}
