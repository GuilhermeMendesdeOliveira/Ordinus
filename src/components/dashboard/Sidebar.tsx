import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wallet,
  CalendarDays,
  FileText,
  Contact,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { label: string; icon: LucideIcon; to: string };

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Clientes", icon: Users, to: "/clientes" },
  { label: "Processos", icon: Briefcase, to: "/processos" },
  { label: "Financeiro", icon: Wallet, to: "/financeiro" },
  { label: "Agenda", icon: CalendarDays, to: "/agenda" },
  { label: "Documentos", icon: FileText, to: "/documentos" },
  { label: "CRM", icon: Contact, to: "/crm" },
  { label: "Relatórios", icon: BarChart3, to: "/relatorios" },
  { label: "Configurações", icon: Settings, to: "/configuracoes" },
];

export function Sidebar({ activeLabel = "Dashboard" }: { activeLabel?: string }) {
  return (
    <aside
      className="hidden w-[245px] shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex"
      aria-label="Navegação principal"
    >
      <div className="flex h-[70px] items-center gap-3 px-6">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-gold/40 font-heading text-base text-gold">
          MA
        </span>
        <span className="min-w-0">
          <span className="block truncate font-heading text-sm tracking-wide">
            Mendes &amp; Aragão
          </span>
          <span className="block truncate text-[11px] text-sidebar-foreground/55">
            Advocacia Empresarial
          </span>
        </span>
      </div>

      <nav className="mt-6 flex flex-col gap-1 px-3 pb-6">
        {navItems.map((item) => {
          const isActive = item.label === activeLabel;
          return (
            <Link
              key={item.label}
              to={item.to}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <span
                className={cn(
                  "h-4 w-[2px] rounded-full transition-colors",
                  isActive ? "bg-gold" : "bg-transparent",
                )}
                aria-hidden
              />
              <item.icon
                className={cn("h-4 w-4 shrink-0", isActive ? "text-gold" : "text-current")}
                aria-hidden
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
