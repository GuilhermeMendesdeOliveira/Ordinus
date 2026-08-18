import { Outlet, createFileRoute } from "@tanstack/react-router";
import { ClientAuthProvider } from "@/lib/client-auth-context";

export const Route = createFileRoute("/portal")({
  component: PortalLayout,
});

function PortalLayout() {
  return (
    <ClientAuthProvider>
      <Outlet />
    </ClientAuthProvider>
  );
}
