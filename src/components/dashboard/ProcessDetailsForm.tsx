import { useState, useEffect } from "react";
import { Save, Upload, Eye, Trash2, FileText, Image, RefreshCw, Search, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/system/Panel";
import { StatusBadge } from "@/components/system/StatusBadge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { DocumentUploadDialog } from "./DocumentUploadDialog";
import { DocumentViewerDialog } from "./DocumentViewerDialog";
import { ProcessTimeline } from "./ProcessTimeline";
import { DeadlineList } from "./DeadlineList";
import { AddMovementDialog, type MovementFormData } from "./AddMovementDialog";
import type { ProcessRow, ProcessDocument } from "@/lib/processes-store";
import { updateProcess } from "@/lib/processes-store";
import { consultarProcesso, type Movimentacao } from "@/lib/datajud-service";
import { apiClient } from "@/lib/api-client";

interface ProcessDetailsFormProps {
  process: ProcessRow;
}

interface FieldConfig {
  key: string;
  label: string;
  placeholder: string;
}

const CIVIL_FIELDS: FieldConfig[] = [
  { key: "valorCausa", label: "Valor da Causa", placeholder: "Ex: R$ 50.000,00" },
  { key: "comarca", label: "Comarca", placeholder: "Ex: São Paulo" },
  { key: "vara", label: "Vara", placeholder: "Ex: 3a Vara Civel" },
  { key: "classeJudicial", label: "Classe Judicial", placeholder: "Ex: Acao de Indenizacao" },
  { key: "objeto", label: "Objeto da Acao", placeholder: "Ex: Indenizacao por danos materiais" },
];

const TRABALHISTA_FIELDS: FieldConfig[] = [
  { key: "razaoSocialReclamada", label: "Razao Social (Reclamada)", placeholder: "Ex: Empresa XYZ Ltda" },
  { key: "cnpjReclamada", label: "CNPJ (Reclamada)", placeholder: "Ex: 00.000.000/0001-00" },
  { key: "enderecoReclamada", label: "Endereco (Reclamada)", placeholder: "Ex: Rua Example, 123" },
  { key: "representanteLegal", label: "Representante Legal", placeholder: "Ex: Joao da Silva" },
  { key: "tipoReclamacao", label: "Tipo de Reclamacao", placeholder: "Ex: Verbas rescisorias" },
  { key: "valorCausa", label: "Valor da Causa", placeholder: "Ex: R$ 30.000,00" },
];

const PREVIDenciaria_FIELDS: FieldConfig[] = [
  { key: "especieBeneficio", label: "Especie do Beneficio", placeholder: "Ex: Aposentadoria por invalidez" },
  { key: "numeroBeneficio", label: "Numero do Beneficio (NB)", placeholder: "Ex: 123/XXX.XXX.XXX-X" },
  { key: "dii", label: "Data Inicio Incapacidade (DII)", placeholder: "Ex: 01/01/2026" },
  { key: "dib", label: "Data Inicio Beneficio (DIB)", placeholder: "Ex: 01/06/2026" },
  { key: "cpfSegurado", label: "CPF do Segurado", placeholder: "Ex: 000.000.000-00" },
  { key: "pisPasep", label: "PIS/PASEP", placeholder: "Ex: 000.00000.00-0" },
  { key: "qualidadeSegurado", label: "Qualidade de Segurado", placeholder: "Ex: Contribuinte individual" },
];

function getFieldsForArea(area: string): FieldConfig[] {
  switch (area) {
    case "Cível":
      return CIVIL_FIELDS;
    case "Trabalhista":
      return TRABALHISTA_FIELDS;
    case "Previdenciária":
      return PREVIDenciaria_FIELDS;
    default:
      return [];
  }
}

export function ProcessDetailsForm({ process }: ProcessDetailsFormProps) {
  const [details, setDetails] = useState<Record<string, string>>(process.details || {});
  const [notes, setNotes] = useState(process.notes || "");
  const [documents, setDocuments] = useState<ProcessDocument[]>(process.documents || []);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isMovementOpen, setIsMovementOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ProcessDocument | null>(null);

  const fields = getFieldsForArea(process.area);

  useEffect(() => {
    carregarMovimentacoes();
  }, [process.id]);

  const carregarMovimentacoes = async () => {
    setIsLoadingTimeline(true);
    try {
      // Load movements from backend first
      const movementsResponse = await apiClient.get(`/processes/${process.id}/movements`);
      if (movementsResponse.success && movementsResponse.data) {
        const backendMovements = movementsResponse.data as any[];
        const convertedMovements: Movimentacao[] = backendMovements.map((m: any) => ({
          id: m.id,
          data: new Date(m.date).toLocaleDateString('pt-BR') + ' ' + new Date(m.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          descricao: m.title + (m.description ? ` - ${m.description}` : ''),
          orgao: m.source === 'datajud' ? 'DataJud' : 'Registro Manual',
          tipo: m.source === 'datajud' ? 'movimentacao' : 'movimentacao',
        }));
        setMovimentacoes(convertedMovements);
      } else {
        // Fallback to simulated DataJud
        const data = await consultarProcesso(process.processNumber);
        setMovimentacoes(data.movimentacoes);
      }
    } catch {
      toast.error("Erro ao consultar movimentacoes do processo.");
    } finally {
      setIsLoadingTimeline(false);
    }
  };

  const handleDetailChange = (key: string, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleUploadDocument = async (doc: ProcessDocument) => {
    const updatedDocs = [...documents, doc];
    setDocuments(updatedDocs);
    await updateProcess(process.id, { documents: updatedDocs });
  };

  const handleDeleteDocument = async (docId: string) => {
    const updatedDocs = documents.filter((d) => d.id !== docId);
    setDocuments(updatedDocs);
    const result = await updateProcess(process.id, { documents: updatedDocs });
    if (result) {
      toast.success("Documento removido com sucesso.");
    } else {
      toast.error("Erro ao remover documento.");
    }
  };

  const handleViewDocument = (doc: ProcessDocument) => {
    setSelectedDocument(doc);
    setIsViewerOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProcess(process.id, { details, notes, documents });
      if (result) {
        toast.success("Informacoes do processo salvas com sucesso!");
      } else {
        toast.error("Erro ao salvar informacoes do processo.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMovement = async (data: MovementFormData) => {
    try {
      const response = await apiClient.post(`/processes/${process.id}/movements`, {
        date: data.date,
        title: data.title,
        description: data.description || undefined,
      });

      if (response.success) {
        // Reload movements from backend
        const movementsResponse = await apiClient.get(`/processes/${process.id}/movements`);
        if (movementsResponse.success && movementsResponse.data) {
          // Convert backend movements to frontend format
          const backendMovements = movementsResponse.data as any[];
          const convertedMovements: Movimentacao[] = backendMovements.map((m: any) => ({
            id: m.id,
            data: new Date(m.date).toLocaleDateString('pt-BR') + ' ' + new Date(m.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            descricao: m.title + (m.description ? ` - ${m.description}` : ''),
            orgao: m.source === 'datajud' ? 'DataJud' : 'Registro Manual',
            tipo: m.source === 'datajud' ? 'movimentacao' : 'movimentacao',
          }));
          setMovimentacoes(convertedMovements);
        }
      } else {
        throw new Error(response.error?.message || 'Erro ao adicionar movimentação');
      }
    } catch (error: any) {
      console.error('Error adding movement:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Processo */}
      <Panel className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Numero do Processo
            </p>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-1">
              {process.processNumber}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Cliente: <span className="font-medium text-foreground">{process.clientName}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Area</p>
              <p className="text-sm font-medium text-foreground">{process.area}</p>
            </div>
            <StatusBadge tone={process.status.tone} label={process.status.label} />
          </div>
        </div>
      </Panel>

      {/* Dados da Area */}
      <Panel className="p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Dados - {process.area}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="text-sm font-medium text-foreground">
                {field.label}
              </Label>
              <Input
                id={field.key}
                value={details[field.key] || ""}
                onChange={(e) => handleDetailChange(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      </Panel>

      {/* Observacoes */}
      <Panel className="p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Observacoes do Processo
        </h3>
        <RichTextEditor
          value={notes}
          onChange={setNotes}
          placeholder="Registre informacoes relevantes sobre o caso..."
        />
      </Panel>

      {/* Documentos */}
      <Panel className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Documentos
          </h3>
          <Button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="cursor-pointer bg-gold hover:bg-gold-light text-primary font-medium gap-2"
          >
            <Upload className="h-4 w-4" />
            Adicionar Documento
          </Button>
        </div>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 rounded-md border border-border p-3 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gold/10">
                  {doc.mimeType.startsWith("image/") ? (
                    <Image className="h-5 w-5 text-gold" />
                  ) : (
                    <FileText className="h-5 w-5 text-gold" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {doc.category} - {doc.uploadDate}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleViewDocument(doc)}
                    className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 border border-dashed border-border rounded-md">
            <FileText className="h-10 w-10 text-muted-foreground opacity-50" />
            <p className="mt-2 text-sm text-muted-foreground">
              Nenhum documento adicionado
            </p>
            <p className="text-xs text-muted-foreground">
              Clique em "Adicionar Documento" para fazer upload
            </p>
          </div>
        )}
      </Panel>

      {/* Prazos e Notificacoes */}
      <Panel className="p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Prazos e Notificacoes
        </h3>
        <DeadlineList
          processId={process.id}
          processNumber={process.processNumber}
          clientName={process.clientName}
        />
      </Panel>

      {/* Andamento do Processo (Timeline) */}
      <Panel className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Andamento do Processo
          </h3>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMovementOpen(true)}
              className="cursor-pointer gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Movimentação
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={carregarMovimentacoes}
              disabled={isLoadingTimeline}
              className="cursor-pointer gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingTimeline ? "animate-spin" : ""}`} />
              DataJud
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-border bg-secondary/20 p-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <span>
              Movimentações do <span className="font-medium text-foreground">DataJud</span> e registros manuais
            </span>
          </div>
        </div>

        <ProcessTimeline movimentacoes={movimentacoes} isLoading={isLoadingTimeline} />
      </Panel>

      {/* Botao Salvar */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="cursor-pointer bg-gold hover:bg-gold-light text-primary font-medium gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Salvando..." : "Salvar Alteracoes"}
        </Button>
      </div>

      <DocumentUploadDialog
        isOpen={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUpload={handleUploadDocument}
      />

      <DocumentViewerDialog
        isOpen={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        document={selectedDocument}
      />

      <AddMovementDialog
        isOpen={isMovementOpen}
        onOpenChange={setIsMovementOpen}
        onAdd={handleAddMovement}
        processNumber={process.processNumber}
      />
    </div>
  );
}
