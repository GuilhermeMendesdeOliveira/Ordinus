import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({
  isOpen,
  onOpenChange,
  clientName,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-border bg-card">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 sm:mx-0">
            <Trash2 className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="font-heading text-xl text-foreground mt-4 sm:mt-0">
            Excluir Cliente
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Tem certeza que deseja excluir o cliente <span className="font-medium text-foreground">{clientName}</span>?
            <br />
            Esta ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="cursor-pointer bg-destructive hover:bg-destructive/90 text-white font-medium gap-2 w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
