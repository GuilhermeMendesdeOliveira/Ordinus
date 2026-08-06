import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, FileText } from "lucide-react";

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
import type { ProcessArea } from "@/lib/processes-store";

const processSchema = z.object({
  area: z.enum(["Cível", "Trabalhista", "Previdenciária"], {
    required_error: "Selecione a área do processo",
  }),
});

type ProcessFormValues = z.infer<typeof processSchema>;

interface RegisterProcessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  processNumber: string;
  onConfirm: (data: { processNumber: string; area: ProcessArea }) => void;
}

export function RegisterProcessDialog({
  isOpen,
  onOpenChange,
  clientName,
  processNumber,
  onConfirm,
}: RegisterProcessDialogProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProcessFormValues>({
    resolver: zodResolver(processSchema),
  });

  const selectedArea = watch("area");

  const onSubmit = (data: ProcessFormValues) => {
    onConfirm({
      processNumber: processNumber,
      area: data.area,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => {
      if (!open) reset();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[500px] border-border bg-card">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 sm:mx-0">
            <FileText className="h-6 w-6 text-gold" />
          </div>
          <DialogTitle className="font-heading text-xl text-foreground mt-4 sm:mt-0">
            Novo Processo
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Preencha as informações do processo para o cliente <span className="font-medium text-foreground">{clientName}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="processNumber" className="text-sm font-medium text-foreground">
              Número do Processo
            </Label>
            <Input
              id="processNumber"
              value={processNumber}
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Número gerado automaticamente pelo sistema
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area" className="text-sm font-medium text-foreground">
              Área do Processo <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedArea}
              onValueChange={(value: string) => setValue("area", value as ProcessArea, { shouldValidate: true })}
            >
              <SelectTrigger
                id="area"
                className={errors.area ? "border-destructive focus-visible:ring-destructive" : ""}
              >
                <SelectValue placeholder="Selecione a área" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="Cível" className="cursor-pointer">Cível</SelectItem>
                <SelectItem value="Trabalhista" className="cursor-pointer">Trabalhista</SelectItem>
                <SelectItem value="Previdenciária" className="cursor-pointer">Previdenciária</SelectItem>
              </SelectContent>
            </Select>
            {errors.area && (
              <p className="text-xs text-destructive">{errors.area.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              className="cursor-pointer w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="cursor-pointer bg-gold hover:bg-gold-light text-primary font-medium gap-2 w-full sm:w-auto ml-auto"
            >
              <Save className="h-4 w-4" />
              Salvar Processo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
