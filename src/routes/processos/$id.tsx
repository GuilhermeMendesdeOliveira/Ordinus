import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert } from "lucide-react";

import { Container } from "@/components/system/Container";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ProcessDetailsForm } from "@/components/dashboard/ProcessDetailsForm";
import { useSidebar } from "@/lib/sidebar-context";
import { cn } from "@/lib/utils";
import { getStoredProcesses } from "@/lib/processes-store";

export const Route = createFileRoute("/processos/$id")({
  component: ProcessDetailsPage,
  head: () => ({
    meta: [
      { title: "Detalhes do Processo | Jeniffer Lemes Advocacia" },
      {
        name: "description",
        content: "Detalhes e informacoes do processo no sistema Jeniffer Lemes.",
      },
    ],
  }),
});

function ProcessDetailsPage() {
  const { id } = Route.useParams();
  const { isCollapsed } = useSidebar();
  const processes = getStoredProcesses();
  const process = processes.find((p) => p.id === id);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar activeLabel="Processos" />

      <div
        className="flex flex-col flex-1 min-w-0"
        style={{
          marginLeft: isCollapsed ? "76px" : "260px",
          transition: "margin-left 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Header
          title="Detalhes do Processo"
          subtitle="Visualize e edite as informacoes do processo"
        />

        <main className="flex-1 overflow-y-auto">
          <Container className="flex flex-col gap-6 py-6">
            <Link
              to="/processos"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Processos
            </Link>

            {process ? (
              <ProcessDetailsForm process={process} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <ShieldAlert className="h-12 w-12 text-muted-foreground opacity-60" />
                <p className="mt-4 text-lg font-medium text-foreground">
                  Processo nao encontrado
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  O processo solicitado nao existe ou foi removido.
                </p>
                <Link
                  to="/processos"
                  className="mt-6 inline-flex items-center justify-center rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-gold-light"
                >
                  Ir para Processos
                </Link>
              </div>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
}
