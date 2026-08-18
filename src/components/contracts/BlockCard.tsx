import { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronUp,
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
  Puzzle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldEditor } from './FieldEditor';
import type { ContractBlock, BlockType } from '@/types/contract';
import { getBlockLabel } from '@/lib/contract-utils';

const ICONS: Record<string, React.ComponentType<any>> = {
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
  custom: Puzzle,
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

interface BlockCardProps {
  block: ContractBlock;
  onUpdate: (block: ContractBlock) => void;
  onRemove: (id: string) => void;
}

export function BlockCard({ block, onUpdate, onRemove }: BlockCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 0,
  };

  // Handle custom blocks
  const isCustom = block.type === 'custom' && block.customConfig;
  const iconName = isCustom ? (block.customConfig?.icon || 'FileText') : block.type;
  const IconComponent = ICONS[iconName] || FileText;
  const label = isCustom ? block.customConfig?.name : getBlockLabel(block.type);

  const handleFieldChange = (key: string, value: string) => {
    const updatedFields = block.fields.map((f) =>
      f.key === key ? { ...f, value } : f
    );
    onUpdate({ ...block, fields: updatedFields });
  };

  const toggleEnabled = () => {
    onUpdate({ ...block, enabled: !block.enabled });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card border rounded-lg p-4 transition-all ${
        isDragging ? 'shadow-lg' : 'shadow-sm'
      } ${!block.enabled ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <button
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <IconComponent className="h-5 w-5 text-gold" />

        <span className="font-medium flex-1">{label}</span>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleEnabled}
            title={block.enabled ? 'Desabilitar' : 'Habilitar'}
          >
            {block.enabled ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(block.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {block.enabled && (
        <div className="space-y-3 pl-8">
          {block.fields.map((field) => (
            <FieldEditor
              key={field.key}
              field={field}
              onChange={(value) => handleFieldChange(field.key, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function BlockCardSkeleton() {
  return (
    <div className="bg-card border rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 bg-muted rounded" />
        <div className="h-5 w-5 bg-muted rounded" />
        <div className="h-4 bg-muted rounded flex-1" />
        <div className="h-8 w-8 bg-muted rounded" />
        <div className="h-8 w-8 bg-muted rounded" />
      </div>
    </div>
  );
}
