import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const name = user?.name || "Usuario";
  const role = user?.role || "user";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleLabels: Record<string, string> = {
    admin: "Administrador",
    advogado: "Advogado(a)",
    estagiario: "Estagiario(a)",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menu do usuario"
        className="flex min-h-10 items-center gap-3 rounded-md border border-primary-foreground/15 pr-3 pl-1.5 text-left transition-colors duration-200 hover:border-gold/40 cursor-pointer"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/20 text-[11px] font-medium text-gold">
          {initials}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate text-xs font-medium text-primary-foreground">{name}</span>
          <span className="block truncate text-[10px] text-primary-foreground/55">{roleLabels[role] || role}</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-primary-foreground/60" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <UserRound className="h-4 w-4" aria-hidden />
          Meu perfil
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="h-4 w-4" aria-hidden />
          Preferencias
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Encerrar Sessao
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
