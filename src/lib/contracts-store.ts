import type { Contract } from '@/types/contract';
import { apiClient } from '@/lib/api-client';

// Backend API response types
interface BackendContractField {
  key: string;
  label: string;
  type: string;
  value: string;
  required: boolean;
}

interface BackendContractBlock {
  id: string;
  type: string;
  order: number;
  enabled: boolean;
  fields: BackendContractField[];
}

interface BackendContract {
  id: string;
  client_id: string;
  client: { name: string };
  template_id?: string;
  status: string;
  blocks: BackendContractBlock[];
  signed_at?: string;
  created_at: string;
  updated_at: string;
}

// Map backend contract to frontend Contract type
function mapBackendContract(bc: BackendContract): Contract {
  const contract: Contract = {
    id: bc.id,
    clientId: bc.client_id,
    blocks: (bc.blocks || []).map((block) => ({
      id: block.id,
      type: block.type as Contract['blocks'][number]['type'],
      order: block.order,
      enabled: block.enabled,
      fields: (block.fields || []).map((field) => ({
        key: field.key,
        label: field.label,
        type: field.type as Contract['blocks'][number]['fields'][number]['type'],
        value: field.value,
        required: field.required,
      })),
    })),
    status: bc.status as Contract['status'],
    createdAt: bc.created_at,
    updatedAt: bc.updated_at,
  };

  if (bc.client?.name) {
    contract.clientName = bc.client.name;
  }
  if (bc.template_id) {
    contract.templateId = bc.template_id;
  }

  return contract;
}

// Map frontend Contract to backend payload for POST/PUT
function mapContractToBackend(contract: Partial<Contract>) {
  return {
    client_id: contract.clientId,
    template_id: contract.templateId,
    status: contract.status,
    blocks: contract.blocks?.map((block) => ({
      id: block.id,
      type: block.type,
      order: block.order,
      enabled: block.enabled,
      fields: block.fields.map((field) => ({
        key: field.key,
        label: field.label,
        type: field.type,
        value: field.value,
        required: field.required,
      })),
    })),
  };
}

export async function fetchContracts(): Promise<Contract[]> {
  const response = await apiClient.get<BackendContract[]>('/contracts');
  if (!response.success || !response.data) {
    throw new Error(response.error?.message ?? 'Erro ao buscar contratos');
  }
  return response.data.map(mapBackendContract);
}

export async function saveContract(contract: Contract): Promise<Contract> {
  const isNew = contract.id.startsWith('contract_');
  const payload = mapContractToBackend(contract);

  if (isNew) {
    const response = await apiClient.post<BackendContract>('/contracts', payload);
    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? 'Erro ao criar contrato');
    }
    return mapBackendContract(response.data);
  }

  const response = await apiClient.put<BackendContract>(`/contracts/${contract.id}`, payload);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message ?? 'Erro ao atualizar contrato');
  }
  return mapBackendContract(response.data);
}

export async function fetchContractById(id: string): Promise<Contract> {
  const response = await apiClient.get<BackendContract>(`/contracts/${id}`);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message ?? 'Erro ao buscar contrato');
  }
  return mapBackendContract(response.data);
}

export async function deleteContract(id: string): Promise<void> {
  const response = await apiClient.delete(`/contracts/${id}`);
  if (!response.success) {
    throw new Error(response.error?.message ?? 'Erro ao deletar contrato');
  }
}

export async function fetchContractsByClientId(clientId: string): Promise<Contract[]> {
  const response = await apiClient.get<BackendContract[]>('/contracts', { client_id: clientId });
  if (!response.success || !response.data) {
    throw new Error(response.error?.message ?? 'Erro ao buscar contratos do cliente');
  }
  return response.data.map(mapBackendContract);
}

// Portal-specific functions (for client access)
export async function fetchPortalContracts(): Promise<Contract[]> {
  const response = await apiClient.get<BackendContract[]>('/portal/contracts');
  if (!response.success || !response.data) {
    console.error("Failed to fetch portal contracts:", response.error?.message);
    return [];
  }
  return response.data.map(mapBackendContract);
}

export async function fetchPortalContractById(id: string): Promise<Contract | null> {
  const response = await apiClient.get<BackendContract>(`/portal/contracts/${id}`);
  if (!response.success || !response.data) {
    console.error("Failed to fetch portal contract:", response.error?.message);
    return null;
  }
  return mapBackendContract(response.data);
}

export async function signPortalContract(id: string): Promise<Contract | null> {
  const response = await apiClient.post<BackendContract>(`/portal/contracts/${id}/sign`);
  if (!response.success || !response.data) {
    console.error("Failed to sign contract:", response.error?.message);
    return null;
  }
  return mapBackendContract(response.data);
}
