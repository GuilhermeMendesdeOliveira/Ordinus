import { SearchInput } from "./SearchInput";
import { NotificationButton } from "./NotificationButton";
import { UserMenu } from "./UserMenu";

export function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="sticky top-0 z-20 grid h-auto grid-cols-1 gap-4 border-b border-primary-foreground/10 bg-primary px-6 py-4 lg:h-[70px] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-6 lg:py-0">
      <div className="min-w-0">
        <p className="truncate font-heading text-base text-primary-foreground">{title}</p>
        <p className="truncate text-xs text-primary-foreground/55">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <SearchInput className="min-w-0 flex-1 lg:w-64 lg:flex-none" />
        <NotificationButton count={4} />
        <UserMenu />
      </div>
    </header>
  );
}
