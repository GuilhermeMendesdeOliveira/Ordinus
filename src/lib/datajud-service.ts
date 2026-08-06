export interface Movimentacao {
  id: string;
  data: string;
  descricao: string;
  orgao: string;
  tipo: "movimentacao" | "julgamento" | "publicacao" | "distribuicao";
}

export interface ProcessoDataJud {
  numeroProcesso: string;
  classe: string;
  assunto: string;
  orgaoJulgador: string;
  vara: string;
  comarca: string;
  uf: string;
  movimentacoes: Movimentacao[];
}

const MOVIMENTACOES_SIMULADAS: Movimentacao[] = [
  {
    id: "1",
    data: "02/08/2026 14:30",
    descricao: "Distribuido por sorteio",
    orgao: "1a Vara Civel de Sao Paulo",
    tipo: "distribuicao",
  },
  {
    id: "2",
    data: "03/08/2026 09:15",
    descricao: "Autos baixados ao cartorio para diligencias",
    orgao: "1a Vara Civel de Sao Paulo",
    tipo: "movimentacao",
  },
  {
    id: "3",
    data: "05/08/2026 11:00",
    descricao: "Citacao realizada via Edital",
    orgao: "1a Vara Civel de Sao Paulo",
    tipo: "movimentacao",
  },
  {
    id: "4",
    data: "10/08/2026 16:45",
    descricao: "Publicado edital no Diario da Justica",
    orgao: "Tribunal de Justica de Sao Paulo",
    tipo: "publicacao",
  },
  {
    id: "5",
    data: "15/08/2026 10:30",
    descricao: "Juntada de peticao de contestacao",
    orgao: "1a Vara Civel de Sao Paulo",
    tipo: "movimentacao",
  },
  {
    id: "6",
    data: "20/08/2026 14:00",
    descricao: "Audiencia de conciliacao designada",
    orgao: "1a Vara Civel de Sao Paulo",
    tipo: "movimentacao",
  },
  {
    id: "7",
    data: "25/08/2026 09:00",
    descricao: "Audiencia realizada - sem acordo",
    orgao: "1a Vara Civel de Sao Paulo",
    tipo: "julgamento",
  },
  {
    id: "8",
    data: "01/09/2026 11:30",
    descricao: "Republicado edital no Diario da Justica",
    orgao: "Tribunal de Justica de Sao Paulo",
    tipo: "publicacao",
  },
];

function gerarMovimentacoes(processNumber: string): Movimentacao[] {
  const seed = processNumber.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const numMovimentacoes = 3 + (seed % 6);

  const movimentacoesBase = [
    { tipo: "distribuicao" as const, descricao: "Distribuido por sorteio", orgao: "1a Vara Civel de Sao Paulo" },
    { tipo: "movimentacao" as const, descricao: "Autos baixados ao cartorio", orgao: "1a Vara Civel de Sao Paulo" },
    { tipo: "movimentacao" as const, descricao: "Citacao realizada", orgao: "1a Vara Civel de Sao Paulo" },
    { tipo: "publicacao" as const, descricao: "Publicado no Diario da Justica", orgao: "Tribunal de Justica de Sao Paulo" },
    { tipo: "movimentacao" as const, descricao: "Juntada de peticao", orgao: "1a Vara Civel de Sao Paulo" },
    { tipo: "julgamento" as const, descricao: "Audiencia realizada", orgao: "1a Vara Civel de Sao Paulo" },
    { tipo: "movimentacao" as const, descricao: "Sentenca publicada", orgao: "1a Vara Civel de Sao Paulo" },
  ];

  const hoje = new Date();
  const movimentacoes: Movimentacao[] = [];

  for (let i = 0; i < numMovimentacoes; i++) {
    const diasAtras = (numMovimentacoes - i) * 5 + (seed % 10);
    const data = new Date(hoje);
    data.setDate(data.getDate() - diasAtras);

    const baseIdx = i % movimentacoesBase.length;
    const base = movimentacoesBase[baseIdx]!;

    movimentacoes.push({
      id: `${i + 1}`,
      data: `${data.getDate().toString().padStart(2, "0")}/${(data.getMonth() + 1).toString().padStart(2, "0")}/${data.getFullYear()} ${(9 + (i % 8)).toString().padStart(2, "0")}:${(i * 15) % 60 === 0 ? "00" : (i * 15) % 60}`,
      descricao: base.descricao,
      orgao: base.orgao,
      tipo: base.tipo,
    });
  }

  return movimentacoes;
}

export async function consultarProcesso(processNumber: string): Promise<ProcessoDataJud> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const movimentacoes = gerarMovimentacoes(processNumber);

  return {
    numeroProcesso: processNumber,
    classe: "Acao Civel",
    assunto: "Indenizacao por Danos",
    orgaoJulgador: "Tribunal de Justica de Sao Paulo",
    vara: "1a Vara Civel",
    comarca: "Sao Paulo",
    uf: "SP",
    movimentacoes,
  };
}

export function formatarNumeroProcesso(numero: string): string {
  return numero.replace(/(\d{7})\.(\d{2})\.(\d{2})\.(\d{4})/, "$1-$2.$3.$4");
}
