export type DeadlineType = "contestacao" | "audiencia" | "julgamento" | "recurso" | "pericia" | "outro";

export type DeadlineStatus = "pendente" | "concluido" | "atrasado";

export interface Deadline {
  id: string;
  processId: string;
  processNumber: string;
  clientName: string;
  title: string;
  description: string;
  type: DeadlineType;
  dueDate: string;
  status: DeadlineStatus;
  createdAt: string;
  notified?: boolean;
}

const DEFAULT_DEADLINES: Deadline[] = [];

const LOCAL_STORAGE_KEY = "ordinus_deadlines";

export function getStoredDeadlines(): Deadline[] {
  if (typeof window === "undefined") return DEFAULT_DEADLINES;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_DEADLINES));
    return DEFAULT_DEADLINES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_DEADLINES;
  }
}

export function setStoredDeadlines(deadlines: Deadline[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deadlines));
  }
}

export function getPendingDeadlines(): Deadline[] {
  const deadlines = getStoredDeadlines();
  return deadlines.filter((d) => d.status === "pendente");
}

export function getUpcomingDeadlines(days: number = 7): Deadline[] {
  const deadlines = getStoredDeadlines();
  const now = new Date();
  const limit = new Date();
  limit.setDate(limit.getDate() + days);

  return deadlines.filter((d) => {
    if (d.status !== "pendente") return false;
    const dueDate = new Date(d.dueDate);
    return dueDate >= now && dueDate <= limit;
  });
}

export function getOverdueDeadlines(): Deadline[] {
  const deadlines = getStoredDeadlines();
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return deadlines.filter((d) => {
    if (d.status !== "pendente") return false;
    const dueDate = new Date(d.dueDate);
    return dueDate < now;
  });
}

export function getDeadlineTypeLabel(type: DeadlineType): string {
  switch (type) {
    case "contestacao":
      return "Contestacao";
    case "audiencia":
      return "Audiencia";
    case "julgamento":
      return "Julgamento";
    case "recurso":
      return "Recurso";
    case "pericia":
      return "Pericia";
    case "outro":
      return "Outro";
    default:
      return type;
  }
}

export function getDeadlineTypeColor(type: DeadlineType): string {
  switch (type) {
    case "contestacao":
      return "bg-red-500/10 text-red-500";
    case "audiencia":
      return "bg-purple-500/10 text-purple-500";
    case "julgamento":
      return "bg-orange-500/10 text-orange-500";
    case "recurso":
      return "bg-blue-500/10 text-blue-500";
    case "pericia":
      return "bg-cyan-500/10 text-cyan-500";
    case "outro":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getDaysUntilDue(dueDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
