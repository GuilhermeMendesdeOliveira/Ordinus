import { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Trash2, RotateCcw, PanelLeftOpen, PanelLeftClose, FileDown, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BlockSidebar } from './BlockSidebar';
import { ContractCanvas } from './ContractCanvas';
import { ClientSelector } from './ClientSelector';
import { TemplateManager } from './TemplateManager';
import { ContractPDFModal } from './ContractPDFModal';
import { LogoSettings, type LogoSettings as LogoSettingsType } from './LogoSettings';
import { LetterheadSettings, type LetterheadSettings as LetterheadSettingsType } from './LetterheadSettings';
import type { ContractBlock, BlockType, ContractTemplate, Contract, CustomBlockConfig } from '@/types/contract';
import {
  createBlockFromType,
  sortBlocksByOrder,
  validateContractBlocks,
  generateContractId,
} from '@/lib/contract-utils';
import {
  fetchTemplates,
  deleteTemplate,
} from '@/lib/templates-store';
import { saveContract } from '@/lib/contracts-store';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import type { ClientRow } from '@/components/dashboard/DashboardTable';

interface ContractBuilderProps {
  initialClientId?: string | undefined;
  initialContract?: Contract;
}

export function ContractBuilder({ initialClientId, initialContract }: ContractBuilderProps) {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<ContractBlock[]>(initialContract?.blocks || []);
  const [clientId, setClientId] = useState(initialClientId || initialContract?.clientId || '');
  const [contractId, setContractId] = useState(initialContract?.id || '');
  const [contractStatus, setContractStatus] = useState(initialContract?.status || 'draft');
  const [client, setClient] = useState<ClientRow | null>(null);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [logoSettings, setLogoSettings] = useState<LogoSettingsType>({
    enabled: false,
    data: null,
    position: 'center',
    size: 'medium',
    width: 150,
  });
  const [letterheadSettings, setLetterheadSettings] = useState<LetterheadSettingsType>({
    enabled: false,
    data: null,
    opacity: 0.3,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTemplates().then(setTemplates).catch(() => toast.error('Erro ao carregar templates'));
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Check if dragging from sidebar
    if (String(active.id).startsWith('sidebar-')) {
      const blockType = String(active.id).replace('sidebar-', '') as BlockType;
      const newBlock = createBlockFromType(blockType, blocks.length);
      setBlocks((prev) => [...prev, newBlock]);
      toast.success(`Bloco adicionado`);
      return;
    }

    // Reorder existing blocks
    if (active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex).map((block, index) => ({
          ...block,
          order: index,
        }));
      });
    }
  }, [blocks.length]);

  const handleUpdateBlock = useCallback((updatedBlock: ContractBlock) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === updatedBlock.id ? updatedBlock : block))
    );
  }, []);

  const handleRemoveBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
    toast.success('Bloco removido');
  }, []);

  const handleAddCustomBlock = useCallback((block: ContractBlock) => {
    const newBlock = { ...block, order: blocks.length };
    setBlocks((prev) => [...prev, newBlock]);
  }, [blocks.length]);

  const handleAddBlockFromSidebar = useCallback((type: BlockType, customConfig?: CustomBlockConfig) => {
    let newBlock = createBlockFromType(type, blocks.length, customConfig);

    // Auto-fill contratante block with client data
    if (type === 'contratante' && client) {
      newBlock = {
        ...newBlock,
        fields: newBlock.fields.map((field) => {
          if (field.autoFill === 'client') {
            return { ...field, value: client.client };
          }
          if (field.autoFill === 'cpfCnpj') {
            return { ...field, value: client.cpfCnpj || '' };
          }
          if (field.autoFill === 'address') {
            const address = [
              client.address,
              client.number,
              client.neighborhood,
              client.city && `${client.city}/${client.uf}`,
            ]
              .filter(Boolean)
              .join(', ');
            return { ...field, value: address };
          }
          return field;
        }),
      };
      toast.success(`Bloco adicionado com dados do cliente`);
    }
    // Auto-fill contratado block with logged-in user data
    else if (type === 'contratado' && user) {
      newBlock = {
        ...newBlock,
        fields: newBlock.fields.map((field) => {
          if (field.key === 'nome') {
            return { ...field, value: `Dr(a). ${user.name}` };
          }
          return field;
        }),
      };
      toast.success(`Bloco adicionado com dados do advogado`);
    }
    else {
      toast.success(`Bloco adicionado`);
    }

    setBlocks((prev) => [...prev, newBlock]);
  }, [blocks.length, client, user]);

  const handleClientChange = useCallback((selectedClient: ClientRow | null) => {
    setClient(selectedClient);
    setClientId(selectedClient?.id || '');

    if (selectedClient) {
      // Auto-fill contratante block
      setBlocks((prev) =>
        prev.map((block) => {
          if (block.type === 'contratante') {
            return {
              ...block,
              fields: block.fields.map((field) => {
                if (field.autoFill === 'client') {
                  return { ...field, value: selectedClient.client };
                }
                if (field.autoFill === 'cpfCnpj') {
                  return { ...field, value: selectedClient.cpfCnpj || '' };
                }
                if (field.autoFill === 'address') {
                  const address = [
                    selectedClient.address,
                    selectedClient.number,
                    selectedClient.neighborhood,
                    selectedClient.city && `${selectedClient.city}/${selectedClient.uf}`,
                  ]
                    .filter(Boolean)
                    .join(', ');
                  return { ...field, value: address };
                }
                return field;
              }),
            };
          }
          return block;
        })
      );
      toast.success(`Cliente "${selectedClient.client}" selecionado`);
    }
  }, []);

  const handleLoadTemplate = useCallback((template: ContractTemplate) => {
    const templateBlocks = template.blocks.map((block, index) => ({
      ...block,
      id: `block_${Date.now()}_${index}`,
    }));
    setBlocks(templateBlocks);
    toast.success(`Template "${template.name}" carregado`);
  }, []);

  const handleDeleteTemplate = useCallback(async (id: string) => {
    try {
      await deleteTemplate(id);
      setTemplates(await fetchTemplates());
      toast.success('Template removido');
    } catch {
      toast.error('Erro ao remover template');
    }
  }, []);

  const handleSaveTemplate = useCallback(async () => {
    try {
      setTemplates(await fetchTemplates());
    } catch {
      toast.error('Erro ao atualizar templates');
    }
  }, []);

  const handleClearAll = useCallback(() => {
    setBlocks([]);
    setClientId('');
    setClient(null);
    setContractId('');
    setContractStatus('draft');
    toast.success('Contrato limpo');
  }, []);

  const handleSaveContract = useCallback(async () => {
    const validation = validateContractBlocks(blocks);
    if (!validation.valid) {
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    const contract: Contract = {
      id: contractId || generateContractId(),
      clientId,
      clientName: client?.client || '',
      blocks,
      status: contractStatus,
      createdAt: initialContract?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const saved = await saveContract(contract);
      setContractId(saved.id);
      setContractStatus(saved.status);
      toast.success('Contrato salvo com sucesso!');
    } catch {
      toast.error('Erro ao salvar contrato');
    }
  }, [blocks, clientId, client, contractId, contractStatus, initialContract]);

  const handleSendToClient = useCallback(async () => {
    // First save the contract
    await handleSaveContract();

    if (!contractId) {
      toast.error('Salve o contrato antes de enviar ao cliente');
      return;
    }

    setIsSending(true);
    try {
      const response = await apiClient.post(`/contracts/${contractId}/send`);
      if (response.success) {
        setContractStatus('sent');
        toast.success('Contrato enviado ao cliente com sucesso!');
      } else {
        toast.error(response.error?.message || 'Erro ao enviar contrato');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar contrato');
    } finally {
      setIsSending(false);
    }
  }, [contractId, handleSaveContract]);

  const activeBlock = blocks.find((b) => b.id === activeId);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-4 border-b bg-background flex-shrink-0">
        <div className="flex-1">
          <ClientSelector value={clientId} onChange={handleClientChange} />
        </div>

        <div className="flex items-center gap-2">
          <TemplateManager blocks={blocks} onSave={handleSaveTemplate} />
          <Button variant="outline" onClick={handleSaveContract}>
            Salvar Contrato
          </Button>
          {/* Send to Client button - only for draft contracts */}
          {contractStatus === 'draft' && (
            <Button
              onClick={handleSendToClient}
              disabled={isSending || !clientId}
              className="cursor-pointer bg-gold hover:bg-gold-light text-primary font-medium gap-2"
            >
              {isSending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSending ? "Enviando..." : "Enviar ao Cliente"}
            </Button>
          )}
          {/* Status indicator for sent contracts */}
          {contractStatus === 'sent' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Send className="h-4 w-4" />
              <span>Enviado ao cliente</span>
            </div>
          )}
          {/* Status indicator for signed contracts */}
          {contractStatus === 'signed' && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>Assinado</span>
            </div>
          )}
          <Button variant="outline" onClick={handleClearAll}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          <Button
            variant={showSidebar ? "default" : "outline"}
            onClick={() => setShowSidebar(!showSidebar)}
            title={showSidebar ? "Ocultar blocos" : "Mostrar blocos"}
          >
            {showSidebar ? (
              <PanelLeftClose className="h-4 w-4 mr-2" />
            ) : (
              <PanelLeftOpen className="h-4 w-4 mr-2" />
            )}
            Blocos
          </Button>
        </div>
      </div>

      {/* Logo & Letterhead Settings - Collapsible */}
      <div className="border-b bg-background flex-shrink-0 max-h-[300px] overflow-y-auto">
        <div className="p-4 space-y-4">
          <LogoSettings settings={logoSettings} onChange={setLogoSettings} />
          <LetterheadSettings settings={letterheadSettings} onChange={setLetterheadSettings} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Sidebar */}
          {showSidebar && (
            <div className="w-72 border-r p-4 overflow-y-auto">
              <BlockSidebar
                templates={templates}
                onLoadTemplate={handleLoadTemplate}
                onDeleteTemplate={handleDeleteTemplate}
                onAddBlock={handleAddBlockFromSidebar}
                onAddCustomBlock={handleAddCustomBlock}
              />
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 p-4 overflow-y-auto">
            <ContractCanvas
              blocks={blocks}
              onUpdateBlock={handleUpdateBlock}
              onRemoveBlock={handleRemoveBlock}
            />
          </div>
        </DndContext>

        <DragOverlay>
          {activeBlock ? (
            <div className="bg-card border rounded-lg p-4 shadow-lg opacity-90">
              {activeBlock.type}
            </div>
          ) : null}
        </DragOverlay>
      </div>

      {/* Floating PDF Button */}
      <Button
        onClick={() => setIsPDFModalOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gold hover:bg-gold-light text-primary z-50"
        title="Visualizar em PDF"
      >
        <FileDown className="h-6 w-6" />
      </Button>

      {/* PDF Modal */}
      <ContractPDFModal
        contract={{
          id: 'current',
          clientId,
          clientName: client?.client || '',
          blocks,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }}
        isOpen={isPDFModalOpen}
        onOpenChange={setIsPDFModalOpen}
      />
    </div>
  );
}
