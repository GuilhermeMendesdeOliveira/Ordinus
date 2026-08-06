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

const DEFAULT_PROCESSES: ProcessRow[] = [];

const LOCAL_STORAGE_KEY = "ordinus_processes";

export function getStoredProcesses(): ProcessRow[] {
  if (typeof window === "undefined") return DEFAULT_PROCESSES;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROCESSES));
    return DEFAULT_PROCESSES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_PROCESSES;
  }
}

export function setStoredProcesses(processes: ProcessRow[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(processes));
  }
}

export function generateProcessNumber(): string {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();
  const sequence = Math.floor(Math.random() * 9000000) + 1000000;
  return `${sequence}.${day}.${month}.${year}`;
}
