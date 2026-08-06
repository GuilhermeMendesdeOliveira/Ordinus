import { useState } from "react";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { LogIn, Eye, EyeOff, Scale } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

import logoVinho from "@/assets/LogoCompletaVinho.png";
import LogoBranca from "@/assets/Jeniffer Lemes Advocacia.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  beforeLoad: () => {
    const stored = localStorage.getItem("ordinus_auth");
    if (stored) {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Login | Jeniffer Lemes Advocacia" },
      {
        name: "description",
        content: "Acesse o sistema de gestao juridica Jeniffer Lemes.",
      },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      toast.success("Login realizado com sucesso!");
      navigate({ to: "/" });
    } else {
      toast.error("Email ou senha invalidos.");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Lado Esquerdo - Formulario */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <img src={LogoBranca} alt="Logo Jeniffer Lemes Advocacia" className="h-16 w-auto" />
          </div>

          {/* Titulo */}
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Acesse o sistema para gerenciar seus processos e clientes.
          </p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
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
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Usuarios de demonstracao */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-4">
              Usuarios de demonstracao (senha: 123456)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("jeniffer@advocacia.com");
                  setPassword("123456");
                }}
                className="rounded-md border border-border px-3 py-2 text-left transition-colors hover:bg-secondary/50 cursor-pointer"
              >
                <p className="text-xs font-medium text-foreground">Jeniffer Lemes</p>
                <p className="text-[10px] text-muted-foreground">Admin</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("rafael@advocacia.com");
                  setPassword("123456");
                }}
                className="rounded-md border border-border px-3 py-2 text-left transition-colors hover:bg-secondary/50 cursor-pointer"
              >
                <p className="text-xs font-medium text-foreground">Rafael Mendes</p>
                <p className="text-[10px] text-muted-foreground">Advogado</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("helena@advocacia.com");
                  setPassword("123456");
                }}
                className="rounded-md border border-border px-3 py-2 text-left transition-colors hover:bg-secondary/50 cursor-pointer"
              >
                <p className="text-xs font-medium text-foreground">Helena Aragao</p>
                <p className="text-[10px] text-muted-foreground">Advogada</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("vitor@advocacia.com");
                  setPassword("123456");
                }}
                className="rounded-md border border-border px-3 py-2 text-left transition-colors hover:bg-secondary/50 cursor-pointer"
              >
                <p className="text-xs font-medium text-foreground">Vitor Salles</p>
                <p className="text-[10px] text-muted-foreground">Estagiario</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#4C1D24] items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-4">
            <img src={logoVinho} alt="Logo Jeniffer Lemes Advocacia" className="h-64 w-auto" />
          </div>
          <h2 className="text-3xl font-heading font-extralight text-white mb-4">
            Sistema de Gestao Juridica
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Gerencie seus processos, clientes e prazos em um so lugar.
            Acompanhe o andamento dos seus casos em tempo real.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-2xl font-bold text-gold">150+</p>
              <p className="text-xs text-white/60">Processos</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-2xl font-bold text-gold">80+</p>
              <p className="text-xs text-white/60">Clientes</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-2xl font-bold text-gold">98%</p>
              <p className="text-xs text-white/60">Sucesso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
