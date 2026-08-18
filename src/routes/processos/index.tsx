import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Eye, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { Container } from "@/components/system/Container";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Panel } from "@/components/system/Panel";
import { StatusSelector, PROCESS_STATUS_OPTIONS } from "@/components/system/StatusSelector";
import type { StatusTone } from "@/components/system/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/lib/sidebar-context";
import { cn } from "@/lib/utils";
import { fetchProcesses, updateProcess, type ProcessRow } from "@/lib/processes-store";

export const Route = createFileRoute("/processos/")({
  component: ProcessosPage,
  head: () => ({
    meta: [
      { title: "Processos | Jeniffer Lemes Advocacia" },
      {
        name: "description",
        content: "Listagem e gerenciamento de processos do escritorio Jeniffer Lemes.",
      },
    ],
  }),
});

function ProcessosPage() {
  const [processes, setProcesses] = useState<ProcessRow[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProcesses().then((data) => {
      setProcesses(data);
      setIsLoading(false);
    });
  }, []);

  const handleProcessStatusChange = async (processId: string, status: { label: string; tone: StatusTone }) => {
    const updated = await updateProcess(processId, { status });
    if (updated) {
      setProcesses((prev) => prev.map((p) => (p.id === processId ? updated : p)));
      toast.success(`Status alterado para "${status.label}"`);
    } else {
      toast.error("Erro ao atualizar status do processo.");
    }
  };

  const filteredProcesses = processes.filter((p) => {
    const searchLower = search.toLowerCase();
    return (
      p.processNumber.toLowerCase().includes(searchLower) ||
      p.clientName.toLowerCase().includes(searchLower) ||
      p.area.toLowerCase().includes(searchLower)
    );
  });

  const { isCollapsed } = useSidebar();

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
        <Header title="Processos" subtitle="Gerenciamento e controle de processos ativos" />

        <main className="flex-1 overflow-y-auto">
          <Container className="flex flex-col gap-6 py-6">
            <div>
              <h1 className="text-3xl tracking-tight text-foreground">Processos</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Busque e gerencie todos os processos registrados no sistema.
              </p>
            </div>

            <Panel className="p-0">
              <div className="p-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por numero, cliente ou area..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="px-6 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                        Numero
                      </TableHead>
                      <TableHead className="px-6 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                        Cliente
                      </TableHead>
                      <TableHead className="px-6 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                        Area
                      </TableHead>
                      <TableHead className="px-6 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                        Status
                      </TableHead>
                      <TableHead className="px-6 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                        Data
                      </TableHead>
                      <TableHead className="px-6 text-[11px] font-medium tracking-wider text-muted-foreground uppercase text-right">
                        Acoes
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, idx) => (
                        <TableRow key={idx} className="border-border">
                          {Array.from({ length: 6 }).map((_, cIdx) => (
                            <TableCell key={cIdx} className="px-6 py-5">
                              <div className="h-4 w-28 animate-pulse rounded bg-muted/60" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : filteredProcesses.length > 0 ? (
                      filteredProcesses.map((process) => (
                        <TableRow
                          key={process.id}
                          className="border-border transition-colors duration-200 hover:bg-secondary/40"
                        >
                          <TableCell className="px-6 py-5 text-sm font-medium text-foreground font-mono">
                            {process.processNumber}
                          </TableCell>
                          <TableCell className="px-6 py-5 text-sm text-muted-foreground">
                            {process.clientName}
                          </TableCell>
                          <TableCell className="px-6 py-5 text-sm text-muted-foreground">
                            {process.area}
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <StatusSelector
                              value={process.status}
                              options={PROCESS_STATUS_OPTIONS}
                              onChange={(status) => handleProcessStatusChange(process.id, status)}
                            />
                          </TableCell>
                          <TableCell className="px-6 py-5 text-sm whitespace-nowrap text-muted-foreground">
                            {process.date}
                          </TableCell>
                          <TableCell className="px-6 py-5 text-right">
                            <Link
                              to="/processos/$id"
                              params={{ id: process.id }}
                              className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-gold/50 hover:text-primary"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="border-border hover:bg-transparent">
                        <TableCell colSpan={6} className="px-6 py-16 text-center">
                          <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground opacity-60" />
                          <p className="mt-3 text-sm font-medium text-foreground">
                            Nenhum processo encontrado
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {processes.length === 0
                              ? "Crie um processo a partir do cadastro de clientes."
                              : "Tente ajustar seus termos de pesquisa."}
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Panel>
          </Container>
        </main>
      </div>
    </div>
  );
}
