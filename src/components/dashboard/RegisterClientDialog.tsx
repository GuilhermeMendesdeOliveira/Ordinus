import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, ArrowRight, ArrowLeft, Save, MapPin, User } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClientRow } from "./DashboardTable";

const clientSchema = z.object({
  client: z.string().min(2, "O nome do cliente deve ter pelo menos 2 caracteres"),
  email: z.string().email("Formato de e-mail inválido").or(z.literal("")),
  phone: z.string().optional(),
  cpfCnpj: z.string().optional(),
  rg: z.string().optional(),
  birthDate: z.string().optional(),

  // Endereço
  cep: z.string().optional(),
  address: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  complement: z.string().optional(),
  city: z.string().optional(),
  uf: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export function RegisterClientDialog({
  onAddClient,
}: {
  onAddClient: (client: Omit<ClientRow, "id" | "date">) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      client: "",
      email: "",
      phone: "",
      cpfCnpj: "",
      rg: "",
      birthDate: "",
      cep: "",
      address: "",
      number: "",
      neighborhood: "",
      complement: "",
      city: "",
      uf: "",
    },
  });

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawCep = e.target.value;
    setValue("cep", rawCep);

    const cleaned = rawCep.replace(/\D/g, "");
    if (cleaned.length === 8) {
      try {
        toast.loading("Buscando CEP...", { id: "cep-loading" });
        const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = await response.json();

        if (data.erro) {
          toast.error("CEP não encontrado.", { id: "cep-loading" });
        } else {
          toast.success("Endereço encontrado!", { id: "cep-loading" });
          setValue("address", data.logradouro || "");
          setValue("neighborhood", data.bairro || "");
          setValue("city", data.localidade || "");
          setValue("uf", data.uf || "");
          
          setTimeout(() => {
            document.getElementById("number")?.focus();
          }, 150);
        }
      } catch (err) {
        toast.error("Erro ao conectar à API de CEP.", { id: "cep-loading" });
      }
    }
  };

  const handleNextStep = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const clientValue = getValues("client");
    if (clientValue && clientValue.length >= 2) {
      setStep(2);
    } else {
      toast.error("Por favor, preencha o nome do cliente (mínimo 2 caracteres).");
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const onSubmit = (data: ClientFormValues) => {
    onAddClient({
      client: data.client,
      email: data.email,
      phone: data.phone ?? "",
      cpfCnpj: data.cpfCnpj ?? "",
      rg: data.rg ?? "",
      birthDate: data.birthDate ?? "",
      matter: "",
      owner: "",
      status: {
        label: "Em andamento",
        tone: "success",
      },
      cep: data.cep ?? "",
      address: data.address ?? "",
      number: data.number ?? "",
      neighborhood: data.neighborhood ?? "",
      complement: data.complement ?? "",
      city: data.city ?? "",
      uf: data.uf ?? "",
    });
    setIsOpen(false);
    setStep(1);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => {
      setIsOpen(open);
      if (!open) {
        setStep(1);
        reset();
      }
    }}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer gap-2 bg-gold hover:bg-gold-light text-primary font-medium">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-foreground">
            Cadastrar Novo Cliente
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Insira as informações do cliente e do processo para registro no sistema.
          </DialogDescription>
        </DialogHeader>

        {/* Timeline/Stepper Visual */}
        <div className="flex items-center justify-between mb-4 mt-2 px-2">
          <button
            type="button"
            onClick={() => step === 2 && setStep(1)}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${step === 1 ? 'bg-gold text-primary scale-110 shadow-sm shadow-gold/30' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
              <User className="h-4 w-4" />
            </div>
            <span className={`text-xs font-medium transition-colors ${step === 1 ? 'text-foreground font-semibold' : 'text-muted-foreground group-hover:text-foreground'}`}>
              Dados Pessoais
            </span>
          </button>
          
          <div className="h-px bg-border flex-1 mx-4"></div>
          
          <button
            type="button"
            onClick={(e) => handleNextStep(e)}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${step === 2 ? 'bg-gold text-primary scale-110 shadow-sm shadow-gold/30' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
              <MapPin className="h-4 w-4" />
            </div>
            <span className={`text-xs font-medium transition-colors ${step === 2 ? 'text-foreground font-semibold' : 'text-muted-foreground group-hover:text-foreground'}`}>
              Endereço
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {step === 1 ? (
            /* PASSO 1: DADOS PESSOAIS E PROCESSO */
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client" className="text-sm font-medium text-foreground">
                  Nome do Cliente <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="client"
                  placeholder="Ex: Ana Maria Silva"
                  className={errors.client ? "border-destructive focus-visible:ring-destructive" : ""}
                  {...register("client")}
                />
                {errors.client && (
                  <p className="text-xs text-destructive">{errors.client.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ex: ana.silva@email.com"
                    className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="Ex: (11) 99999-9999"
                    {...register("phone")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj" className="text-sm font-medium text-foreground">
                    CPF / CNPJ
                  </Label>
                  <Input
                    id="cpfCnpj"
                    placeholder="Ex: 000.000.000-00"
                    {...register("cpfCnpj")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rg" className="text-sm font-medium text-foreground">
                    RG
                  </Label>
                  <Input
                    id="rg"
                    placeholder="Ex: 00.000.000-0"
                    {...register("rg")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-sm font-medium text-foreground">
                    Data Nascimento
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    {...register("birthDate")}
                  />
                </div>
              </div>


            </div>
          ) : (
            /* PASSO 2: ENDEREÇO */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep" className="text-sm font-medium text-foreground">
                    CEP
                  </Label>
                  <Input
                    id="cep"
                    placeholder="Ex: 01001-000"
                    onChange={handleCepChange}
                    defaultValue={control._defaultValues.cep}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood" className="text-sm font-medium text-foreground">
                    Bairro
                  </Label>
                  <Input
                    id="neighborhood"
                    placeholder="Ex: Centro"
                    {...register("neighborhood")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-foreground">
                  Endereço / Logradouro
                </Label>
                <Input
                  id="address"
                  placeholder="Ex: Avenida Paulista"
                  {...register("address")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number" className="text-sm font-medium text-foreground">
                    Número
                  </Label>
                  <Input
                    id="number"
                    placeholder="Ex: 1000"
                    {...register("number")}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="complement" className="text-sm font-medium text-foreground">
                    Complemento
                  </Label>
                  <Input
                    id="complement"
                    placeholder="Ex: Apto 42"
                    {...register("complement")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="city" className="text-sm font-medium text-foreground">
                    Cidade
                  </Label>
                  <Input
                    id="city"
                    placeholder="Ex: São Paulo"
                    {...register("city")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uf" className="text-sm font-medium text-foreground">
                    UF
                  </Label>
                  <Input
                    id="uf"
                    placeholder="Ex: SP"
                    maxLength={2}
                    {...register("uf")}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
            {step === 1 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setStep(1);
                    reset();
                  }}
                  className="cursor-pointer w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={(e) => handleNextStep(e)}
                  className="cursor-pointer bg-gold hover:bg-gold-light text-primary font-medium gap-2 w-full sm:w-auto ml-auto"
                >
                  Próximo (Endereço)
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="cursor-pointer gap-2 w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer bg-gold hover:bg-gold-light text-primary font-medium gap-2 w-full sm:w-auto ml-auto"
                >
                  <Save className="h-4 w-4" />
                  Salvar Registro
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
