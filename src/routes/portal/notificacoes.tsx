import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, FileText, Briefcase, Clock, Info, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { ClientProtectedRoute } from "@/components/portal/ClientProtectedRoute";
import { ClientSidebar } from "@/components/portal/ClientSidebar";
import { ClientHeader } from "@/components/portal/ClientHeader";
import { useClientAuth } from "@/lib/client-auth-context";
import { useSidebar } from "@/lib/sidebar-context";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllAsRead,
  type ClientNotification,
} from "@/lib/notifications-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/portal/notificacoes")({
  component: PortalNotificacoesPage,
  head: () => ({
    meta: [
      { title: "Notificacoes | Portal do Cliente" },
      {
        name: "description",
        content: "Suas notificacoes e atualizacoes.",
      },
    ],
  }),
});

function PortalNotificacoesPage() {
  const { client } = useClientAuth();
  const { isCollapsed } = useSidebar();
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);

  useEffect(() => {
    if (client) {
      fetchNotifications(client.id).then(setNotifications);
    }
  }, [client]);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    if (client) {
      const data = await fetchNotifications(client.id);
      setNotifications(data);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (client) {
      await markAllAsRead();
      const data = await fetchNotifications(client.id);
      setNotifications(data);
      toast.success("Todas as notificacoes foram marcadas como lidas.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ClientProtectedRoute>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <ClientSidebar activeLabel="Notificacoes" />

        <div
          className="flex flex-col flex-1 min-w-0"
          style={{
            marginLeft: isCollapsed ? "76px" : "260px",
            transition: "margin-left 500ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ClientHeader
            title="Notificacoes"
            subtitle="Atualizacoes e comunicados do escritorio"
          />

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1440px] p-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl tracking-tight text-foreground">Notificacoes</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {unreadCount > 0
                        ? `Voce tem ${unreadCount} notificacao(oes) nao lida(s)`
                        : "Todas as notificacoes foram lidas"}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="gap-2"
                    >
                      <CheckCheck className="h-4 w-4" />
                      Marcar todas como lidas
                    </Button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground rounded-xl border border-dashed">
                    <Bell className="h-12 w-12 mb-4 opacity-40" />
                    <p className="text-lg font-medium">Nenhuma notificacao</p>
                    <p className="text-sm mt-1">Voce nao possui notificacoes no momento.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`rounded-xl border p-5 transition-all hover:shadow-sm cursor-pointer ${
                          !notification.read
                            ? "bg-gold/5 border-gold/20"
                            : "bg-card"
                        }`}
                        onClick={() => {
                          if (!notification.read) {
                            handleMarkAsRead(notification.id);
                          }
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <NotificationIcon type={notification.type} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                  {notification.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(notification.createdAt)}
                                </span>
                                {!notification.read && (
                                  <span className="h-2 w-2 rounded-full bg-gold" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ClientProtectedRoute>
  );
}

function NotificationIcon({ type }: { type: string }) {
  const config = {
    contract: { icon: FileText, className: "bg-blue-100 text-blue-600" },
    process: { icon: Briefcase, className: "bg-green-100 text-green-600" },
    deadline: { icon: Clock, className: "bg-red-100 text-red-600" },
    info: { icon: Info, className: "bg-gray-100 text-gray-600" },
  }[type] || { icon: Bell, className: "bg-gray-100 text-gray-600" };

  const Icon = config.icon;

  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${config.className}`}>
      <Icon className="h-5 w-5" />
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays} dias atras`;
  return date.toLocaleDateString("pt-BR");
}
