import { Bell } from "lucide-react";

export function NotificationButton({ count = 0 }: { count?: number }) {
  return (
    <button
      type="button"
      aria-label={`Notificações${count ? `: ${count} não lidas` : ""}`}
      className="relative grid h-10 w-10 shrink-0 place-items-center rounded-md border border-primary-foreground/15 text-primary-foreground/80 transition-colors duration-200 hover:border-gold/40 hover:text-primary-foreground"
    >
      <Bell className="h-4 w-4" aria-hidden />
      {count > 0 ? (
        <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
      ) : null}
    </button>
  );
}
