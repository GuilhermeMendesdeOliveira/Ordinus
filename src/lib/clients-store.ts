import { apiClient } from "@/lib/api-client";
import type { ClientRow } from "@/components/dashboard/DashboardTable";

// Backend response type
interface BackendClient {
  id: string;
  name: string;
  cpf_cnpj: string;
  email: string;
  phone: string;
  address_street: string;
  address_number: string;
  address_neighborhood: string;
  address_city: string;
  address_uf: string;
  status: string;
  assigned_user: { id: string; name: string } | null;
  processes_count: number;
  created_at: string;
}

function mapBackendClientToRow(client: BackendClient): ClientRow {
  const statusMap: Record<string, { label: string; tone: "success" | "warning" | "danger" }> = {
    active: { label: "Em andamento", tone: "success" },
    pending: { label: "Aguardando", tone: "warning" },
    urgent: { label: "Prazo critico", tone: "danger" },
    inactive: { label: "Inativo", tone: "warning" },
  };

  const createdDate = new Date(client.created_at);
  const formattedDate = createdDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return {
    id: client.id,
    client: client.name,
    matter: "",
    status: statusMap[client.status] || { label: client.status, tone: "warning" },
    date: formattedDate,
    owner: client.assigned_user?.name || "",
    email: client.email,
    phone: client.phone,
    cpfCnpj: client.cpf_cnpj,
    address: client.address_street,
    number: client.address_number,
    neighborhood: client.address_neighborhood,
    city: client.address_city,
    uf: client.address_uf,
  };
}

export async function fetchClients(): Promise<ClientRow[]> {
  const response = await apiClient.get<BackendClient[]>("/clients");
  if (!response.success || !response.data) {
    console.error("Failed to fetch clients:", response.error?.message);
    return [];
  }
  return response.data.map(mapBackendClientToRow);
}

export async function fetchClientById(id: string): Promise<ClientRow | null> {
  const response = await apiClient.get<BackendClient>(`/clients/${id}`);
  if (!response.success || !response.data) {
    console.error("Failed to fetch client:", response.error?.message);
    return null;
  }
  return mapBackendClientToRow(response.data);
}

export async function createClient(
  data: Omit<ClientRow, "id" | "date">
): Promise<ClientRow | null> {
  const response = await apiClient.post<BackendClient>("/clients", {
    name: data.client,
    cpf_cnpj: data.cpfCnpj,
    email: data.email,
    phone: data.phone,
    address_street: data.address,
    address_number: data.number,
    address_neighborhood: data.neighborhood,
    address_city: data.city,
    address_uf: data.uf,
  });
  if (!response.success || !response.data) {
    console.error("Failed to create client:", response.error?.message);
    return null;
  }
  return mapBackendClientToRow(response.data);
}

export async function updateClient(
  id: string,
  data: Partial<ClientRow>
): Promise<ClientRow | null> {
  const response = await apiClient.put<BackendClient>(`/clients/${id}`, {
    name: data.client,
    cpf_cnpj: data.cpfCnpj,
    email: data.email,
    phone: data.phone,
    address_street: data.address,
    address_number: data.number,
    address_neighborhood: data.neighborhood,
    address_city: data.city,
    address_uf: data.uf,
  });
  if (!response.success || !response.data) {
    console.error("Failed to update client:", response.error?.message);
    return null;
  }
  return mapBackendClientToRow(response.data);
}

export async function deleteClient(id: string): Promise<boolean> {
  const response = await apiClient.delete(`/clients/${id}`);
  if (!response.success) {
    console.error("Failed to delete client:", response.error?.message);
    return false;
  }
  return true;
}
