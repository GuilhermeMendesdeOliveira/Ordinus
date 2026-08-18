import { useState } from 'react';
import { Save, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { ContractBlock, ContractTemplate } from '@/types/contract';
import { saveTemplate, validateTemplate } from '@/lib/templates-store';

interface TemplateManagerProps {
  blocks: ContractBlock[];
  onSave: (template: ContractTemplate) => void;
}

export function TemplateManager({ blocks, onSave }: TemplateManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Digite um nome para o template');
      return;
    }

    const templateBlocks = blocks.map(({ id, ...rest }) => rest);
    const validation = validateTemplate({ name, description, blocks: templateBlocks });

    if (!validation.valid) {
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    const newTemplate: ContractTemplate = {
      id: `template_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      blocks: templateBlocks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const saved = await saveTemplate(newTemplate);
      onSave(saved);
      setIsOpen(false);
      setName('');
      setDescription('');
      toast.success('Template salvo com sucesso!');
    } catch {
      toast.error('Erro ao salvar template');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Save className="h-4 w-4 mr-2" />
          Salvar Template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5" />
            Salvar Template
          </DialogTitle>
          <DialogDescription>
            Salve a configuração atual dos blocos como um template reutilizável.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Nome do Template *</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Contrato Padrão"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-description">Descrição</Label>
            <Input
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição opcional do template"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Blocos que serão salvos: {blocks.filter((b) => b.enabled).length} blocos habilitados</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
