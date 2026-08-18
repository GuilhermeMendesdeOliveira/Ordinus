import { useState } from "react";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { LogIn, Scale } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClientAuth } from "@/lib/client-auth-context";

import logoVinho from "@/assets/LogoCompletaVinho.png";
import LogoBranca from "@/assets/Jeniffer Lemes Advocacia.png";

export const Route = createFileRoute("/portal/login")({
  component: ClientLoginPage,
  beforeLoad: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("ordinus_access_token");
      if (token) {
        throw redirect({ to: "/portal" });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Portal do Cliente | Jeniffer Lemes Advocacia" },
      {
        name: "description",
        content: "Acesse o portal do cliente para acompanhar seus processos e contratos.",
      },
    ],
  }),
});

function ClientLoginPage() {
  const navigate = useNavigate();
  const { login } = useClientAuth();
  const [processNumber, setProcessNumber] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!processNumber || !cpfCnpj) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    const success = await login(processNumber, cpfCnpj);
    setIsLoading(false);

    if (success) {
      toast.success("Login realizado com sucesso!");
      // Use full page reload to ensure auth state is properly loaded
      window.location.href = "/portal";
    } else {
      toast.error("Número do processo ou CPF/CNPJ inválidos.");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <img src={LogoBranca} alt="Logo Jeniffer Lemes Advocacia" className="h-16 w-auto" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            Portal do Cliente
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Acesse para acompanhar seus processos e contratos.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="processNumber" className="text-sm font-medium text-foreground">
                Número do Processo
              </Label>
              <Input
                id="processNumber"
                type="text"
                placeholder="0000000-00.0000.0.00.0000"
                value={processNumber}
                onChange={(e) => setProcessNumber(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpfCnpj" className="text-sm font-medium text-foreground">
                CPF/CNPJ
              </Label>
              <Input
                id="cpfCnpj"
                type="text"
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 cursor-pointer bg-gold hover:bg-gold-light text-primary font-medium gap-2"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {isLoading ? "Entrando..." : "Acessar Portal"}
            </Button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            Informe o número do seu processo e o CPF/CNPJ cadastrado no escritório para acessar o portal.
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#4C1D24] items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-4">
            <img src={logoVinho} alt="Logo Jeniffer Lemes Advocacia" className="h-64 w-auto" />
          </div>
          <h2 className="text-3xl font-heading font-extralight text-white mb-4">
            Acompanhe seus casos
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Visualize seus contratos, acompanhe o andamento dos seus processos
            e receba notificações importantes do escritório.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-2xl font-bold text-gold">24h</p>
              <p className="text-xs text-white/60">Acesso</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-2xl font-bold text-gold">100%</p>
              <p className="text-xs text-white/60">Digital</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-2xl font-bold text-gold">Online</p>
              <p className="text-xs text-white/60">Assinatura</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
