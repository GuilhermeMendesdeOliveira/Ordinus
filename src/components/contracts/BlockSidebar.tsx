import { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import {
  User,
  Scale,
  FileText,
  DollarSign,
  TrendingUp,
  CreditCard,
  Clock,
  XCircle,
  MapPin,
  BookOpen,
  Type,
  Plus,
  LayoutTemplate,
  Trash2,
  Puzzle,
  ScrollText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BLOCK_CONFIGS, type BlockType, type CustomBlockConfig, type ContractBlock } from '@/types/contract';
import type { ContractTemplate } from '@/types/contract';
import { fetchCustomBlocks } from '@/lib/custom-blocks-store';
import { fetchCustomClauses } from '@/lib/custom-clauses-store';
import type { CustomClause } from '@/lib/custom-clauses-store';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  contratante: User,
  contratado: Scale,
  objeto: FileText,
  honorarios: DollarSign,
  valor_causa: TrendingUp,
  pagamento: CreditCard,
  prazo: Clock,
  rescisao: XCircle,
  foro: MapPin,
  clausulas: BookOpen,
  texto_livre: Type,
  FileText: FileText,
  User: User,
  Building: Scale,
  Scale: Scale,
  DollarSign: DollarSign,
  Calendar: Clock,
  Clock: Clock,
  MapPin: MapPin,
  BookOpen: BookOpen,
  File: FileText,
};

interface BlockSidebarProps {
  templates: ContractTemplate[];
  onLoadTemplate: (template: ContractTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onAddBlock: (type: BlockType, customConfig?: CustomBlockConfig) => void;
  onAddCustomBlock: (block: ContractBlock) => void;
}

function DraggableBlock({ type, label, icon, description, onAdd, customConfig }: { type: BlockType; label: string; icon: string; description: string; onAdd: (type: BlockType, customConfig?: CustomBlockConfig) => void; customConfig?: CustomBlockConfig }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}${customConfig ? `-${customConfig.id}` : ''}`,
    data: { type, fromSidebar: true, customConfig },
  });

  const Icon = ICONS[icon] || FileText;

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      onAdd(type, customConfig);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-grab active:cursor-grabbing hover:bg-muted hover:ring-1 hover:ring-gold/30 transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <Icon className="h-5 w-5 text-gold shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
    </div>
  );
}

export function BlockSidebar({ templates, onLoadTemplate, onDeleteTemplate, onAddBlock, onAddCustomBlock }: BlockSidebarProps) {
  const [customBlocks, setCustomBlocks] = useState<CustomBlockConfig[]>([]);
  const [customClauses, setCustomClauses] = useState<CustomClause[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [blocks, clauses] = await Promise.all([
        fetchCustomBlocks(),
        fetchCustomClauses(),
      ]);
      setCustomBlocks(blocks);
      setCustomClauses(clauses);
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Standard Blocks */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Blocos Padrão</h3>
        <p className="text-xs text-muted-foreground mb-3">Clique ou arraste para adicionar</p>
        <div className="space-y-2">
          {BLOCK_CONFIGS.map((config) => (
            <DraggableBlock
              key={config.type}
              type={config.type}
              label={config.label}
              icon={config.icon}
              description={config.description}
              onAdd={onAddBlock}
            />
          ))}
        </div>
      </div>

      {/* Custom Clauses */}
      {customClauses.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <ScrollText className="h-4 w-4" />
            Clausulas Personalizadas
          </h3>
          <div className="space-y-2">
            {customClauses.map((clause) => (
              <button
                key={clause.id}
                type="button"
                onClick={() => {
                  onAddCustomBlock({
                    id: `block_${Date.now()}`,
                    type: 'texto_livre',
                    order: 0,
                    enabled: true,
                    fields: [
                      { key: 'titulo', label: 'Titulo', type: 'text', value: clause.title, required: false },
                      { key: 'conteudo', label: 'Conteudo', type: 'textarea', value: clause.content, required: true },
                    ],
                  });
                }}
                className="w-full text-left p-3 bg-muted/50 rounded-lg hover:bg-muted hover:ring-1 hover:ring-gold/30 transition-all cursor-pointer"
              >
                <p className="text-sm font-medium truncate">{clause.title}</p>
                <p className="text-xs text-muted-foreground truncate">{clause.category}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Blocks */}
      {customBlocks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Puzzle className="h-4 w-4" />
            Blocos Personalizados
          </h3>
          <div className="space-y-2">
            {customBlocks.map((block) => (
              <DraggableBlock
                key={block.id}
                type="custom"
                label={block.name}
                icon={block.icon}
                description={block.description || `${block.fields.length} campos`}
                onAdd={onAddBlock}
                customConfig={block}
              />
            ))}
          </div>
        </div>
      )}

      {/* Templates */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4" />
          Templates
        </h3>
        <div className="space-y-2">
          {templates.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              Nenhum template salvo
            </p>
          ) : (
            templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
              >
                <Button
                  variant="ghost"
                  className="flex-1 justify-start h-auto py-2"
                  onClick={() => onLoadTemplate(template)}
                >
                  <div className="text-left">
                    <p className="text-sm font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {template.blocks.length} blocos
                    </p>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteTemplate(template.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
