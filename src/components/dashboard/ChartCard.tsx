import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, SectionTitle } from "@/components/system/Panel";

export type ChartPoint = { name: string; total: number };

export function ChartCard({ data, isLoading = false }: { data: ChartPoint[]; isLoading?: boolean }) {
  return (
    <Panel>
      <SectionTitle title="Distribuição dos Processos" subtitle="Por área de atuação" />
      <div className="mt-6 h-[260px]">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-md" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap={28}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={28}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "var(--color-secondary)", opacity: 0.5 }}
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  fontSize: 12,
                  color: "var(--color-foreground)",
                }}
              />
              <Bar dataKey="total" name="Processos" fill="var(--color-primary)" radius={[8, 8, 0, 0]} maxBarSize={38} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Panel>
  );
}
