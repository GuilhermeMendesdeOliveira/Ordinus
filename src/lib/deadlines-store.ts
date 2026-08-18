import { apiClient } from './api-client';

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

interface BackendDeadline {
  id: string;
  process_id: string;
  process: {
    process_number: string;
    client: {
      name: string;
    };
  };
  title: string;
  description: string;
  type: DeadlineType;
  due_date: string;
  status: DeadlineStatus;
  created_at: string;
}

function mapDeadline(raw: BackendDeadline): Deadline {
  return {
    id: raw.id,
    processId: raw.process_id,
    processNumber: raw.process.process_number,
    clientName: raw.process.client.name,
    title: raw.title,
    description: raw.description,
    type: raw.type,
    dueDate: raw.due_date,
    status: raw.status,
    createdAt: raw.created_at,
  };
}

export async function fetchDeadlines(): Promise<Deadline[]> {
  const result = await apiClient.get<BackendDeadline[]>('/deadlines');

  if (!result.success || !result.data) {
    return [];
  }

  return result.data.map(mapDeadline);
}

export async function fetchPendingDeadlines(): Promise<Deadline[]> {
  const result = await apiClient.get<BackendDeadline[]>('/deadlines', { status: 'pendente' });

  if (!result.success || !result.data) {
    return [];
  }

  return result.data.map(mapDeadline);
}

export async function fetchUpcomingDeadlines(): Promise<Deadline[]> {
  const result = await apiClient.get<BackendDeadline[]>('/deadlines/upcoming');

  if (!result.success || !result.data) {
    return [];
  }

  return result.data.map(mapDeadline);
}

export async function fetchOverdueDeadlines(): Promise<Deadline[]> {
  const result = await apiClient.get<BackendDeadline[]>('/deadlines/overdue');

  if (!result.success || !result.data) {
    return [];
  }

  return result.data.map(mapDeadline);
}

export async function saveDeadline(deadline: Deadline): Promise<Deadline | null> {
  const result = await apiClient.post<BackendDeadline>('/deadlines', {
    process_id: deadline.processId,
    title: deadline.title,
    description: deadline.description,
    type: deadline.type,
    due_date: deadline.dueDate,
    status: deadline.status,
  });

  if (!result.success || !result.data) {
    console.error("Failed to save deadline:", result.error?.message);
    return null;
  }

  return mapDeadline(result.data);
}

export async function updateDeadline(id: string, data: Partial<Deadline>): Promise<Deadline | null> {
  const result = await apiClient.put<BackendDeadline>(`/deadlines/${id}`, {
    title: data.title,
    description: data.description,
    type: data.type,
    due_date: data.dueDate,
    status: data.status,
  });

  if (!result.success || !result.data) {
    console.error("Failed to update deadline:", result.error?.message);
    return null;
  }

  return mapDeadline(result.data);
}

export async function deleteDeadline(id: string): Promise<boolean> {
  const result = await apiClient.delete(`/deadlines/${id}`);
  if (!result.success) {
    console.error("Failed to delete deadline:", result.error?.message);
    return false;
  }
  return true;
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
