import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, SectionTitle } from "@/components/system/Panel";
import { StatusBadge, type StatusTone } from "@/components/system/StatusBadge";

export type Activity = {
  id: string;
  title: string;
  date: string;
  icon: LucideIcon;
  status: { label: string; tone: StatusTone };
};

export function ActivityCard({
  activities,
  isLoading = false,
}: {
  activities: Activity[];
  isLoading?: boolean;
}) {
  return (
    <Panel>
      <SectionTitle title="Próximas Atividades" subtitle="Compromissos dos próximos dias" />
      <ul className="mt-6 flex flex-col gap-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="flex items-center gap-4 rounded-md px-2 py-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </li>
            ))
          : activities.map((activity, index) => (
              <motion.li
                key={activity.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-md px-2 py-3 transition-colors duration-200 hover:bg-secondary/40"
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/6 text-primary"
                  aria-hidden
                >
                  <activity.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {activity.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {activity.date}
                  </span>
                </span>
                <StatusBadge tone={activity.status.tone} label={activity.status.label} />
              </motion.li>
            ))}
      </ul>
    </Panel>
  );
}
