import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Briefcase,
  CalendarCheck,
  CalendarDays,
  FilePlus,
  FileSignature,
  Gavel,
  User,
  Users,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Container } from "@/components/system/Container";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MetricCard, MetricCardSkeleton, type Metric } from "@/components/dashboard/MetricCard";
import { DashboardTable, type ClientRow } from "@/components/dashboard/DashboardTable";
import { ChartCard, type ChartPoint } from "@/components/dashboard/ChartCard";
import { ActivityCard, type Activity } from "@/components/dashboard/ActivityCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useSidebar } from "@/lib/sidebar-context";
import { getStoredClients } from "@/lib/clients-store";

export const Route = createFileRoute("/")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Painel de Controle | Jeniffer Lemes Advocacia" },
      {
        name: "description",
        content:
          "Painel de controle do escritório Jeniffer Lemes: clientes, processos, audiências e atividades em uma visão única.",
      },
      { property: "og:title", content: "Painel de Controle | Jeniffer Lemes Advocacia" },
      {
        property: "og:description",
        content: "Visão geral das informações do escritório: clientes, processos e agenda.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const metrics: Metric[] = [
  { label: "Total de Clientes", value: "258", icon: User, hint: "+12 neste mês" },
  { label: "Casos Ativos", value: "112", icon: Briefcase, hint: "8 em fase recursal" },
  { label: "Audiências Agendadas", value: "18", icon: CalendarDays, hint: "3 nos próximos 7 dias" },
  { label: "Novas Demandas", value: "23", icon: FilePlus, hint: "5 aguardando triagem" },
];

const rows: ClientRow[] = [
  {
    id: "1",
    client: "Construtora Vale Norte",
    matter: "0021458-77.2026",
    status: { label: "Em andamento", tone: "success" },
    date: "28 jul 2026",
    owner: "Dr. Rafael Mendes",
  },
  {
    id: "2",
    client: "Instituto Villa Bela",
    matter: "0018723-04.2026",
    status: { label: "Aguardando", tone: "warning" },
    date: "26 jul 2026",
    owner: "Dra. Helena Aragão",
  },
  {
    id: "3",
    client: "Grupo Aurora Holdings",
    matter: "0014902-31.2026",
    status: { label: "Prazo crítico", tone: "danger" },
    date: "24 jul 2026",
    owner: "Dr. Vitor Salles",
  },
  {
    id: "4",
    client: "Marina Duarte Participações",
    matter: "0011684-59.2026",
    status: { label: "Em andamento", tone: "success" },
    date: "21 jul 2026",
    owner: "Dra. Camila Reis",
  },
];

const chartData: ChartPoint[] = [
  { name: "Cível", total: 42 },
  { name: "Trabalhista", total: 31 },
  { name: "Tributário", total: 24 },
  { name: "Societário", total: 18 },
  { name: "Penal", total: 9 },
];

const activities: Activity[] = [
  {
    id: "1",
    title: "Audiência — Grupo Aurora",
    date: "03 ago, 09h30",
    icon: Gavel,
    status: { label: "Confirmada", tone: "success" },
  },
  {
    id: "2",
    title: "Assinatura de contrato",
    date: "04 ago, 14h00",
    icon: FileSignature,
    status: { label: "Pendente", tone: "warning" },
  },
  {
    id: "3",
    title: "Reunião com Vale Norte",
    date: "05 ago, 11h00",
    icon: Users,
    status: { label: "Confirmada", tone: "success" },
  },
  {
    id: "4",
    title: "Prazo recursal — Villa Bela",
    date: "06 ago, 18h00",
    icon: CalendarCheck,
    status: { label: "Vence hoje", tone: "danger" },
  },
];

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    setClients(getStoredClients());
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const dynamicMetrics: Metric[] = [
    { label: "Total de Clientes", value: clients.length.toString(), icon: User, hint: "+12 neste mes" },
    { label: "Casos Ativos", value: clients.filter(c => c.status.label === "Em andamento").length.toString(), icon: Briefcase, hint: "Em andamento" },
    { label: "Audiencias Agendadas", value: "18", icon: CalendarDays, hint: "3 nos proximos 7 dias" },
    { label: "Novas Demandas", value: "23", icon: FilePlus, hint: "5 aguardando triagem" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar activeLabel="Dashboard" />

        <div
          className="flex flex-col flex-1 min-w-0"
          style={{
            marginLeft: isCollapsed ? "76px" : "260px",
            transition: "margin-left 500ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Header title="Painel de Controle" subtitle="Jeniffer Lemes - Advocacia Empresarial" />

          <main className="flex-1 overflow-y-auto">
            <Container className="flex flex-col gap-6 py-6">
              <div>
                <h1 className="text-3xl tracking-tight text-foreground">Painel de Controle</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Visao geral das informacoes do escritorio
                </p>
              </div>

              <section
                aria-label="Indicadores"
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
              >
                {isLoading
                  ? dynamicMetrics.map((metric) => <MetricCardSkeleton key={metric.label} />)
                  : dynamicMetrics.map((metric, index) => (
                      <MetricCard key={metric.label} metric={metric} index={index} />
                    ))}
              </section>

              <DashboardTable rows={clients.slice(0, 4)} isLoading={isLoading} />

              <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                <ChartCard data={chartData} isLoading={isLoading} />
                <ActivityCard activities={activities} isLoading={isLoading} />
              </section>
            </Container>
          </main>
        </div>

        <Toaster />
      </div>
    </ProtectedRoute>
  );
}
