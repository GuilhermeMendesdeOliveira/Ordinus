import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Trash2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Deadline } from "@/lib/deadlines-store";
import {
  getStoredDeadlines,
  setStoredDeadlines,
  getDeadlineTypeLabel,
  getDeadlineTypeColor,
  getDaysUntilDue,
} from "@/lib/deadlines-store";
import { DeadlineDialog } from "./DeadlineDialog";

interface DeadlineListProps {
  processId: string;
  processNumber: string;
  clientName: string;
}

export function DeadlineList({
  processId,
  processNumber,
  clientName,
}: DeadlineListProps) {
  const [deadlines, setDeadlines] = useState<Deadline[]>(
    getStoredDeadlines().filter((d) => d.processId === processId)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddDeadline = (deadline: Deadline) => {
    const allDeadlines = getStoredDeadlines();
    const updated = [...allDeadlines, deadline];
    setStoredDeadlines(updated);
    setDeadlines(updated.filter((d) => d.processId === processId));
  };

  const handleToggleStatus = (deadlineId: string) => {
    const allDeadlines = getStoredDeadlines();
    const updated = allDeadlines.map((d) => {
      if (d.id === deadlineId) {
        const newStatus = d.status === "pendente" ? "concluido" : "pendente";
        return { ...d, status: newStatus as Deadline["status"] };
      }
      return d;
    });
    setStoredDeadlines(updated);
    setDeadlines(updated.filter((d) => d.processId === processId));
    toast.success("Status do prazo atualizado!");
  };

  const handleDeleteDeadline = (deadlineId: string) => {
    const allDeadlines = getStoredDeadlines();
    const updated = allDeadlines.filter((d) => d.id !== deadlineId);
    setStoredDeadlines(updated);
    setDeadlines(updated.filter((d) => d.processId === processId));
    toast.success("Prazo removido com sucesso.");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
  };

  const getDaysInfo = (deadline: Deadline) => {
    if (deadline.status === "concluido") return null;

    const days = getDaysUntilDue(deadline.dueDate);
    if (days < 0) {
      return (
        <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
          <AlertTriangle className="h-3 w-3" />
          Atrasado ({Math.abs(days)} dias)
        </span>
      );
    }
    if (days === 0) {
      return (
        <span className="flex items-center gap-1 text-xs text-orange-500 font-medium">
          <AlertTriangle className="h-3 w-3" />
          Vence hoje!
        </span>
      );
    }
    if (days <= 3) {
      return (
        <span className="flex items-center gap-1 text-xs text-orange-500 font-medium">
          <AlertTriangle className="h-3 w-3" />
          {days} dias restantes
        </span>
      );
    }
    return (
      <span className="text-xs text-muted-foreground">
        {days} dias restantes
      </span>
    );
  };

  const sortedDeadlines = [...deadlines].sort((a, b) => {
    if (a.status === "concluido" && b.status !== "concluido") return 1;
    if (a.status !== "concluido" && b.status === "concluido") return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">
          Prazos ({deadlines.filter((d) => d.status === "pendente").length} pendentes)
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="cursor-pointer gap-1"
        >
          <Plus className="h-3 w-3" />
          Adicionar
        </Button>
      </div>

      {sortedDeadlines.length > 0 ? (
        <div className="space-y-2">
          {sortedDeadlines.map((deadline) => (
            <div
              key={deadline.id}
              className={`flex items-start gap-3 rounded-md border p-3 transition-colors ${
                deadline.status === "concluido"
                  ? "bg-muted/30 border-border/50"
                  : "bg-card border-border hover:bg-secondary/30"
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggleStatus(deadline.id)}
                className="mt-0.5 cursor-pointer"
              >
                {deadline.status === "concluido" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground hover:text-gold" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className={`text-sm font-medium ${
                      deadline.status === "concluido"
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }`}
                  >
                    {deadline.title}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getDeadlineTypeColor(
                      deadline.type
                    )}`}
                  >
                    {getDeadlineTypeLabel(deadline.type)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    Vence em: {formatDate(deadline.dueDate)}
                  </span>
                  {getDaysInfo(deadline)}
                </div>

                {deadline.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {deadline.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDeleteDeadline(deadline.id)}
                className="text-muted-foreground hover:text-destructive cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 border border-dashed border-border rounded-md">
          <Calendar className="h-8 w-8 text-muted-foreground opacity-50" />
          <p className="mt-2 text-sm text-muted-foreground">
            Nenhum prazo registrado
          </p>
          <p className="text-xs text-muted-foreground">
            Clique em "Adicionar" para criar um prazo
          </p>
        </div>
      )}

      <DeadlineDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        processId={processId}
        processNumber={processNumber}
        clientName={clientName}
        onAdd={handleAddDeadline}
      />
    </div>
  );
}
