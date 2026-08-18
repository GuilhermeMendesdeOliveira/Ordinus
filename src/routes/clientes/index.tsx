import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, Eye, Pencil, Trash2, ShieldAlert, FileText } from "lucide-react";
import { toast } from "sonner";

import { Container } from "@/components/system/Container";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Panel } from "@/components/system/Panel";
import { StatusBadge, type StatusTone } from "@/components/system/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegisterClientDialog } from "@/components/dashboard/RegisterClientDialog";
import { ViewClientDialog } from "@/components/dashboard/ViewClientDialog";
import { ConfirmDeleteDialog } from "@/components/dashboard/ConfirmDeleteDialog";
import { CreateProcessPromptDialog } from "@/components/dashboard/CreateProcessPromptDialog";
import { RegisterProcessDialog } from "@/components/dashboard/RegisterProcessDialog";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useSidebar } from "@/lib/sidebar-context";
import { cn } from "@/lib/utils";
import { fetchClients, createClient, updateClient, deleteClient } from "@/lib/clients-store";
import { createProcess, generateProcessNumber, type ProcessArea } from "@/lib/processes-store";
import type { ClientRow } from "@/components/dashboard/DashboardTable";

export const Route = createFileRoute("/clientes/")({
  component: ClientesPage,
  head: () => ({
    meta: [
      { title: "Gerenciamento de Clientes | Jeniffer Lemes Advocacia" },
      {
        name: "description",
        content: "Listagem, filtros e cadastro de clientes do escritório Jeniffer Lemes.",
      },
    ],
  }),
});

function ClientesPage() {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<ClientRow | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientRow | null>(null);
  const [isProcessPromptOpen, setIsProcessPromptOpen] = useState(false);
  const [isProcessRegisterOpen, setIsProcessRegisterOpen] = useState(false);
  const [newClientForProcess, setNewClientForProcess] = useState<ClientRow | null>(null);
  const [generatedProcessNumber, setGeneratedProcessNumber] = useState("");

  useEffect(() => {
    fetchClients().then((data) => {
      setClients(data);
      setIsLoading(false);
    });
  }, []);

  const handleAddClient = async (newClientData: Omit<ClientRow, "id" | "date">) => {
    const newClient = await createClient(newClientData);
    if (!newClient) {
      toast.error("Erro ao cadastrar cliente.");
      return;
    }

    setClients((prev) => [newClient, ...prev]);
    toast.success(`Cliente "${newClient.client}" cadastrado com sucesso!`);

    setNewClientForProcess(newClient);
    setGeneratedProcessNumber(generateProcessNumber());
    setIsProcessPromptOpen(true);
  };

  const handleDeleteClient = (client: ClientRow) => {
    setClientToDelete(client);
    setIsDeleteOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;
    const success = await deleteClient(clientToDelete.id);
    if (success) {
      setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
      toast.success(`Cliente "${clientToDelete.client}" removido com sucesso.`);
    } else {
      toast.error("Erro ao remover cliente.");
    }
    setClientToDelete(null);
  };

  const handleClientStatusChange = async (clientId: string, status: { label: string; tone: StatusTone }) => {
    const updated = await updateClient(clientId, { status });
    if (updated) {
      setClients((prev) => prev.map((c) => (c.id === clientId ? updated : c)));
      if (selectedClient?.id === clientId) {
        setSelectedClient(updated);
      }
      toast.success(`Status alterado para "${status.label}"`);
    } else {
      toast.error("Erro ao atualizar status do cliente.");
    }
  };

  const handleProcessPromptConfirm = () => {
    setIsProcessRegisterOpen(true);
  };

  const handleProcessRegisterConfirm = async (data: { processNumber: string; area: ProcessArea }) => {
    if (!newClientForProcess) return;

    const newProcess = await createProcess({
      processNumber: data.processNumber,
      clientId: newClientForProcess.id,
      clientName: newClientForProcess.client,
      area: data.area,
      status: { label: "Em andamento", tone: "success" },
    });

    if (!newProcess) {
      toast.error("Erro ao criar processo.");
      return;
    }

    // Update client matter in the local state
    setClients((prev) =>
      prev.map((c) =>
        c.id === newClientForProcess.id
          ? { ...c, matter: data.processNumber }
          : c
      )
    );

    toast.success(`Processo "${data.processNumber}" criado com sucesso!`);
    setNewClientForProcess(null);

    navigate({ to: "/processos/$id", params: { id: newProcess.id } });
  };

  // Filtragem dos clientes
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.client.toLowerCase().includes(search.toLowerCase()) ||
      c.matter.toLowerCase().includes(search.toLowerCase()) ||
      c.owner.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || c.status.label === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute>
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar activeLabel="Clientes" />

      <div
        className="flex flex-col flex-1 min-w-0"
        style={{
          marginLeft: isCollapsed ? "76px" : "260px",
          transition: "margin-left 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Header title="Clientes" subtitle="Gerenciamento e controle de processos ativos" />

        <main className="flex-1 overflow-y-auto">
          <Container className="flex flex-col gap-6 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl tracking-tight text-foreground">Clientes</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Busque, filtre e gerencie os registros de clientes e seus respectivos casos.
                </p>
              </div>
              <div>
                <RegisterClientDialog onAddClient={handleAddClient} />
              </div>
            </div>

            <Panel className="p-0">
              {/* Filtros e Busca */}
              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por nome, processo ou responsavel..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-[200px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filtrar por Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all" className="cursor-pointer">Todos os Status</SelectItem>
                      <SelectItem value="Em andamento" className="cursor-pointer">Em andamento</SelectItem>
                      <SelectItem value="Aguardando" className="cursor-pointer">Aguardando</SelectItem>
                      <SelectItem value="Prazo critico" className="cursor-pointer">Prazo critico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tabela de Clientes */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="px-6 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Cliente</TableHead>
                      <TableHead className="px-6 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Processo</TableHead>
                      <TableHead className="px-6 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Status</TableHead>
                      <TableHead className="px-6 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Data Registro</TableHead>
                      <TableHead className="px-6 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Responsável</TableHead>
                      <TableHead className="px-6 text-[11px] font-medium tracking-wider text-muted-foreground uppercase text-right">Ações</TableHead>
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
                    ) : filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <TableRow
                          key={client.id}
                          className="border-border transition-colors duration-200 hover:bg-secondary/40"
                        >
                          <TableCell className="px-6 py-5 text-sm font-medium text-foreground">
                            {client.client}
                          </TableCell>
                          <TableCell className="px-6 py-5 text-sm whitespace-nowrap text-muted-foreground">
                            {client.matter}
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <StatusBadge tone={client.status.tone} label={client.status.label} />
                          </TableCell>
                          <TableCell className="px-6 py-5 text-sm whitespace-nowrap text-muted-foreground">
                            {client.date}
                          </TableCell>
                          <TableCell className="px-6 py-5 text-sm text-muted-foreground">
                            {client.owner}
                          </TableCell>
                          <TableCell className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                aria-label="Visualizar"
                                onClick={() => {
                                  setSelectedClient(client);
                                  setIsViewOpen(true);
                                }}
                                className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-gold/50 hover:text-primary"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                aria-label="Gerar Contrato"
                                onClick={() => {
                                  navigate({ to: "/contratos/novo", search: { clientId: client.id } });
                                }}
                                className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-gold/50 hover:text-primary"
                                title="Gerar Contrato"
                              >
                                <FileText className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                aria-label="Excluir"
                                onClick={() => handleDeleteClient(client)}
                                className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="border-border hover:bg-transparent">
                        <TableCell colSpan={6} className="px-6 py-16 text-center">
                          <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground opacity-60" />
                          <p className="mt-3 text-sm font-medium text-foreground">Nenhum cliente encontrado</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Tente ajustar seus termos de pesquisa ou filtros de status.
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

    <ViewClientDialog
      client={selectedClient}
      isOpen={isViewOpen}
      onOpenChange={setIsViewOpen}
      onStatusChange={handleClientStatusChange}
    />

    <ConfirmDeleteDialog
      isOpen={isDeleteOpen}
      onOpenChange={setIsDeleteOpen}
      clientName={clientToDelete?.client ?? ""}
      onConfirm={confirmDeleteClient}
    />

    <CreateProcessPromptDialog
      isOpen={isProcessPromptOpen}
      onOpenChange={setIsProcessPromptOpen}
      clientName={newClientForProcess?.client ?? ""}
      onConfirm={handleProcessPromptConfirm}
    />

    <RegisterProcessDialog
      isOpen={isProcessRegisterOpen}
      onOpenChange={setIsProcessRegisterOpen}
      clientName={newClientForProcess?.client ?? ""}
      processNumber={generatedProcessNumber}
      onConfirm={handleProcessRegisterConfirm}
    />
    </ProtectedRoute>
  );
}
