import { apiClient } from './api-client';

export type NotificationType = "contract" | "process" | "deadline" | "info";

export interface ClientNotification {
  id: string;
  clientId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string | undefined;
}

interface BackendNotification {
  id: string;
  recipient_type: string;
  recipient_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  created_at: string;
}

function mapNotification(raw: BackendNotification): ClientNotification {
  return {
    id: raw.id,
    clientId: raw.recipient_id,
    type: raw.type,
    title: raw.title,
    message: raw.message,
    read: raw.read,
    createdAt: raw.created_at,
    link: raw.link,
  };
}

export async function fetchNotifications(clientId: string): Promise<ClientNotification[]> {
  const result = await apiClient.get<BackendNotification[]>(
    '/portal/notifications',
    { recipient_id: clientId }
  );

  if (!result.success || !result.data) {
    return [];
  }

  return result.data
    .map(mapNotification)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await apiClient.patch(`/portal/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await apiClient.patch('/portal/notifications/read-all');
}

export async function fetchUnreadCount(): Promise<number> {
  const result = await apiClient.get<{ count: number }>('/portal/notifications/unread-count');

  if (!result.success || !result.data) {
    return 0;
  }

  return result.data.count;
}
