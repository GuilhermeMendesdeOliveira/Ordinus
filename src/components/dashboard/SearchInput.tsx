import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchInput({
  placeholder = "Buscar",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-primary-foreground/50"
        aria-hidden
      />
      <input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-primary-foreground/15 bg-primary-foreground/8 pr-3 pl-9 text-sm text-primary-foreground placeholder:text-primary-foreground/45 transition-colors duration-200 hover:border-gold/40 focus:border-gold/60 focus:outline-none"
      />
    </div>
  );
}
