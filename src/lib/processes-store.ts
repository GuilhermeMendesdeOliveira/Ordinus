import { apiClient } from "@/lib/api-client";

export type ProcessArea = "Cível" | "Trabalhista" | "Previdenciária";

export type DocumentCategory =
  | "CNH"
  | "Comprovante de Residencia"
  | "Certidao de Nascimento"
  | "Carteira de Trabalho"
  | "CPF"
  | "RG"
  | "Contrato"
  | "Comprovante de Renda"
  | "Procuracao"
  | "Outro";

export interface ProcessDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  fileName: string;
  fileData: string;
  mimeType: string;
  uploadDate: string;
}

export interface ProcessRow {
  id: string;
  processNumber: string;
  clientId: string;
  clientName: string;
  area: ProcessArea;
  status: { label: string; tone: "success" | "warning" | "danger" };
  date: string;
  details?: Record<string, string>;
  notes?: string;
  documents?: ProcessDocument[];
}

// Backend response type
interface BackendProcess {
  id: string;
  process_number: string;
  client_id: string;
  client: { name: string };
  area: string;
  status: string;
  comarca: string;
  vara: string;
  classe_judicial: string;
  valor_causa: string;
  description: string;
  notes: string;
  assigned_user: { id: string; name: string } | null;
  created_at: string;
}

function mapBackendProcessToRow(process: BackendProcess): ProcessRow {
  const statusMap: Record<string, { label: string; tone: "success" | "warning" | "danger" }> = {
    active: { label: "Em andamento", tone: "success" },
    pending: { label: "Aguardando", tone: "warning" },
    urgent: { label: "Prazo critico", tone: "danger" },
    closed: { label: "Encerrado", tone: "warning" },
  };

  const createdDate = new Date(process.created_at);
  const formattedDate = createdDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const details: Record<string, string> = {};
  if (process.comarca) details["comarca"] = process.comarca;
  if (process.vara) details["vara"] = process.vara;
  if (process.classe_judicial) details["classeJudicial"] = process.classe_judicial;
  if (process.valor_causa) details["valorCausa"] = process.valor_causa;

  const row: ProcessRow = {
    id: process.id,
    processNumber: process.process_number,
    clientId: process.client_id,
    clientName: process.client?.name || "",
    area: (process.area as ProcessArea) || "Cível",
    status: statusMap[process.status] || { label: process.status, tone: "warning" },
    date: formattedDate,
  };

  if (Object.keys(details).length > 0) {
    row.details = details;
  }
  if (process.notes) {
    row.notes = process.notes;
  }

  return row;
}

export async function fetchProcesses(): Promise<ProcessRow[]> {
  const response = await apiClient.get<BackendProcess[]>("/processes");
  if (!response.success || !response.data) {
    console.error("Failed to fetch processes:", response.error?.message);
    return [];
  }
  return response.data.map(mapBackendProcessToRow);
}

export async function fetchProcessById(id: string): Promise<ProcessRow | null> {
  const response = await apiClient.get<BackendProcess>(`/processes/${id}`);
  if (!response.success || !response.data) {
    console.error("Failed to fetch process:", response.error?.message);
    return null;
  }
  return mapBackendProcessToRow(response.data);
}

export async function createProcess(
  data: Omit<ProcessRow, "id" | "date">
): Promise<ProcessRow | null> {
  const response = await apiClient.post<BackendProcess>("/processes", {
    process_number: data.processNumber,
    client_id: data.clientId,
    area: data.area,
    status: data.status.label,
    comarca: data.details?.["comarca"],
    vara: data.details?.["vara"],
    classe_judicial: data.details?.["classeJudicial"],
    valor_causa: data.details?.["valorCausa"],
    description: data.notes,
    notes: data.notes,
  });
  if (!response.success || !response.data) {
    console.error("Failed to create process:", response.error?.message);
    return null;
  }
  return mapBackendProcessToRow(response.data);
}

export async function updateProcess(
  id: string,
  data: Partial<ProcessRow>
): Promise<ProcessRow | null> {
  const response = await apiClient.put<BackendProcess>(`/processes/${id}`, {
    process_number: data.processNumber,
    client_id: data.clientId,
    area: data.area,
    status: data.status?.label,
    comarca: data.details?.["comarca"],
    vara: data.details?.["vara"],
    classe_judicial: data.details?.["classeJudicial"],
    valor_causa: data.details?.["valorCausa"],
    description: data.notes,
    notes: data.notes,
  });
  if (!response.success || !response.data) {
    console.error("Failed to update process:", response.error?.message);
    return null;
  }
  return mapBackendProcessToRow(response.data);
}

export async function deleteProcess(id: string): Promise<boolean> {
  const response = await apiClient.delete(`/processes/${id}`);
  if (!response.success) {
    console.error("Failed to delete process:", response.error?.message);
    return false;
  }
  return true;
}

// Portal-specific functions (for client access)
export async function fetchPortalProcesses(): Promise<ProcessRow[]> {
  const response = await apiClient.get<BackendProcess[]>("/portal/processes");
  if (!response.success || !response.data) {
    console.error("Failed to fetch portal processes:", response.error?.message);
    return [];
  }
  return response.data.map(mapBackendProcessToRow);
}

export async function fetchPortalProcessById(id: string): Promise<ProcessRow | null> {
  const response = await apiClient.get<BackendProcess>(`/portal/processes/${id}`);
  if (!response.success || !response.data) {
    console.error("Failed to fetch portal process:", response.error?.message);
    return null;
  }
  return mapBackendProcessToRow(response.data);
}

export function generateProcessNumber(): string {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();
  const sequence = Math.floor(Math.random() * 9000000) + 1000000;
  return `${sequence}.${day}.${month}.${year}`;
}
