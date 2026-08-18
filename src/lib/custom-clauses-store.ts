import { apiClient } from './api-client';

export interface CustomClause {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
}

export async function fetchCustomClauses(): Promise<CustomClause[]> {
  const result = await apiClient.get<CustomClause[]>('/custom-clauses');

  if (!result.success || !result.data) {
    return [];
  }

  return result.data;
}

export async function saveCustomClause(clause: CustomClause): Promise<CustomClause | null> {
  const existingClauses = await fetchCustomClauses();
  const existing = existingClauses.find((c) => c.id === clause.id);

  if (existing) {
    const result = await apiClient.put<CustomClause>(`/custom-clauses/${clause.id}`, clause);
    return result.success ? result.data : null;
  } else {
    const result = await apiClient.post<CustomClause>('/custom-clauses', clause);
    return result.success ? result.data : null;
  }
}

export async function deleteCustomClause(id: string): Promise<boolean> {
  const result = await apiClient.delete(`/custom-clauses/${id}`);
  return result.success;
}
