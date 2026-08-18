import { Link, useNavigate } from "@tanstack/react-router";
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
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
  ScaleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useSidebar } from "@/lib/sidebar-context";

type NavItem = { label: string; icon: LucideIcon; to: string };

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Clientes", icon: Users, to: "/clientes" },
  { label: "Processos", icon: Briefcase, to: "/processos" },
  { label: "Contratos", icon: FileText, to: "/contratos" },
  // { label: "Financeiro", icon: Wallet, to: "/financeiro" },
  // { label: "Agenda", icon: CalendarDays, to: "/agenda" },
  // { label: "Documentos", icon: FileText, to: "/documentos" },
  // { label: "CRM", icon: Contact, to: "/crm" },
  // { label: "Relatorios", icon: BarChart3, to: "/relatorios" },
  { label: "Configuracoes", icon: Settings, to: "/configuracoes" },
];

export function Sidebar({ activeLabel = "Dashboard" }: { activeLabel?: string }) {
  const { user, logout } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <>
      <aside
        className={cn(
          "hidden fixed inset-y-0 left-0 z-30 flex-col lg:flex",
          "transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
          isCollapsed ? "w-[76px]" : "w-[260px]"
        )}
        aria-label="Navegacao principal"
      >
        {/* Background com gradiente usando cores do sistema */}
        <div className="absolute inset-0 bg-sidebar shadow-[8px_0_40px_rgba(74,18,33,0.4)]" />

        {/* Efeito de brilho sutil no topo */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/[0.05] to-transparent rounded-tr-xl" />

        {/* Efeito de profundidade nas bordas */}
        <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-gradient-to-b from-white/[0.1] via-white/[0.05] to-transparent" />

        {/* Conteudo */}
        <div className="relative flex flex-col h-full z-10">
          {/* Header com Logo */}
          <div className={cn(
            "flex items-center px-4 py-5 transition-all duration-500",
            isCollapsed ? "justify-center" : ""
          )}>
            <div className={cn(
              "flex items-center gap-3 min-w-0",
              "transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
              isCollapsed && "justify-center"
            )}>
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gold/30 rounded-xl blur-lg animate-pulse" />
                <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold/40 to-gold/20 border border-gold/40 font-heading text-base text-gold shadow-[0_4px_25px_rgba(212,175,55,0.3)] transition-all duration-500">
                  JL
                </div>
              </div>
              <div className={cn(
                "overflow-hidden transition-all duration-500",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}>
                <span className="block truncate font-heading text-sm tracking-wide text-white whitespace-nowrap">
                  Jeniffer Lemes <ScaleIcon className="inline h-4 w-4 opacity-70" />
                </span>
                <span className="block truncate text-[11px] text-white/40 whitespace-nowrap">
                  Advocacia Empresarial
                </span>
              </div>
            </div>
          </div>

          {/* Separador com brilho dourado */}
          <div className="mx-4 my-1">
            <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </div>

          {/* Navegacao */}
          <nav className="flex flex-col gap-1 px-2 py-3 flex-1">
            {navItems.map((item) => {
              const isActive = item.label === activeLabel;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  aria-current={isActive ? "page" : undefined}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "group relative flex min-h-[46px] items-center rounded-xl text-sm overflow-hidden",
                    "transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
                    isCollapsed ? "justify-center px-2" : "gap-3 px-3.5",
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white/80",
                  )}
                >
                  {/* Background ativo com efeito 3D */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl transition-all duration-500",
                    isActive
                      ? "bg-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_20px_rgba(0,0,0,0.25)]"
                      : "bg-transparent group-hover:bg-white/[0.04]"
                  )} />

                  {/* Barra lateral ativa com animacao */}
                  <div className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 rounded-full transition-all duration-500",
                    isActive
                      ? "w-[3px] h-7 bg-gold shadow-[0_0_15px_rgba(212,175,55,0.6)]"
                      : "w-0 h-0 bg-transparent"
                  )} />

                  {/* Icone */}
                  <div className={cn(
                    "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    "transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
                    isActive
                      ? "bg-gold/25 shadow-[0_3px_12px_rgba(212,175,55,0.3)]"
                      : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                  )}>
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors duration-500",
                        isActive ? "text-gold" : "text-current"
                      )}
                      aria-hidden
                    />
                  </div>

                  {/* Label com animacao de fade */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-500",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}>
                    <span className={cn(
                      "relative truncate font-medium whitespace-nowrap transition-colors duration-500",
                      isActive && "text-white"
                    )}>
                      {item.label}
                    </span>
                  </div>

                  {/* Badge de indicator para item ativo */}
                  <div className={cn(
                    "absolute right-3 h-1.5 w-1.5 rounded-full bg-gold transition-all duration-500",
                    isActive && !isCollapsed
                      ? "opacity-100 shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                      : "opacity-0"
                  )} />

                  {/* Tooltip para modo colapsado */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 rounded-lg bg-[#1a1a2e]/95 backdrop-blur-md text-white text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-white/[0.08]">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Separador com brilho */}
          <div className="mx-4 my-1">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Usuario e Logout */}
          {user && (
            <div className={cn(
              "px-3 pb-4 transition-all duration-500",
              isCollapsed && "px-2"
            )}>
              <div className={cn(
                "relative rounded-xl bg-white/[0.04] border border-white/[0.06] p-3",
                "shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]",
                "transition-all duration-500",
                isCollapsed ? "mx-0" : "mx-1"
              )}>
                <div className={cn(
                  "relative flex items-center gap-3",
                  "transition-all duration-500",
                  !isCollapsed && "mb-3",
                  isCollapsed && "justify-center"
                )}>
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-gold/20 rounded-full blur-sm" />
                    <div className={cn(
                      "relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 text-gold text-sm font-semibold shadow-[0_4px_15px_rgba(212,175,55,0.2)]",
                      "transition-all duration-500",
                      isCollapsed ? "h-9 w-9" : "h-10 w-10"
                    )}>
                      {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  </div>
                  <div className={cn(
                    "overflow-hidden transition-all duration-500",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}>
                    <p className="text-sm font-semibold text-white truncate whitespace-nowrap">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-white/40 capitalize whitespace-nowrap">
                      {user.role}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  title={isCollapsed ? "Encerrar Sessao" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/50",
                    "transition-all duration-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer w-full",
                    isCollapsed ? "justify-center" : ""
                  )}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <div className={cn(
                    "overflow-hidden transition-all duration-500",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}>
                    <span className="whitespace-nowrap">Encerrar Sessao</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Toggle Button - Sobreposto na borda do sidebar */}
      <div
        className={cn(
          "hidden lg:flex fixed z-40 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
          isCollapsed ? "left-[76px]" : "left-[260px]"
        )}
        style={{ top: "50%", transform: "translateY(-50%) translateX(-50%)" }}
      >
        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            "group relative flex items-center justify-center cursor-pointer",
            "transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
            "bg-sidebar border border-white/[0.1] hover:border-gold/40",
            "shadow-[4px_0_20px_rgba(74,18,33,0.5)] hover:shadow-[4px_0_30px_rgba(212,175,55,0.3)]",
            "rounded-full"
          )}
          style={{ width: "32px", height: "32px" }}
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {/* Efeito de brilho */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Icone animado */}
          <div className={cn(
            "relative flex items-center justify-center transition-all duration-500",
            "text-white/60 group-hover:text-gold"
          )}>
            {isCollapsed ? (
              <ChevronsRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5" />
            ) : (
              <ChevronsLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-0.5" />
            )}
          </div>
        </button>
      </div>
    </>
  );
}
