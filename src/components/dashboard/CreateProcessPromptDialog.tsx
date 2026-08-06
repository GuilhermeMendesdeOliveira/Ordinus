import { FileText, ArrowRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateProcessPromptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  onConfirm: () => void;
}

export function CreateProcessPromptDialog({
  isOpen,
  onOpenChange,
  clientName,
  onConfirm,
}: CreateProcessPromptDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-border bg-card">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 sm:mx-0">
            <FileText className="h-6 w-6 text-gold" />
          </div>
          <DialogTitle className="font-heading text-xl text-foreground mt-4 sm:mt-0">
            Criar Processo
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            O cliente <span className="font-medium text-foreground">{clientName}</span> foi cadastrado com sucesso!
            <br />
            Deseja criar um novo processo para este cliente?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="cursor-pointer gap-2 w-full sm:w-auto"
          >
            <X className="h-4 w-4" />
            Agora não
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="cursor-pointer bg-gold hover:bg-gold-light text-primary font-medium gap-2 w-full sm:w-auto"
          >
            Criar Processo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
