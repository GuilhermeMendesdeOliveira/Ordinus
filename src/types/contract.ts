export type BlockType =
  | 'contratante'
  | 'contratado'
  | 'objeto'
  | 'honorarios'
  | 'valor_causa'
  | 'pagamento'
  | 'prazo'
  | 'rescisao'
  | 'foro'
  | 'clausulas'
  | 'texto_livre'
  | 'custom';

export type FieldType = 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'select' | 'textarea';

export type HonorariosMode = 'fixo' | 'percentual' | 'misto';

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  value: string;
  required: boolean;
  autoFill?: string;
  placeholder?: string;
  options?: string[];
}

export interface ContractBlock {
  id: string;
  type: BlockType;
  order: number;
  enabled: boolean;
  fields: Field[];
  isMultiple?: boolean;
  parentId?: string;
  customConfig?: CustomBlockConfig;
}

export interface CustomBlockConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: Omit<Field, 'value'>[];
  isMultiple?: boolean;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  blocks: Omit<ContractBlock, 'id'>[];
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  clientId: string;
  clientName?: string;
  templateId?: string;
  blocks: ContractBlock[];
  status: 'draft' | 'sent' | 'final' | 'signed';
  createdAt: string;
  updatedAt: string;
  pdfUrl?: string;
}

export interface BlockConfig {
  type: BlockType;
  label: string;
  icon: string;
  description: string;
  defaultFields: Omit<Field, 'value'>[];
  required: boolean;
  isMultiple?: boolean;
}

export const BLOCK_CONFIGS: BlockConfig[] = [
  {
    type: 'contratante',
    label: 'Dados do Contratante',
    icon: 'User',
    description: 'Nome, CPF/CNPJ, endereço do cliente',
    required: true,
    defaultFields: [
      { key: 'nome', label: 'Nome', type: 'text', required: true, autoFill: 'client' },
      { key: 'cpfCnpj', label: 'CPF/CNPJ', type: 'text', required: true, autoFill: 'cpfCnpj' },
      { key: 'endereco', label: 'Endereço', type: 'text', required: true, autoFill: 'address' },
    ],
  },
  {
    type: 'contratado',
    label: 'Dados do Contratado',
    icon: 'Scale',
    description: 'Nome, OAB, endereço do advogado',
    required: true,
    isMultiple: true,
    defaultFields: [
      { key: 'nome', label: 'Nome', type: 'text', required: true, placeholder: 'Dr(a). Nome Completo' },
      { key: 'oab', label: 'OAB', type: 'text', required: true, placeholder: '123456/SP' },
      { key: 'endereco', label: 'Endereço', type: 'text', required: false },
    ],
  },
  {
    type: 'objeto',
    label: 'Objeto do Contrato',
    icon: 'FileText',
    description: 'Descrição do serviço jurídico',
    required: true,
    defaultFields: [
      { key: 'descricao', label: 'Descrição do Serviço', type: 'textarea', required: true, placeholder: 'Descrição detalhada do objeto do contrato...' },
    ],
  },
  {
    type: 'honorarios',
    label: 'Honorários',
    icon: 'DollarSign',
    description: 'Valores, percentuais, honorários sucumbenciais',
    required: true,
    defaultFields: [
      { key: 'valorFixo', label: 'Valor Fixo (R$)', type: 'currency', required: false, placeholder: '0,00' },
      { key: 'percentual', label: 'Percentual (%)', type: 'percentage', required: false, placeholder: '0' },
      { key: 'sucumbencial', label: 'Honorários Sucumbenciais (%)', type: 'percentage', required: false, placeholder: '10' },
      { key: 'formaCalculo', label: 'Forma de Cálculo', type: 'select', required: true, options: ['fixo', 'percentual', 'misto'] },
    ],
  },
  {
    type: 'valor_causa',
    label: 'Valor da Causa',
    icon: 'TrendingUp',
    description: 'Valor estimado da ação',
    required: false,
    defaultFields: [
      { key: 'valor', label: 'Valor Estimado', type: 'currency', required: true, placeholder: '0,00' },
    ],
  },
  {
    type: 'pagamento',
    label: 'Forma de Pagamento',
    icon: 'CreditCard',
    description: 'Condições e prazos de pagamento',
    required: false,
    defaultFields: [
      { key: 'condicoes', label: 'Condições de Pagamento', type: 'textarea', required: true, placeholder: 'Ex: Pagamento mensal, parcelado, etc.' },
      { key: 'prazo', label: 'Prazo de Pagamento', type: 'text', required: false, placeholder: 'Ex: Até 5 dias após o fato gerador' },
    ],
  },
  {
    type: 'prazo',
    label: 'Prazo de Vigência',
    icon: 'Clock',
    description: 'Duração do contrato',
    required: false,
    defaultFields: [
      { key: 'duracao', label: 'Duração', type: 'text', required: true, placeholder: 'Ex: 12 meses, até o trânsito em julgado' },
      { key: 'dataInicio', label: 'Data de Início', type: 'date', required: false },
      { key: 'dataFim', label: 'Data de Término', type: 'date', required: false },
    ],
  },
  {
    type: 'rescisao',
    label: 'Rescisão',
    icon: 'XCircle',
    description: 'Condições para rescisão',
    required: false,
    defaultFields: [
      { key: 'condicoes', label: 'Condições de Rescisão', type: 'textarea', required: true, placeholder: 'Descreva as condições para rescisão do contrato...' },
    ],
  },
  {
    type: 'foro',
    label: 'Foro',
    icon: 'MapPin',
    description: 'Comarca competente',
    required: false,
    defaultFields: [
      { key: 'comarca', label: 'Comarca Competente', type: 'text', required: true, placeholder: 'Ex: São Paulo - SP' },
    ],
  },
  {
    type: 'clausulas',
    label: 'Cláusulas Gerais',
    icon: 'BookOpen',
    description: 'Disposições finais e sigilo',
    required: false,
    defaultFields: [
      { key: 'disposicoes', label: 'Disposições Finais', type: 'textarea', required: false, placeholder: 'Disposições gerais, sigilo, etc.' },
    ],
  },
  {
    type: 'texto_livre',
    label: 'Texto Livre',
    icon: 'Type',
    description: 'Campo para texto personalizado',
    required: false,
    isMultiple: true,
    defaultFields: [
      { key: 'titulo', label: 'Título (Opcional)', type: 'text', required: false, placeholder: 'Ex: CLÁUSULA 8ª - DISPOSIÇÕES ESPECIAIS' },
      { key: 'conteudo', label: 'Conteúdo', type: 'textarea', required: true, placeholder: 'Digite o texto livre do contrato...' },
    ],
  },
];
