import { Eye, Pencil, Inbox } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, type StatusTone } from "@/components/system/StatusBadge";
import { Panel, SectionTitle } from "@/components/system/Panel";

export type ClientRow = {
  id: string;
  client: string;
  matter: string;
  status: { label: string; tone: StatusTone };
  date: string;
  owner: string;
};

const columns = ["Cliente", "Processo", "Status", "Data", "Responsável", "Ações"];

export function DashboardTable({
  rows,
  isLoading = false,
}: {
  rows: ClientRow[];
  isLoading?: boolean;
}) {
  return (
    <Panel className="p-0">
      <div className="p-6">
        <SectionTitle title="Clientes Recentes" subtitle="Últimas movimentações registradas" />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column}
                  className="px-6 text-[11px] font-medium tracking-wider text-muted-foreground uppercase"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index} className="border-border">
                    {columns.map((column) => (
                      <TableCell key={column} className="px-6 py-5">
                        <Skeleton className="h-4 w-full max-w-28" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border transition-colors duration-200 hover:bg-secondary/40"
                  >
                    <TableCell className="px-6 py-5 text-sm font-medium text-foreground">
                      {row.client}
                    </TableCell>
                    <TableCell className="px-6 py-5 text-sm whitespace-nowrap text-muted-foreground">
                      {row.matter}
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <StatusBadge tone={row.status.tone} label={row.status.label} className="whitespace-nowrap" />
                    </TableCell>
                    <TableCell className="px-6 py-5 text-sm whitespace-nowrap text-muted-foreground">
                      {row.date}
                    </TableCell>
                    <TableCell className="px-6 py-5 text-sm text-muted-foreground">
                      {row.owner}
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <RowAction
                          label={`Visualizar ${row.client}`}
                          icon={Eye}
                          onClick={() => toast.success(`Processo de ${row.client} aberto`)}
                        />
                        <RowAction
                          label={`Editar ${row.client}`}
                          icon={Pencil}
                          onClick={() =>
                            toast("Confirmar edição?", {
                              description: `Alterar o registro de ${row.client}.`,
                              action: {
                                label: "Confirmar",
                                onClick: () => toast.success("Registro atualizado"),
                              },
                            })
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && rows.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-6 py-16 text-center">
                  <Inbox className="mx-auto h-6 w-6 text-muted-foreground" aria-hidden />
                  <p className="mt-3 text-sm text-foreground">Nenhum cliente recente</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Os registros aparecerão aqui assim que forem criados.
                  </p>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </Panel>
  );
}

function RowAction({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: typeof Eye;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors duration-200 hover:border-gold/50 hover:text-primary active:scale-95"
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
