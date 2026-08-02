import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({
  name = "Dra. Helena Aragão",
  role = "Sócia Fundadora",
  initials = "HA",
}: {
  name?: string;
  role?: string;
  initials?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menu do usuário"
        className="flex min-h-10 items-center gap-3 rounded-md border border-primary-foreground/15 pr-3 pl-1.5 text-left transition-colors duration-200 hover:border-gold/40"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/20 text-[11px] font-medium text-gold">
          {initials}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate text-xs font-medium text-primary-foreground">{name}</span>
          <span className="block truncate text-[10px] text-primary-foreground/55">{role}</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-primary-foreground/60" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserRound className="h-4 w-4" aria-hidden />
          Meu perfil
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="h-4 w-4" aria-hidden />
          Preferências
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="h-4 w-4" aria-hidden />
          Encerrar sessão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
