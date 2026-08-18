import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Plus, Eye, Trash2, FileText, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/system/StatusBadge';
import { toast } from 'sonner';
import { fetchContracts, deleteContract } from '@/lib/contracts-store';
import { ContractPDFModal } from './ContractPDFModal';
import type { Contract } from '@/types/contract';

export function ContractList() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

  useEffect(() => {
    fetchContracts().then(setContracts).catch(() => toast.error('Erro ao carregar contratos'));
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este contrato?')) {
      try {
        await deleteContract(id);
        setContracts(await fetchContracts());
        toast.success('Contrato excluído');
      } catch {
        toast.error('Erro ao excluir contrato');
      }
    }
  };

  const handleViewPDF = (contract: Contract) => {
    setSelectedContract(contract);
    setIsPDFModalOpen(true);
  };

  const handleContractSent = async () => {
    // Refresh the contracts list after sending
    try {
      const updatedContracts = await fetchContracts();
      setContracts(updatedContracts);
    } catch {
      toast.error('Erro ao atualizar lista de contratos');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contratos</h2>
          <p className="text-muted-foreground">
            Gerencie os contratos de honorários advocatícios
          </p>
        </div>
        <Button onClick={() => navigate({ to: '/contratos/novo' })}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Contrato
        </Button>
      </div>

      {contracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">Nenhum contrato encontrado</p>
          <p className="text-sm">Crie um novo contrato para começar</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Atualizado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">
                    {contract.clientName || 'Sem cliente'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      label={
                        contract.status === 'draft' ? 'Rascunho' :
                        contract.status === 'sent' ? 'Enviado' :
                        contract.status === 'final' ? 'Finalizado' :
                        contract.status === 'signed' ? 'Assinado' :
                        contract.status
                      }
                      tone={
                        contract.status === 'draft' ? 'warning' :
                        contract.status === 'sent' ? 'warning' :
                        contract.status === 'signed' ? 'success' :
                        'success'
                      }
                    />
                  </TableCell>
                  <TableCell>{formatDate(contract.createdAt)}</TableCell>
                  <TableCell>{formatDate(contract.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate({ to: '/contratos/$id', params: { id: contract.id } })}
                        title="Editar contrato"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewPDF(contract)}
                        title="Visualizar PDF"
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(contract.id)}
                        className="text-destructive hover:text-destructive"
                        title="Excluir contrato"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ContractPDFModal
        contract={selectedContract}
        isOpen={isPDFModalOpen}
        onOpenChange={setIsPDFModalOpen}
        onContractSent={handleContractSent}
      />
    </div>
  );
}
