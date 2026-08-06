import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Deadline, DeadlineType } from "@/lib/deadlines-store";
import { getDeadlineTypeLabel } from "@/lib/deadlines-store";

const deadlineSchema = z.object({
  title: z.string().min(2, "Titulo e obrigatorio"),
  description: z.string().optional(),
  type: z.string().min(1, "Selecione o tipo de prazo"),
  dueDate: z.string().min(1, "Data de vencimento e obrigatoria"),
});

type DeadlineFormValues = z.infer<typeof deadlineSchema>;

const DEADLINE_TYPES: DeadlineType[] = [
  "contestacao",
  "audiencia",
  "julgamento",
  "recurso",
  "pericia",
  "outro",
];

interface DeadlineDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  processId: string;
  processNumber: string;
  clientName: string;
  onAdd: (deadline: Deadline) => void;
}

export function DeadlineDialog({
  isOpen,
  onOpenChange,
  processId,
  processNumber,
  clientName,
  onAdd,
}: DeadlineDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DeadlineFormValues>({
    resolver: zodResolver(deadlineSchema),
  });

  const selectedType = watch("type");

  const onSubmit = (data: DeadlineFormValues) => {
    const today = new Date();
    const months = [
      "jan", "fev", "mar", "abr", "mai", "jun",
      "jul", "ago", "set", "out", "nov", "dez",
    ];
    const formattedDate = `${today.getDate().toString().padStart(2, "0")} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const newDeadline: Deadline = {
      id: Date.now().toString(),
      processId,
      processNumber,
      clientName,
      title: data.title,
      description: data.description || "",
      type: data.type as DeadlineType,
      dueDate: data.dueDate,
      status: "pendente",
      createdAt: formattedDate,
    };

    onAdd(newDeadline);
    toast.success(`Prazo "${data.title}" adicionado com sucesso!`);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] border-border bg-card">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 sm:mx-0">
            <Calendar className="h-6 w-6 text-gold" />
          </div>
          <DialogTitle className="font-heading text-xl text-foreground mt-4 sm:mt-0">
            Adicionar Prazo
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Registre um novo prazo para o processo <span className="font-medium text-foreground">{processNumber}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-foreground">
              Titulo do Prazo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ex: Prazo para contestacao"
              className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-foreground">
              Tipo de Prazo <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedType}
              onValueChange={(value: string) => setValue("type", value, { shouldValidate: true })}
            >
              <SelectTrigger
                id="type"
                className={errors.type ? "border-destructive focus-visible:ring-destructive" : ""}
              >
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {DEADLINE_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="cursor-pointer">
                    {getDeadlineTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium text-foreground">
              Data de Vencimento <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dueDate"
              type="date"
              className={errors.dueDate ? "border-destructive focus-visible:ring-destructive" : ""}
              {...register("dueDate")}
            />
            {errors.dueDate && (
              <p className="text-xs text-destructive">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Observacoes
            </Label>
            <Input
              id="description"
              placeholder="Detalhes adicionais sobre o prazo"
              {...register("description")}
            />
          </div>

          <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="cursor-pointer w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="cursor-pointer bg-gold hover:bg-gold-light text-primary font-medium gap-2 w-full sm:w-auto ml-auto"
            >
              <Clock className="h-4 w-4" />
              Adicionar Prazo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
