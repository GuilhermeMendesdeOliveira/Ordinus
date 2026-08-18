import { useState } from 'react';
import { Plus, Trash2, GripVertical, Type, Hash, DollarSign, Percent, Calendar, List, AlignLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { FieldType, Field, CustomBlockConfig } from '@/types/contract';

interface CustomBlockModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: CustomBlockConfig) => void;
  initialConfig?: CustomBlockConfig | undefined;
}

const FIELD_TYPES: { value: FieldType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'text', label: 'Texto', icon: Type },
  { value: 'textarea', label: 'Texto Longo', icon: AlignLeft },
  { value: 'number', label: 'Número', icon: Hash },
  { value: 'currency', label: 'Moeda', icon: DollarSign },
  { value: 'percentage', label: 'Percentual', icon: Percent },
  { value: 'date', label: 'Data', icon: Calendar },
  { value: 'select', label: 'Seleção', icon: List },
];

const ICONS = [
  { value: 'FileText', label: 'Documento' },
  { value: 'User', label: 'Usuário' },
  { value: 'Building', label: 'Edifício' },
  { value: 'Scale', label: 'Balança' },
  { value: 'DollarSign', label: 'Moeda' },
  { value: 'Calendar', label: 'Calendário' },
  { value: 'Clock', label: 'Relógio' },
  { value: 'MapPin', label: 'Local' },
  { value: 'BookOpen', label: 'Livro' },
  { value: 'File', label: 'Arquivo' },
];

export function CustomBlockModal({ isOpen, onOpenChange, onSave, initialConfig }: CustomBlockModalProps) {
  const [name, setName] = useState(initialConfig?.name || '');
  const [description, setDescription] = useState(initialConfig?.description || '');
  const [icon, setIcon] = useState(initialConfig?.icon || 'FileText');
  const [fields, setFields] = useState<Omit<Field, 'value'>[]>(
    initialConfig?.fields || []
  );
  const [isMultiple, setIsMultiple] = useState(initialConfig?.isMultiple || false);

  const handleAddField = () => {
    const newField: Omit<Field, 'value'> = {
      key: `field_${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
    };
    setFields([...fields, newField]);
  };

  const handleUpdateField = (index: number, updates: Partial<Omit<Field, 'value'>>) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Digite um nome para o bloco');
      return;
    }

    if (fields.length === 0) {
      toast.error('Adicione pelo menos um campo');
      return;
    }

    const hasEmptyLabel = fields.some((f) => !f.label.trim());
    if (hasEmptyLabel) {
      toast.error('Todos os campos devem ter um rótulo');
      return;
    }

    const config: CustomBlockConfig = {
      id: initialConfig?.id || `custom_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      icon,
      fields,
      isMultiple,
    };

    onSave(config);
    onOpenChange(false);
    toast.success('Bloco personalizado salvo com sucesso');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when closing
      setName(initialConfig?.name || '');
      setDescription(initialConfig?.description || '');
      setIcon(initialConfig?.icon || 'FileText');
      setFields(initialConfig?.fields || []);
      setIsMultiple(initialConfig?.isMultiple || false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {initialConfig ? 'Editar Bloco Personalizado' : 'Criar Bloco Personalizado'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-180px)] pr-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="block-name">Nome do Bloco *</Label>
            <Input
              id="block-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Cláusula de Sigilo"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="block-description">Descrição</Label>
            <Textarea
              id="block-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do que este bloco representa"
              rows={2}
            />
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label>Ícone</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICONS.map((iconOption) => (
                  <SelectItem key={iconOption.value} value={iconOption.value}>
                    {iconOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Multiple */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is-multiple"
              checked={isMultiple}
              onChange={(e) => setIsMultiple(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is-multiple" className="cursor-pointer">
              Permitir múltiplos blocos
            </Label>
          </div>

          {/* Fields */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Campos</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddField}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Campo
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                <p className="text-sm">Nenhum campo adicionado</p>
                <p className="text-xs mt-1">Clique em "Adicionar Campo" para começar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.key}
                    className="border rounded-lg p-3 space-y-3 bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <span className="text-sm font-medium">Campo {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveField(index)}
                        className="ml-auto h-7 w-7 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Rótulo *</Label>
                        <Input
                          value={field.label}
                          onChange={(e) =>
                            handleUpdateField(index, { label: e.target.value })
                          }
                          placeholder="Ex: Nome do Cliente"
                          className="h-8"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Tipo</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value: FieldType) =>
                            handleUpdateField(index, { type: value })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-3 w-3" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Placeholder</Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) =>
                            handleUpdateField(index, { placeholder: e.target.value })
                          }
                          placeholder="Texto de exemplo"
                          className="h-8"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-5">
                        <input
                          type="checkbox"
                          id={`field-required-${index}`}
                          checked={field.required}
                          onChange={(e) =>
                            handleUpdateField(index, { required: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label
                          htmlFor={`field-required-${index}`}
                          className="text-xs cursor-pointer"
                        >
                          Obrigatório
                        </Label>
                      </div>
                    </div>

                    {field.type === 'select' && (
                      <div className="space-y-1">
                        <Label className="text-xs">Opções (uma por linha)</Label>
                        <Textarea
                          value={field.options?.join('\n') || ''}
                          onChange={(e) =>
                            handleUpdateField(index, {
                              options: e.target.value.split('\n').filter(Boolean),
                            })
                          }
                          placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                          rows={3}
                          className="text-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {initialConfig ? 'Salvar Alterações' : 'Criar Bloco'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
