import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, FileText, X } from "lucide-react";
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
import type { DocumentCategory, ProcessDocument } from "@/lib/processes-store";

const documentSchema = z.object({
  name: z.string().min(2, "Nome do documento e obrigatorio"),
  category: z.string().min(1, "Selecione a categoria"),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  "CNH",
  "Comprovante de Residencia",
  "Certidao de Nascimento",
  "Carteira de Trabalho",
  "CPF",
  "RG",
  "Contrato",
  "Comprovante de Renda",
  "Procuracao",
  "Outro",
];

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (document: ProcessDocument) => void;
}

export function DocumentUploadDialog({
  isOpen,
  onOpenChange,
  onUpload,
}: DocumentUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
  });

  const selectedCategory = watch("category");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (data: DocumentFormValues) => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo para upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target?.result as string;

      const today = new Date();
      const months = [
        "jan", "fev", "mar", "abr", "mai", "jun",
        "jul", "ago", "set", "out", "nov", "dez",
      ];
      const formattedDate = `${today.getDate().toString().padStart(2, "0")} ${months[today.getMonth()]} ${today.getFullYear()}`;

      const newDocument: ProcessDocument = {
        id: Date.now().toString(),
        name: data.name,
        category: data.category as DocumentCategory,
        fileName: selectedFile.name,
        fileData,
        mimeType: selectedFile.type,
        uploadDate: formattedDate,
      };

      onUpload(newDocument);
      toast.success(`Documento "${data.name}" adicionado com sucesso!`);
      handleClose();
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    setPreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] border-border bg-card">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 sm:mx-0">
            <Upload className="h-6 w-6 text-gold" />
          </div>
          <DialogTitle className="font-heading text-xl text-foreground mt-4 sm:mt-0">
            Adicionar Documento
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Faca upload de um documento para este processo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Nome do Documento <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ex: CNH do cliente"
              className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-foreground">
              Categoria <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={(value: string) => setValue("category", value, { shouldValidate: true })}
            >
              <SelectTrigger
                id="category"
                className={errors.category ? "border-destructive focus-visible:ring-destructive" : ""}
              >
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="cursor-pointer">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium text-foreground">
              Arquivo <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="cursor-pointer file:cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
              />
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                  className="text-destructive hover:text-destructive/80 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {preview && (
            <div className="rounded-md border border-border p-2">
              <img
                src={preview}
                alt="Preview"
                className="max-h-40 w-auto mx-auto rounded"
              />
            </div>
          )}

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
              <Upload className="h-4 w-4" />
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
