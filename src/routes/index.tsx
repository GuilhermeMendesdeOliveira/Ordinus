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

export const Route = createFileRoute("/")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Painel de Controle | Mendes & Aragão Advocacia" },
      {
        name: "description",
        content:
          "Painel de controle do escritório Mendes & Aragão: clientes, processos, audiências e atividades em uma visão única.",
      },
      { property: "og:title", content: "Painel de Controle | Mendes & Aragão Advocacia" },
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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar activeLabel="Dashboard" />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Painel de Controle" subtitle="Mendes & Aragão — Advocacia Empresarial" />

        <main className="flex-1">
          <Container className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl tracking-tight text-foreground">Painel de Controle</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Visão geral das informações do escritório
              </p>
            </div>

            <section
              aria-label="Indicadores"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
            >
              {isLoading
                ? metrics.map((metric) => <MetricCardSkeleton key={metric.label} />)
                : metrics.map((metric, index) => (
                    <MetricCard key={metric.label} metric={metric} index={index} />
                  ))}
            </section>

            <DashboardTable rows={rows} isLoading={isLoading} />

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
              <ChartCard data={chartData} isLoading={isLoading} />
              <ActivityCard activities={activities} isLoading={isLoading} />
            </section>
          </Container>
          <div className="h-6" aria-hidden />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
