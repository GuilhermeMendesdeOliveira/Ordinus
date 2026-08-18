import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Search, Eye, Clock, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { ClientProtectedRoute } from "@/components/portal/ClientProtectedRoute";
import { ClientSidebar } from "@/components/portal/ClientSidebar";
import { ClientHeader } from "@/components/portal/ClientHeader";
import { useClientAuth } from "@/lib/client-auth-context";
import { useSidebar } from "@/lib/sidebar-context";
import { fetchPortalProcesses } from "@/lib/processes-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import type { ProcessRow } from "@/lib/processes-store";

export const Route = createFileRoute("/portal/processos")({
  component: PortalProcessosPage,
  head: () => ({
    meta: [
      { title: "Processos | Portal do Cliente" },
      {
        name: "description",
        content: "Acompanhe o andamento dos seus processos.",
      },
    ],
  }),
});

function PortalProcessosPage() {
  const { client } = useClientAuth();
  const { isCollapsed } = useSidebar();
  const [processes, setProcesses] = useState<ProcessRow[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProcess, setSelectedProcess] = useState<ProcessRow | null>(null);

  useEffect(() => {
    if (client) {
      const loadData = async () => {
        const data = await fetchPortalProcesses();
        setProcesses(data);
      };
      loadData();
    }
  }, [client]);

  const filteredProcesses = processes.filter((p) => {
    const searchLower = search.toLowerCase();
    return (
      p.processNumber.toLowerCase().includes(searchLower) ||
      p.area.toLowerCase().includes(searchLower)
    );
  });

  return (
    <ClientProtectedRoute>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <ClientSidebar activeLabel="Processos" />

        <div
          className="flex flex-col flex-1 min-w-0"
          style={{
            marginLeft: isCollapsed ? "76px" : "260px",
            transition: "margin-left 500ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ClientHeader
            title="Meus Processos"
            subtitle="Acompanhe o andamento dos seus processos"
          />

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1440px] p-6">
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-3xl tracking-tight text-foreground">Processos</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Acompanhe o status e as movimentacoes dos seus processos.
                  </p>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por numero ou area..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {filteredProcesses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground rounded-xl border border-dashed">
                    <Briefcase className="h-12 w-12 mb-4 opacity-40" />
                    <p className="text-lg font-medium">
                      {processes.length === 0 ? "Nenhum processo encontrado" : "Nenhum resultado para sua busca"}
                    </p>
                    <p className="text-sm mt-1">
                      {processes.length === 0
                        ? "Voce ainda nao possui processos registrados."
                        : "Tente ajustar os termos de pesquisa."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProcesses.map((process) => (
                      <ProcessCard
                        key={process.id}
                        process={process}
                        isSelected={selectedProcess?.id === process.id}
                        onSelect={() => setSelectedProcess(
                          selectedProcess?.id === process.id ? null : process
                        )}
                      />
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

function ProcessCard({
  process,
  isSelected,
  onSelect,
}: {
  process: ProcessRow;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [movements, setMovements] = useState<any[]>([]);
  const [isLoadingMovements, setIsLoadingMovements] = useState(false);

  useEffect(() => {
    if (isSelected && movements.length === 0) {
      loadMovements();
    }
  }, [isSelected]);

  const loadMovements = async () => {
    setIsLoadingMovements(true);
    try {
      const response = await apiClient.get(`/portal/processes/${process.id}/movements`);
      if (response.success && response.data) {
        setMovements(response.data as any[]);
      }
    } catch (error) {
      console.error('Failed to load movements:', error);
    } finally {
      setIsLoadingMovements(false);
    }
  };

  const statusConfig = {
    success: { label: process.status.label, icon: CheckCircle2, className: "bg-green-100 text-green-700 border-green-200" },
    warning: { label: process.status.label, icon: Clock, className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    danger: { label: process.status.label, icon: AlertTriangle, className: "bg-red-100 text-red-700 border-red-200" },
  }[process.status.tone] || { label: process.status.label, icon: Clock, className: "bg-gray-100 text-gray-700 border-gray-200" };

  const StatusIcon = statusConfig.icon;

  return (
    <div className="rounded-xl border bg-card overflow-hidden transition-all hover:shadow-md">
      <button
        type="button"
        onClick={onSelect}
        className="w-full text-left p-6 cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 shrink-0">
              <Briefcase className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground font-mono">
                {process.processNumber}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Area: {process.area}
              </p>
              <p className="text-sm text-muted-foreground">
                Registrado em: {process.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusConfig.className}`}>
              <StatusIcon className="h-3.5 w-3.5" />
              {statusConfig.label}
            </span>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </button>

      {/* Expanded details */}
      {isSelected && (
        <div className="border-t bg-muted/30 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Details */}
            {process.details && Object.keys(process.details).length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Detalhes do Processo</h4>
                <div className="space-y-2">
                  {Object.entries(process.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </span>
                      <span className="text-foreground font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {process.notes && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Observacoes</h4>
                <p className="text-sm text-muted-foreground">{process.notes}</p>
              </div>
            )}

            {/* Documents count */}
            {process.documents && process.documents.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Documentos</h4>
                <p className="text-sm text-muted-foreground">
                  {process.documents.length} documento(s) anexado(s)
                </p>
              </div>
            )}
          </div>

          {/* Movements Timeline */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-foreground">Andamento do Processo</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadMovements}
                disabled={isLoadingMovements}
                className="cursor-pointer gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingMovements ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>

            {isLoadingMovements ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              </div>
            ) : movements.length > 0 ? (
              <div className="space-y-3">
                {movements.map((movement: any, index: number) => (
                  <div key={movement.id || index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-gold mt-1.5" />
                      {index < movements.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <p className="text-sm font-medium text-foreground">{movement.title}</p>
                      {movement.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{movement.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(movement.date).toLocaleDateString('pt-BR')}
                        {movement.source === 'datajud' && ' • DataJud'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                Nenhuma movimentação registrada.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
