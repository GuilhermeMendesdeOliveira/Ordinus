import { Clock, Gavel, FileText, Send, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Movimentacao } from "@/lib/datajud-service";

interface ProcessTimelineProps {
  movimentacoes: Movimentacao[];
  isLoading?: boolean;
}

function getIconForTipo(tipo: Movimentacao["tipo"]) {
  switch (tipo) {
    case "distribuicao":
      return Send;
    case "movimentacao":
      return FileText;
    case "julgamento":
      return Gavel;
    case "publicacao":
      return Scale;
    default:
      return Clock;
  }
}

function getColorForTipo(tipo: Movimentacao["tipo"]) {
  switch (tipo) {
    case "distribuicao":
      return { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" };
    case "movimentacao":
      return { bg: "bg-gold/10", text: "text-gold", border: "border-gold/30" };
    case "julgamento":
      return { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30" };
    case "publicacao":
      return { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/30" };
    default:
      return { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" };
  }
}

function getLabelForTipo(tipo: Movimentacao["tipo"]) {
  switch (tipo) {
    case "distribuicao":
      return "Distribuicao";
    case "movimentacao":
      return "Movimentacao";
    case "julgamento":
      return "Julgamento";
    case "publicacao":
      return "Publicacao";
    default:
      return "Evento";
  }
}

function SkeletonTimelineItem() {
  return (
    <div className="relative flex gap-4 pb-8">
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted animate-pulse" />
      <div className="flex-1 pt-1">
        <div className="h-4 w-32 animate-pulse rounded bg-muted mb-2" />
        <div className="h-3 w-48 animate-pulse rounded bg-muted mb-1" />
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function ProcessTimeline({ movimentacoes, isLoading }: ProcessTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-0">
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonTimelineItem key={idx} />
        ))}
      </div>
    );
  }

  if (movimentacoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Clock className="h-10 w-10 text-muted-foreground opacity-50" />
        <p className="mt-2 text-sm text-muted-foreground">
          Nenhuma movimentacao encontrada
        </p>
      </div>
    );
  }

  const sortedMovimentacoes = [...movimentacoes].sort((a, b) => {
    const dateA = new Date(a.data.split(" ").reverse().join(" "));
    const dateB = new Date(b.data.split(" ").reverse().join(" "));
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-0">
      {sortedMovimentacoes.map((mov, idx) => {
        const Icon = getIconForTipo(mov.tipo);
        const colors = getColorForTipo(mov.tipo);
        const label = getLabelForTipo(mov.tipo);
        const isLast = idx === sortedMovimentacoes.length - 1;

        return (
          <div key={mov.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <div className="absolute left-5 top-10 h-full w-px bg-border" />
            )}

            <div
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                colors.bg,
                colors.border
              )}
            >
              <Icon className={cn("h-5 w-5", colors.text)} />
            </div>

            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    colors.bg,
                    colors.text
                  )}
                >
                  {label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {mov.data}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {mov.descricao}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {mov.orgao}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
