import type { ContractTemplate } from '@/types/contract';
import { BLOCK_CONFIGS } from '@/types/contract';
import { apiClient } from '@/lib/api-client';

// Backend API response types
interface BackendTemplateField {
  key: string;
  label: string;
  type: string;
  value?: string;
  required: boolean;
  autoFill?: string;
  placeholder?: string;
  options?: string[];
}

interface BackendTemplateBlock {
  type: string;
  order: number;
  enabled: boolean;
  isMultiple?: boolean;
  fields: BackendTemplateField[];
}

interface BackendTemplate {
  id: string;
  name: string;
  description: string;
  blocks_schema: string | BackendTemplateBlock[];
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

// Map backend template to frontend ContractTemplate type
function mapBackendTemplate(bt: BackendTemplate): ContractTemplate {
  let blocks: BackendTemplateBlock[];
  if (typeof bt.blocks_schema === 'string') {
    try {
      blocks = JSON.parse(bt.blocks_schema);
    } catch {
      blocks = [];
    }
  } else {
    blocks = bt.blocks_schema ?? [];
  }

  return {
    id: bt.id,
    name: bt.name,
    description: bt.description,
    blocks: blocks.map((block) => {
      const mappedBlock: ContractTemplate['blocks'][number] = {
        type: block.type as ContractTemplate['blocks'][number]['type'],
        order: block.order,
        enabled: block.enabled,
        fields: block.fields.map((field) => {
          const mappedField: ContractTemplate['blocks'][number]['fields'][number] = {
            key: field.key,
            label: field.label,
            type: field.type as ContractTemplate['blocks'][number]['fields'][number]['type'],
            value: field.value ?? '',
            required: field.required,
          };
          if (field.autoFill) mappedField.autoFill = field.autoFill;
          if (field.placeholder) mappedField.placeholder = field.placeholder;
          if (field.options) mappedField.options = field.options;
          return mappedField;
        }),
      };
      if (block.isMultiple !== undefined) mappedBlock.isMultiple = block.isMultiple;
      return mappedBlock;
    }),
    createdAt: bt.created_at,
    updatedAt: bt.updated_at,
  };
}

// Map frontend ContractTemplate to backend payload for POST/PUT
function mapTemplateToBackend(template: Partial<ContractTemplate>) {
  return {
    name: template.name,
    description: template.description,
    blocks_schema: JSON.stringify(template.blocks ?? []),
  };
}

export async function fetchTemplates(): Promise<ContractTemplate[]> {
  const response = await apiClient.get<BackendTemplate[]>('/templates');
  if (!response.success || !response.data) {
    throw new Error(response.error?.message ?? 'Erro ao buscar templates');
  }
  return response.data.map(mapBackendTemplate);
}

export async function saveTemplate(template: ContractTemplate): Promise<ContractTemplate> {
  const isNew = template.id.startsWith('template_');
  const payload = mapTemplateToBackend(template);

  if (isNew) {
    const response = await apiClient.post<BackendTemplate>('/templates', payload);
    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? 'Erro ao criar template');
    }
    return mapBackendTemplate(response.data);
  }

  const response = await apiClient.put<BackendTemplate>(`/templates/${template.id}`, payload);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message ?? 'Erro ao atualizar template');
  }
  return mapBackendTemplate(response.data);
}

export async function fetchTemplateById(id: string): Promise<ContractTemplate> {
  const response = await apiClient.get<BackendTemplate>(`/templates/${id}`);
  if (!response.success || !response.data) {
    throw new Error(response.error?.message ?? 'Erro ao buscar template');
  }
  return mapBackendTemplate(response.data);
}

export async function deleteTemplate(id: string): Promise<void> {
  const response = await apiClient.delete(`/templates/${id}`);
  if (!response.success) {
    throw new Error(response.error?.message ?? 'Erro ao deletar template');
  }
}

export function validateTemplate(template: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredTypes = ['contratante', 'contratado', 'objeto', 'honorarios'];

  for (const requiredType of requiredTypes) {
    const hasBlock = template.blocks.some((b) => b.type === requiredType);
    if (!hasBlock) {
      const config = BLOCK_CONFIGS.find((c) => c.type === requiredType);
      errors.push(`Bloco obrigatório "${config?.label}" não encontrado`);
    }
  }

  return { valid: errors.length === 0, errors };
}
