import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Plus, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { ContractBlock } from '@/types/contract';
import { createBlockFromType } from '@/lib/contract-utils';

interface StandardClausesProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBlock: (block: ContractBlock) => void;
}

interface StandardClause {
  id: string;
  title: string;
  category: string;
  content: string;
}

const STANDARD_CLAUSES: StandardClause[] = [
  // Objeto
  {
    id: 'objeto-geral',
    title: 'Objeto - Prestação de Serviços Jurídicos',
    category: 'Objeto',
    content: 'O presente contrato tem por objeto a prestação de serviços jurídicos pelo(a) CONTRATADO(A) ao(à) CONTRATANTE, incluindo consultoria, assessoria e representação em questões legais.',
  },
  {
    id: 'objeto-processual',
    title: 'Objeto - Representação Processual',
    category: 'Objeto',
    content: 'O presente contrato tem por objeto a representação processual do(a) CONTRATANTE em ação judicial, incluindo todas as instâncias, desde a fase postulatória até a execução, bem como a assessoria jurídica correlata.',
  },

  // Honorários
  {
    id: 'honorarios-fixos',
    title: 'Honorários - Valor Fixo',
    category: 'Honorários',
    content: 'Pela prestação dos serviços descritos neste contrato, o(a) CONTRATANTE pagará ao(à) CONTRATADO(A) o valor total de R$ __________ (________________________________), payable em __ parcelas iguais.',
  },
  {
    id: 'honorarios-percentual',
    title: 'Honorários - Percentual sobre o Resultado',
    category: 'Honorários',
    content: 'Pela prestação dos serviços descritos neste contrato, o(a) CONTRATANTE pagará ao(à) CONTRATADO(A) honorários correspondentes a __% (________________ por cento) sobre o valor经济 do que for经济 em favor do(a) CONTRATANTE.',
  },
  {
    id: 'honorarios-sucumbenciais',
    title: 'Honorários - Sucumbenciais',
    category: 'Honorários',
    content: 'Ficam contratados honorários advocatícios de sucumbência, que serão pagos pela parte contrária ao(à) CONTRATADO(A) em caso de procedência total ou parcial dos pedidos, conforme artigo 85 do CPC.',
  },
  {
    id: 'honorarios-insucessorios',
    title: 'Honorários - Insucessos',
    category: 'Honorários',
    content: 'Em caso de insucesso total da demanda, os honorários contratuais já pagos não serão devolvidos, permanecendo ao(à) CONTRATADO(A) o direito ao recebimento integral dos valores pactuados.',
  },

  // Pagamento
  {
    id: 'pagamento-antecipado',
    title: 'Pagamento - Antecipado',
    category: 'Pagamento',
    content: 'Os honorários deverão ser pagos antecipadamente, antes do início da prestação dos serviços, mediante depósito ou transferência bancária para a conta indicada pelo(a) CONTRATADO(A).',
  },
  {
    id: 'pagamento-parcelado',
    title: 'Pagamento - Parcelado',
    category: 'Pagamento',
    content: 'Os honorários serão pagos em __ parcelas mensais iguais, no valor de R$ __________ cada, com vencimento no dia __ de cada mês, até o pagamento integral.',
  },
  {
    id: 'pagamento-resultdo',
    title: 'Pagamento - Condicional ao Resultado',
    category: 'Pagamento',
    content: 'O pagamento dos honorários está condicionado ao resultado favorável da demanda, sendo devido apenas em caso de procedência total ou parcial dos pedidos.',
  },

  // Prazo
  {
    id: 'prazo-determinado',
    title: 'Prazo - Contrato por Prazo Determinado',
    category: 'Prazo',
    content: 'O presente contrato terá validade pelo prazo de __ meses, contados a partir da assinatura, podendo ser prorrogado por acordo mútuo entre as partes.',
  },
  {
    id: 'prazo-indeterminado',
    title: 'Prazo - Contrato por Prazo Indeterminado',
    category: 'Prazo',
    content: 'O presente contrato terá validade por prazo indeterminado, podendo ser rescindido por qualquer uma das partes, mediante notificação por escrito com antecedência mínima de __ dias.',
  },
  {
    id: 'prazo-processual',
    title: 'Prazo - Até Trânsito em Julgado',
    category: 'Prazo',
    content: 'O presente contrato vigorará até o trânsito em julgado da decisão judicial, incluindo eventual fase de cumprimento de sentença.',
  },

  // Rescisão
  {
    id: 'rescisao-justa-causa',
    title: 'Rescisão - Justa Causa',
    category: 'Rescisão',
    content: 'O presente contrato poderá ser rescindido por justa causa em caso de: (I) inadimplemento de qualquer cláusula; (II) conduta antiética ou infracional; (III) falência ou recuperação judicial.',
  },
  {
    id: 'rescisao-sem-justa-causa',
    title: 'Rescisão - Sem Justa Causa',
    category: 'Rescisão',
    content: 'Qualquer uma das partes poderá rescindir o presente contrato sem justa causa, mediante notificação por escrito com antecedência mínima de __ dias, sem direito a indenização.',
  },
  {
    id: 'rescisao-consequencias',
    title: 'Rescisão - Consequências',
    category: 'Rescisão',
    content: 'Em caso de rescisão, o(a) CONTRATANTE deverá pagar ao(à) CONTRATADO(A) os honorários proporcionais pelos serviços já prestados, bem como eventuais despesas pendentes.',
  },

  // Foro
  {
    id: 'foro-comum',
    title: 'Foro - Comarca de São Paulo',
    category: 'Foro',
    content: 'Fica eleito o foro da Comarca de São Paulo para dirimir quaisquer questões oriundas deste contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.',
  },
  {
    id: 'foro-local',
    title: 'Foro - Local da Assinatura',
    category: 'Foro',
    content: 'Fica eleito o foro da comarca onde for assinado o presente contrato para dirimir quaisquer questões oriundas do mesmo.',
  },

  // Cláusulas Gerais
  {
    id: 'sigilo-profissional',
    title: 'Sigilo Profissional',
    category: 'Cláusulas Gerais',
    content: 'O(A) CONTRATADO(A) obriga-se a manter absoluto sigilo sobre todas as informações e dados do(a) CONTRATANTE que vierem a seu conhecimento em razão da prestação dos serviços.',
  },
  {
    id: 'independencia',
    title: 'Independência Profissional',
    category: 'Cláusulas Gerais',
    content: 'O(A) CONTRATADO(A) atuará com plena independência profissional, observando os deveres éticos e legais da advocacia, conforme o Estatuto da OAB.',
  },
  {
    id: 'nao-exclusividade',
    title: 'Não Exclusividade',
    category: 'Cláusulas Gerais',
    content: 'O(A) CONTRATADO(A) poderá prestar serviços a outros clientes, desde que não haja conflito de interesses com o(a) CONTRATANTE.',
  },
  {
    id: 'disposicoes-finais',
    title: 'Disposições Finais',
    category: 'Cláusulas Gerais',
    content: 'O presente contrato representa o acordo integral entre as partes sobre seu objeto, prevalecendo sobre quaisquer negociações ou acordos anteriores, verbais ou escritos.',
  },
  {
    id: 'alteracoes',
    title: 'Alterações Contratuais',
    category: 'Cláusulas Gerais',
    content: 'Qualquer alteração deste contrato deverá ser feita por escrito e assinada por ambas as partes, não sendo válidas alterações verbais.',
  },
  {
    id: 'legislacao-aplicavel',
    title: 'Legislação Aplicável',
    category: 'Cláusulas Gerais',
    content: 'O presente contrato será regido e interpretado de acordo com as leis da República Federativa do Brasil.',
  },
];

export function StandardClauses({ isOpen, onOpenChange, onAddBlock }: StandardClausesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addedClauses, setAddedClauses] = useState<string[]>([]);

  const categories = [...new Set(STANDARD_CLAUSES.map((c) => c.category))];

  const filteredClauses = selectedCategory
    ? STANDARD_CLAUSES.filter((c) => c.category === selectedCategory)
    : STANDARD_CLAUSES;

  const handleAddClause = (clause: StandardClause) => {
    const newBlock: ContractBlock = createBlockFromType('texto_livre', 0);

    // Set the title and content fields
    newBlock.fields = newBlock.fields.map((f) => {
      if (f.key === 'titulo') {
        return { ...f, value: clause.title };
      }
      if (f.key === 'conteudo') {
        return { ...f, value: clause.content };
      }
      return f;
    });

    onAddBlock(newBlock);
    setAddedClauses([...addedClauses, clause.id]);
    toast.success(`Cláusula "${clause.title}" adicionada`);
  };

  const handleAddAllFromCategory = (category: string) => {
    const clauses = STANDARD_CLAUSES.filter((c) => c.category === category);
    let delay = 0;

    clauses.forEach((clause) => {
      if (!addedClauses.includes(clause.id)) {
        setTimeout(() => {
          handleAddClause(clause);
        }, delay);
        delay += 100;
      }
    });
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setAddedClauses([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gold" />
            Cláusulas Padrão
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(80vh-100px)]">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Clauses List */}
          <div className="space-y-3">
            {filteredClauses.map((clause) => {
              const isAdded = addedClauses.includes(clause.id);
              return (
                <div
                  key={clause.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    isAdded ? 'bg-success/5 border-success/20' : 'bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {clause.category}
                        </span>
                        {isAdded && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                            Adicionada
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium text-sm">{clause.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {clause.content}
                      </p>
                    </div>
                    <Button
                      variant={isAdded ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleAddClause(clause)}
                      disabled={isAdded}
                      className="shrink-0"
                    >
                      {isAdded ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4 mr-1" />
                      )}
                      {isAdded ? 'Adicionada' : 'Adicionar'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
