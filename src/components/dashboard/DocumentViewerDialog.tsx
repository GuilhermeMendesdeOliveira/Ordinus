import { Download, X, FileText, Image } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProcessDocument } from "@/lib/processes-store";

interface DocumentViewerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: ProcessDocument | null;
}

export function DocumentViewerDialog({
  isOpen,
  onOpenChange,
  document: doc,
}: DocumentViewerDialogProps) {
  if (!doc) return null;

  const isImage = doc.mimeType.startsWith("image/");
  const isPdf = doc.mimeType === "application/pdf";

  const handleDownload = () => {
    const link = window.document.createElement("a");
    link.href = doc.fileData;
    link.download = doc.fileName;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] border-border bg-card overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                {isImage ? (
                  <Image className="h-5 w-5 text-gold" />
                ) : (
                  <FileText className="h-5 w-5 text-gold" />
                )}
              </div>
              <div>
                <DialogTitle className="font-heading text-lg text-foreground">
                  {doc.name}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  {doc.category} - Enviado em {doc.uploadDate}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="cursor-pointer gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4 rounded-md border border-border bg-muted/30 overflow-auto max-h-[60vh]">
          {isImage ? (
            <img
              src={doc.fileData}
              alt={doc.name}
              className="w-full h-auto"
            />
          ) : isPdf ? (
            <iframe
              src={doc.fileData}
              title={doc.name}
              className="w-full h-[60vh]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <FileText className="h-16 w-16 text-muted-foreground opacity-50" />
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Visualizacao nao disponivel para este tipo de arquivo.
              </p>
              <p className="mt-1 text-xs text-muted-foreground text-center">
                {doc.fileName}
              </p>
              <Button
                type="button"
                onClick={handleDownload}
                className="mt-4 cursor-pointer gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar Arquivo
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
