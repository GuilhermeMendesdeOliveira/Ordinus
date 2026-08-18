import type { CustomBlockConfig } from '@/types/contract';
import { apiClient } from './api-client';

export async function fetchCustomBlocks(): Promise<CustomBlockConfig[]> {
  const result = await apiClient.get<CustomBlockConfig[]>('/custom-blocks');

  if (!result.success || !result.data) {
    return [];
  }

  return result.data;
}

export async function saveCustomBlock(block: CustomBlockConfig): Promise<CustomBlockConfig | null> {
  const existingBlocks = await fetchCustomBlocks();
  const existing = existingBlocks.find((b) => b.id === block.id);

  if (existing) {
    const result = await apiClient.put<CustomBlockConfig>(`/custom-blocks/${block.id}`, block);
    return result.success ? result.data : null;
  } else {
    const result = await apiClient.post<CustomBlockConfig>('/custom-blocks', block);
    return result.success ? result.data : null;
  }
}

export async function deleteCustomBlock(id: string): Promise<boolean> {
  const result = await apiClient.delete(`/custom-blocks/${id}`);
  return result.success;
}
