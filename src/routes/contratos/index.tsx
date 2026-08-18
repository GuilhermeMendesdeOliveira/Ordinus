import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/components/system/Container';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { ContractList } from '@/components/contracts/ContractList';
import { useSidebar } from '@/lib/sidebar-context';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/contratos/')({
  component: ContratosPage,
  head: () => ({
    meta: [
      { title: 'Contratos | Mendes & Aragão Advocacia' },
      {
        name: 'description',
        content: 'Gerenciamento de contratos de honorários advocatícios.',
      },
    ],
  }),
});

function ContratosPage() {
  const { isCollapsed } = useSidebar();

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
          title="Contratos"
          subtitle="Gerencie contratos de honorários advocatícios"
        />

        <main className="flex-1 overflow-y-auto">
          <Container className="py-6">
            <ContractList />
          </Container>
        </main>
      </div>
    </div>
  );
}
