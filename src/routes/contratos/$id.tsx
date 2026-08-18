import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Container } from '@/components/system/Container';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { ContractBuilder } from '@/components/contracts/ContractBuilder';
import { useSidebar } from '@/lib/sidebar-context';
import { cn } from '@/lib/utils';
import { fetchContractById } from '@/lib/contracts-store';
import type { Contract } from '@/types/contract';

export const Route = createFileRoute('/contratos/$id')({
  component: ContratoDetailPage,
  head: () => ({
    meta: [
      { title: 'Contrato | Mendes & Aragão Advocacia' },
      {
        name: 'description',
        content: 'Visualizar e editar contrato de honorários advocatícios.',
      },
    ],
  }),
});

function ContratoDetailPage() {
  const { id } = Route.useParams();
  const { isCollapsed } = useSidebar();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContractById(id)
      .then(setContract)
      .catch(() => setContract(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar activeLabel="Contratos" />

      <div
        className="flex flex-col flex-1 min-w-0"
        style={{
          marginLeft: isCollapsed ? '76px' : '260px',
          transition: 'margin-left 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Header
          title="Contrato"
          subtitle="Visualizar e editar contrato"
        />

        <main className="flex-1 overflow-hidden">
          <Container className="h-full py-6">
            <Link
              to="/contratos"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Contratos
            </Link>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-muted-foreground">Carregando contrato...</p>
              </div>
            ) : contract ? (
              <ContractBuilder initialContract={contract} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <ShieldAlert className="h-12 w-12 text-muted-foreground opacity-60" />
                <p className="mt-4 text-lg font-medium text-foreground">
                  Contrato não encontrado
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  O contrato solicitado não existe ou foi removido.
                </p>
                <Link
                  to="/contratos"
                  className="mt-6 inline-flex items-center justify-center rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-gold-light"
                >
                  Ir para Contratos
                </Link>
              </div>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
}
