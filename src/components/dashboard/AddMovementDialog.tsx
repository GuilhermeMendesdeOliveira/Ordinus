import { useState } from "react";
import { Plus, X, Send, FileText, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export type MovementType =
  | "notificacao_extrajudicial"
  | "contrato_acordo"
  | "peticao"
  | "reuniao"
  | "audiencia"
  | "correspondencia"
  | "documento"
  | "outro";

export interface MovementFormData {
  type: MovementType;
  title: string;
  description: string;
  date: string;
}

interface AddMovementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: MovementFormData) => Promise<void>;
  processNumber: string;
}

const MOVEMENT_TYPES: { value: MovementType; label: string; icon: string }[] = [
  { value: "notificacao_extrajudicial", label: "Notificação Extrajudicial", icon: "📨" },
  { value: "contrato_acordo", label: "Contrato de Acordo", icon: "📝" },
  { value: "peticao", label: "Petição", icon: "📄" },
  { value: "reuniao", label: "Reunião", icon: "🤝" },
  { value: "audiencia", label: "Audiência", icon: "⚖️" },
  { value: "correspondencia", label: "Correspondência", icon: "✉️" },
  { value: "documento", label: "Documento Enviado", icon: "📎" },
  { value: "outro", label: "Outro", icon: "📋" },
];

export function AddMovementDialog({
  isOpen,
  onOpenChange,
  onAdd,
  processNumber,
}: AddMovementDialogProps) {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const [formData, setFormData] = useState<MovementFormData>({
    type: "outro",
    title: "",
    description: "",
    date: formattedDate,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Informe o título da movimentação.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(formData);
      setFormData({
        type: "outro",
        title: "",
        description: "",
        date: formattedDate,
      });
      onOpenChange(false);
      toast.success("Movimentação adicionada com sucesso!");
    } catch {
      toast.error("Erro ao adicionar movimentação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-card border border-border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Nova Movimentação
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Processo: {processNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Tipo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Tipo de Movimentação
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value as MovementType }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOVEMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="movement-title" className="text-sm font-medium text-foreground">
              Título
            </Label>
            <Input
              id="movement-title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Ex: Enviada notificação extrajudicial ao réu"
            />
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="movement-date" className="text-sm font-medium text-foreground">
              Data
            </Label>
            <Input
              id="movement-date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="movement-description" className="text-sm font-medium text-foreground">
              Descrição (opcional)
            </Label>
            <textarea
              id="movement-description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Detalhes adicionais sobre a movimentação..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer bg-gold hover:bg-gold-light text-primary font-medium gap-2"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isSubmitting ? "Adicionando..." : "Adicionar Movimentação"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
