import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Container } from '@/components/system/Container';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { ContractBuilder } from '@/components/contracts/ContractBuilder';
import { useSidebar } from '@/lib/sidebar-context';
import { cn } from '@/lib/utils';

interface ContratoNovoSearch {
  clientId?: string | undefined;
  template?: string | undefined;
}

export const Route = createFileRoute('/contratos/novo')({
  component: ContratoNovoPage,
  validateSearch: (search: Record<string, unknown>): ContratoNovoSearch => {
    return {
      clientId: search['clientId'] as string | undefined,
      template: search['template'] as string | undefined,
    };
  },
  head: () => ({
    meta: [
      { title: 'Novo Contrato | Mendes & Aragão Advocacia' },
      {
        name: 'description',
        content: 'Criar novo contrato de honorários advocatícios.',
      },
    ],
  }),
});

function ContratoNovoPage() {
  const { isCollapsed } = useSidebar();
  const { clientId } = Route.useSearch();

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
          title="Novo Contrato"
          subtitle="Monte seu contrato de honorários advocatícios"
        />

        <main className="flex-1 overflow-hidden">
          <Container className="h-full py-6">
            <ContractBuilder initialClientId={clientId} />
          </Container>
        </main>
      </div>
    </div>
  );
}
