import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type Metric = {
  label: string;
  value: string;
  icon: LucideIcon;
  hint: string;
};

export function MetricCard({
  metric,
  index = 0,
  className,
}: {
  metric: Metric;
  index?: number;
  className?: string;
}) {
  const { label, value, icon: Icon, hint } = metric;
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className={cn("surface-card flex h-[165px] flex-col justify-between p-6", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="min-w-0 text-sm text-muted-foreground">{label}</p>
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/6 text-primary"
          aria-hidden
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div>
        <p className="font-heading text-4xl leading-none text-gold">{value}</p>
        <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
      </div>
    </motion.article>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="surface-card flex h-[165px] flex-col justify-between p-6">
      <div className="flex items-start justify-between gap-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
