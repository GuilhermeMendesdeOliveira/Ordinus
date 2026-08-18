import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Briefcase, Bell, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { ClientProtectedRoute } from "@/components/portal/ClientProtectedRoute";
import { ClientSidebar } from "@/components/portal/ClientSidebar";
import { ClientHeader } from "@/components/portal/ClientHeader";
import { useClientAuth } from "@/lib/client-auth-context";
import { useSidebar } from "@/lib/sidebar-context";
import { fetchPortalContracts } from "@/lib/contracts-store";
import { fetchPortalProcesses } from "@/lib/processes-store";
import { fetchNotifications } from "@/lib/notifications-store";
import type { Contract } from "@/types/contract";
import type { ProcessRow } from "@/lib/processes-store";
import type { ClientNotification } from "@/lib/notifications-store";

export const Route = createFileRoute("/portal/")({
  component: PortalDashboardPage,
  head: () => ({
    meta: [
      { title: "Portal do Cliente | Jeniffer Lemes Advocacia" },
      {
        name: "description",
        content: "Painel do cliente - acompanhe seus processos e contratos.",
      },
    ],
  }),
});

function PortalDashboardPage() {
  const { client } = useClientAuth();
  const { isCollapsed } = useSidebar();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [processes, setProcesses] = useState<ProcessRow[]>([]);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);

  useEffect(() => {
    if (client) {
      const loadData = async () => {
        const [contractsData, procs, notifs] = await Promise.all([
          fetchPortalContracts(),
          fetchPortalProcesses(),
          fetchNotifications(client.id),
        ]);
        setContracts(contractsData);
        setProcesses(procs);
        setNotifications(notifs.slice(0, 5));
      };
      loadData();
    }
  }, [client]);

  const pendingContracts = contracts.filter((c) => c.status === "final").length;
  const activeProcesses = processes.filter((p) => p.status.tone === "success").length;
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <ClientProtectedRoute>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <ClientSidebar activeLabel="Inicio" />

        <div
          className="flex flex-col flex-1 min-w-0"
          style={{
            marginLeft: isCollapsed ? "76px" : "260px",
            transition: "margin-left 500ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ClientHeader
            title={`Ola, ${client?.name || "Cliente"}`}
            subtitle="Bem-vindo ao seu portal"
          />

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1440px] p-6">
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-3xl tracking-tight text-foreground">Painel do Cliente</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Acompanhe seus contratos, processos e notificacoes.
                  </p>
                </div>

                {/* Metric cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  <MetricCard
                    icon={FileText}
                    label="Contratos Pendentes"
                    value={pendingContracts.toString()}
                    hint="Aguardando assinatura"
                  />
                  <MetricCard
                    icon={Briefcase}
                    label="Processos Ativos"
                    value={activeProcesses.toString()}
                    hint="Em andamento"
                  />
                  <MetricCard
                    icon={Bell}
                    label="Notificacoes"
                    value={unreadNotifications.toString()}
                    hint="Nao lidas"
                  />
                </div>

                {/* Recent contracts */}
                <section className="rounded-xl border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Contratos Recentes</h2>
                      <p className="text-sm text-muted-foreground">Seus contratos disponiveis</p>
                    </div>
                    <Link
                      to="/portal/contratos"
                      className="text-sm text-gold hover:text-gold-light transition-colors"
                    >
                      Ver todos
                    </Link>
                  </div>

                  {contracts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">Nenhum contrato encontrado</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contracts.slice(0, 3).map((contract) => (
                        <Link
                          key={contract.id}
                          to="/portal/contratos"
                          className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gold" />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {contract.clientName || "Contrato"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Atualizado em {new Date(contract.updatedAt).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                          <StatusPill status={contract.status} />
                        </Link>
                      ))}
                    </div>
                  )}
                </section>

                {/* Recent processes */}
                <section className="rounded-xl border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Seus Processos</h2>
                      <p className="text-sm text-muted-foreground">Acompanhe o andamento</p>
                    </div>
                    <Link
                      to="/portal/processos"
                      className="text-sm text-gold hover:text-gold-light transition-colors"
                    >
                      Ver todos
                    </Link>
                  </div>

                  {processes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">Nenhum processo encontrado</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {processes.slice(0, 3).map((process) => (
                        <Link
                          key={process.id}
                          to="/portal/processos"
                          className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-gold" />
                            <div>
                              <p className="text-sm font-medium text-foreground font-mono">
                                {process.processNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {process.area}
                              </p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            process.status.tone === "success"
                              ? "bg-green-100 text-green-700"
                              : process.status.tone === "warning"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {process.status.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>

                {/* Notifications */}
                <section className="rounded-xl border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Notificacoes Recentes</h2>
                      <p className="text-sm text-muted-foreground">Atualizacoes importantes</p>
                    </div>
                    <Link
                      to="/portal/notificacoes"
                      className="text-sm text-gold hover:text-gold-light transition-colors"
                    >
                      Ver todas
                    </Link>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-10 w-10 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">Nenhuma notificacao</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.slice(0, 3).map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start gap-3 rounded-lg border p-4 ${
                            !notification.read ? "bg-gold/5 border-gold/20" : ""
                          }`}
                        >
                          <NotificationIcon type={notification.type} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-gold shrink-0 mt-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ClientProtectedRoute>
  );
}

function MetricCard({ icon: Icon, label, value, hint }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
          <Icon className="h-6 w-6 text-gold" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const config = {
    draft: { label: "Rascunho", className: "bg-yellow-100 text-yellow-700" },
    final: { label: "Aguardando Assinatura", className: "bg-blue-100 text-blue-700" },
    signed: { label: "Assinado", className: "bg-green-100 text-green-700" },
  }[status] || { label: status, className: "bg-gray-100 text-gray-700" };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

function NotificationIcon({ type }: { type: string }) {
  const icons = {
    contract: FileText,
    process: Briefcase,
    deadline: Clock,
    info: Bell,
  };
  const Icon = icons[type as keyof typeof icons] || Bell;
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 shrink-0">
      <Icon className="h-4 w-4 text-gold" />
    </div>
  );
}
