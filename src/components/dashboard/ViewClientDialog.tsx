import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  User,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  FileText,
  Building,
} from "lucide-react";
import type { ClientRow } from "./DashboardTable";
import { StatusBadge } from "@/components/system/StatusBadge";

interface ViewClientDialogProps {
  client: ClientRow | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewClientDialog({
  client,
  isOpen,
  onOpenChange,
}: ViewClientDialogProps) {
  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] border-border bg-card">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="font-heading text-2xl text-foreground flex items-center gap-2">
              <User className="h-6 w-6 text-gold" />
              Detalhes do Cliente
            </DialogTitle>
            <div className="mr-6">
              <StatusBadge tone={client.status.tone} label={client.status.label} />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Seção 1: Dados Pessoais */}
          <div>
            <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Dados Pessoais
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-lg border border-border/50">
              <div>
                <span className="block text-xs text-muted-foreground">Nome Completo</span>
                <span className="text-sm font-medium text-foreground">{client.client}</span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">E-mail</span>
                <span className="text-sm font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  {client.email || <span className="italic text-muted-foreground/60">Não informado</span>}
                </span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Telefone</span>
                <span className="text-sm font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {client.phone || <span className="italic text-muted-foreground/60">Não informado</span>}
                </span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">CPF / CNPJ</span>
                <span className="text-sm font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  {client.cpfCnpj || <span className="italic text-muted-foreground/60">Não informado</span>}
                </span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">RG</span>
                <span className="text-sm font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  {client.rg || <span className="italic text-muted-foreground/60">Não informado</span>}
                </span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Data de Nascimento</span>
                <span className="text-sm font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {client.birthDate || <span className="italic text-muted-foreground/60">Não informado</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Seção 2: Dados do Processo */}
          <div>
            <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Informações do Processo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-lg border border-border/50">
              <div>
                <span className="block text-xs text-muted-foreground">Número do Processo</span>
                <span className="text-sm font-medium text-foreground">{client.matter}</span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Advogado Responsável</span>
                <span className="text-sm font-medium text-foreground">{client.owner}</span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Data de Registro</span>
                <span className="text-sm font-medium text-foreground">{client.date}</span>
              </div>
            </div>
          </div>

          {/* Seção 3: Endereço */}
          <div>
            <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Endereço
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-lg border border-border/50">
              <div className="sm:col-span-2">
                <span className="block text-xs text-muted-foreground">Endereço / Logradouro</span>
                <span className="text-sm font-medium text-foreground">
                  {client.address ? (
                    `${client.address}${client.number ? `, ${client.number}` : ""}`
                  ) : (
                    <span className="italic text-muted-foreground/60">Não informado</span>
                  )}
                </span>
              </div>
              {client.complement && (
                <div>
                  <span className="block text-xs text-muted-foreground">Complemento</span>
                  <span className="text-sm font-medium text-foreground">{client.complement}</span>
                </div>
              )}
              <div>
                <span className="block text-xs text-muted-foreground">Bairro</span>
                <span className="text-sm font-medium text-foreground">
                  {client.neighborhood || <span className="italic text-muted-foreground/60">Não informado</span>}
                </span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Cidade / UF</span>
                <span className="text-sm font-medium text-foreground">
                  {client.city && client.uf ? (
                    `${client.city} - ${client.uf}`
                  ) : (
                    <span className="italic text-muted-foreground/60">Não informado</span>
                  )}
                </span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">CEP</span>
                <span className="text-sm font-medium text-foreground">
                  {client.cep || <span className="italic text-muted-foreground/60">Não informado</span>}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer bg-gold hover:bg-gold-light text-primary font-medium"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
