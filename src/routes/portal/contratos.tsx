import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, FileDown, PenLine, CheckCircle2, Clock, Eye } from "lucide-react";
import { toast } from "sonner";
import { ClientProtectedRoute } from "@/components/portal/ClientProtectedRoute";
import { ClientSidebar } from "@/components/portal/ClientSidebar";
import { ClientHeader } from "@/components/portal/ClientHeader";
import { useClientAuth } from "@/lib/client-auth-context";
import { useSidebar } from "@/lib/sidebar-context";
import { fetchPortalContracts, signPortalContract } from "@/lib/contracts-store";
import { Button } from "@/components/ui/button";
import { ContractPDFModal } from "@/components/contracts/ContractPDFModal";
import type { Contract } from "@/types/contract";

export const Route = createFileRoute("/portal/contratos")({
  component: PortalContratosPage,
  head: () => ({
    meta: [
      { title: "Contratos | Portal do Cliente" },
      {
        name: "description",
        content: "Visualize e assine seus contratos.",
      },
    ],
  }),
});

function PortalContratosPage() {
  const { client } = useClientAuth();
  const { isCollapsed } = useSidebar();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

  useEffect(() => {
    if (client) {
      fetchPortalContracts().then(setContracts).catch(() => toast.error('Erro ao carregar contratos'));
    }
  }, [client]);

  const handleSign = async (contract: Contract) => {
    try {
      const signed = await signPortalContract(contract.id);
      if (signed) {
        setContracts((prev) => prev.map((c) => (c.id === signed.id ? signed : c)));
        toast.success("Contrato assinado com sucesso!");
      } else {
        toast.error("Erro ao assinar contrato");
      }
    } catch {
      toast.error("Erro ao assinar contrato");
    }
  };

  const handleViewPDF = (contract: Contract) => {
    setSelectedContract(contract);
    setIsPDFModalOpen(true);
  };

  return (
    <ClientProtectedRoute>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <ClientSidebar activeLabel="Contratos" />

        <div
          className="flex flex-col flex-1 min-w-0"
          style={{
            marginLeft: isCollapsed ? "76px" : "260px",
            transition: "margin-left 500ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ClientHeader
            title="Meus Contratos"
            subtitle="Visualize e assine seus contratos"
          />

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1440px] p-6">
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-3xl tracking-tight text-foreground">Contratos</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Contratos disponibilizados pelo escritorio para sua analise e assinatura.
                  </p>
                </div>

                {contracts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground rounded-xl border border-dashed">
                    <FileText className="h-12 w-12 mb-4 opacity-40" />
                    <p className="text-lg font-medium">Nenhum contrato encontrado</p>
                    <p className="text-sm mt-1">O escritorio ainda nao disponibilizou contratos para voce.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contracts.map((contract) => (
                      <div
                        key={contract.id}
                        className="rounded-xl border bg-card p-6 transition-all hover:shadow-md"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 shrink-0">
                              <FileText className="h-6 w-6 text-gold" />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-foreground">
                                {contract.clientName || "Contrato de Honorarios"}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Criado em {new Date(contract.createdAt).toLocaleDateString("pt-BR")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Atualizado em {new Date(contract.updatedAt).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <StatusBadge status={contract.status} />

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPDF(contract)}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Visualizar
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPDF(contract)}
                              className="gap-2"
                            >
                              <FileDown className="h-4 w-4" />
                              PDF
                            </Button>

                            {contract.status === "final" && (
                              <Button
                                size="sm"
                                onClick={() => handleSign(contract)}
                                className="gap-2 bg-gold hover:bg-gold-light text-primary"
                              >
                                <PenLine className="h-4 w-4" />
                                Assinar
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Contract preview */}
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {contract.blocks
                              .filter((b) => b.enabled)
                              .slice(0, 2)
                              .map((b) => b.fields.find((f) => f.value)?.value || "")
                              .join(" - ")}
                          </p>
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

      <ContractPDFModal
        contract={selectedContract}
        isOpen={isPDFModalOpen}
        onOpenChange={setIsPDFModalOpen}
      />
    </ClientProtectedRoute>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    draft: { label: "Rascunho", icon: Clock, className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    final: { label: "Aguardando Assinatura", icon: PenLine, className: "bg-blue-100 text-blue-700 border-blue-200" },
    signed: { label: "Assinado", icon: CheckCircle2, className: "bg-green-100 text-green-700 border-green-200" },
  }[status] || { label: status, icon: FileText, className: "bg-gray-100 text-gray-700 border-gray-200" };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
