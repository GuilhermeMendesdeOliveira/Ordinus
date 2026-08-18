import { useState, useEffect } from "react";
import { Bell, Search } from "lucide-react";
import { useClientAuth } from "@/lib/client-auth-context";
import { fetchUnreadCount } from "@/lib/notifications-store";
import { useNavigate } from "@tanstack/react-router";

export function ClientHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { client } = useClientAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (client) {
      const loadCount = async () => {
        const count = await fetchUnreadCount();
        setUnreadCount(count);
      };
      loadCount();
    }
  }, [client]);

  return (
    <header className="sticky top-0 z-20 grid h-auto grid-cols-1 gap-4 border-b border-primary-foreground/10 bg-primary px-6 py-4 lg:h-[70px] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-6 lg:py-0">
      <div className="min-w-0">
        <p className="truncate font-heading text-base text-primary-foreground">{title}</p>
        <p className="truncate text-xs text-primary-foreground/55">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate({ to: "/portal/notificacoes" })}
          className="relative grid h-10 w-10 shrink-0 place-items-center rounded-md border border-primary-foreground/15 text-primary-foreground/80 transition-colors duration-200 hover:border-gold/40 hover:text-primary-foreground cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold text-[10px] font-bold text-primary flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
