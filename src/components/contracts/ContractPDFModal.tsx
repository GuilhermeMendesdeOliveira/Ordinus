import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContractPDF } from "./ContractPDF";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type { Contract } from "@/types/contract";

interface ContractPDFModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContractSent?: (contract: Contract) => void;
}

export function ContractPDFModal({
  contract,
  isOpen,
  onOpenChange,
  onContractSent,
}: ContractPDFModalProps) {
  const [isSending, setIsSending] = useState(false);

  if (!contract) return null;

  const handleSendToClient = async () => {
    if (!contract) return;

    setIsSending(true);
    try {
      const response = await apiClient.post(`/contracts/${contract.id}/send`);
      if (response.success) {
        toast.success("Contrato enviado ao cliente com sucesso!");
        if (onContractSent && response.data) {
          onContractSent(response.data as Contract);
        }
        onOpenChange(false);
      } else {
        toast.error(response.error?.message || "Erro ao enviar contrato");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar contrato");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden border-border bg-card">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-heading text-xl text-foreground">
              Visualizar Contrato - PDF
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <ContractPDF blocks={contract.blocks} showPreview />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          {/* Send to Client button - only show for draft contracts */}
          {contract.status === "draft" && (
            <Button
              onClick={handleSendToClient}
              disabled={isSending}
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
          {contract.status === "sent" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Send className="h-4 w-4" />
              <span>Contrato enviado ao cliente</span>
            </div>
          )}

          {/* Status indicator for signed contracts */}
          {contract.status === "signed" && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Download className="h-4 w-4" />
              <span>Contrato assinado</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
