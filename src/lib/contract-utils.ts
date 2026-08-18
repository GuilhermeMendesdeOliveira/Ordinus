import type { ContractBlock, BlockType, CustomBlockConfig } from '@/types/contract';
import { BLOCK_CONFIGS } from '@/types/contract';

export function formatCurrency(value: string): string {
  const numericValue = value.replace(/\D/g, '');
  if (!numericValue) return '';
  const formatted = (Number(numericValue) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  return formatted;
}

export function formatPercentage(value: string): string {
  // Remove everything except digits and decimal separator
  const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.');
  if (!cleaned) return '';
  // Parse the number and format with Brazilian locale
  const num = parseFloat(cleaned);
  if (isNaN(num)) return '';
  return `${num.toLocaleString('pt-BR')}%`;
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d,-]/g, '').replace(',', '.');
  return Number(cleaned) || 0;
}

export function parsePercentage(value: string): number {
  const cleaned = value.replace(/[^\d,-]/g, '').replace(',', '.');
  return Number(cleaned) || 0;
}

export function getBlockLabel(type: BlockType): string {
  const config = BLOCK_CONFIGS.find((c) => c.type === type);
  return config?.label || type;
}

export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function generateContractId(): string {
  return `contract_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createBlockFromType(type: BlockType, order: number, customConfig?: CustomBlockConfig): ContractBlock {
  // Handle custom blocks
  if (type === 'custom' && customConfig) {
    return {
      id: generateBlockId(),
      type: 'custom',
      order,
      enabled: true,
      isMultiple: customConfig.isMultiple || false,
      fields: customConfig.fields.map((f) => ({ ...f, value: '' })),
      customConfig,
    };
  }

  const config = BLOCK_CONFIGS.find((c) => c.type === type);
  if (!config) {
    throw new Error(`Unknown block type: ${type}`);
  }

  return {
    id: generateBlockId(),
    type,
    order,
    enabled: true,
    isMultiple: config.isMultiple || false,
    fields: config.defaultFields.map((f) => ({ ...f, value: '' })),
  };
}

export function sortBlocksByOrder(blocks: ContractBlock[]): ContractBlock[] {
  return [...blocks].sort((a, b) => a.order - b.order);
}

export function reorderBlocks(blocks: ContractBlock[], fromIndex: number, toIndex: number): ContractBlock[] {
  const result = [...blocks];
  const [removed] = result.splice(fromIndex, 1);
  if (removed) {
    result.splice(toIndex, 0, removed);
  }
  return result.map((block, index) => ({ ...block, order: index }));
}

export function getFieldValue(block: ContractBlock, key: string): string {
  const field = block.fields.find((f) => f.key === key);
  return field?.value || '';
}

export function setFieldValue(block: ContractBlock, key: string, value: string): ContractBlock {
  return {
    ...block,
    fields: block.fields.map((f) => (f.key === key ? { ...f, value } : f)),
  };
}

export function validateContractBlocks(blocks: ContractBlock[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const block of blocks) {
    const config = BLOCK_CONFIGS.find((c) => c.type === block.type);
    if (!config) continue;

    for (const field of block.fields) {
      if (field.required && !field.value.trim()) {
        errors.push(`${config.label} - Campo "${field.label}" é obrigatório`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function generateContractText(blocks: ContractBlock[]): string {
  let text = 'CONTRATO DE HONORÁRIOS ADVOCATÍCIOS\n\n';

  for (const block of blocks) {
    if (!block.enabled) continue;

    text += generateBlockText(block);
    text += '\n\n';
  }

  text += generateSignatureBlock();

  return text;
}

function generateBlockText(block: ContractBlock): string {
  const blockTexts: Record<BlockType, () => string> = {
    contratante: () => {
      const nome = getFieldValue(block, 'nome');
      const cpfCnpj = getFieldValue(block, 'cpfCnpj');
      const endereco = getFieldValue(block, 'endereco');
      return `CONTRATANTE: ${nome || '[Nome do Cliente]'}\nCPF/CNPJ: ${cpfCnpj || '[CPF/CNPJ]'}\nEndereço: ${endereco || '[Endereço]'}`;
    },
    contratado: () => {
      const nome = getFieldValue(block, 'nome');
      const oab = getFieldValue(block, 'oab');
      const endereco = getFieldValue(block, 'endereco');
      return `CONTRATADO: ${nome || '[Nome do Advogado]'}\nOAB: ${oab || '[OAB]'}\nEndereço: ${endereco || '[Endereço]'}`;
    },
    objeto: () => {
      const descricao = getFieldValue(block, 'descricao');
      return `CLÁUSULA 1ª - DO OBJETO\n\n${descricao || '[Descrição do objeto do contrato]'}`;
    },
    honorarios: () => {
      const valorFixo = getFieldValue(block, 'valorFixo');
      const percentual = getFieldValue(block, 'percentual');
      const sucumbencial = getFieldValue(block, 'sucumbencial');
      const formaCalculo = getFieldValue(block, 'formaCalculo');

      let text = 'CLÁUSULA 2ª - DOS HONORÁRIOS ADVOCATÍCIOS\n\n';

      if (formaCalculo === 'fixo' || formaCalculo === 'misto') {
        text += `Honorários fixos: ${valorFixo || '[Valor]'}\n`;
      }
      if (formaCalculo === 'percentual' || formaCalculo === 'misto') {
        text += `Percentual sobre o resultado: ${percentual || '[Percentual]'}%\n`;
      }
      if (sucumbencial) {
        text += `Honorários sucumbenciais: ${sucumbencial}%`;
      }

      return text;
    },
    valor_causa: () => {
      const valor = getFieldValue(block, 'valor');
      return `CLÁUSULA 3ª - DO VALOR DA CAUSA\n\nValor estimado da ação: ${valor || '[Valor]'}`;
    },
    pagamento: () => {
      const condicoes = getFieldValue(block, 'condicoes');
      const prazo = getFieldValue(block, 'prazo');
      return `CLÁUSULA 4ª - DA FORMA DE PAGAMENTO\n\n${condicoes || '[Condições de pagamento]'}${prazo ? `\nPrazo: ${prazo}` : ''}`;
    },
    prazo: () => {
      const duracao = getFieldValue(block, 'duracao');
      const dataInicio = getFieldValue(block, 'dataInicio');
      const dataFim = getFieldValue(block, 'dataFim');
      let text = `CLÁUSULA 5ª - DO PRAZO DE VIGÊNCIA\n\nDuração: ${duracao || '[Duração]'}`;
      if (dataInicio) text += `\nData de início: ${dataInicio}`;
      if (dataFim) text += `\nData de término: ${dataFim}`;
      return text;
    },
    rescisao: () => {
      const condicoes = getFieldValue(block, 'condicoes');
      return `CLÁUSULA 6ª - DA RESCISÃO\n\n${condicoes || '[Condições de rescisão]'}`;
    },
    foro: () => {
      const comarca = getFieldValue(block, 'comarca');
      return `CLÁUSULA 7ª - DO FORO\n\nFica eleito o foro da Comarca de ${comarca || '[Comarca]'} para dirimir quaisquer questões oriundas deste contrato.`;
    },
    clausulas: () => {
      const disposicoes = getFieldValue(block, 'disposicoes');
      return `CLÁUSULAS GERAIS\n\n${disposicoes || 'Disposições gerais e sigilo profissional.'}`;
    },
    texto_livre: () => {
      const titulo = getFieldValue(block, 'titulo');
      const conteudo = getFieldValue(block, 'conteudo');
      if (titulo) {
        return `${titulo.toUpperCase()}\n\n${conteudo || '[Conteúdo]'}`;
      }
      return conteudo || '[Conteúdo]';
    },
    custom: () => {
      if (!block.customConfig) return '';
      const title = block.customConfig.name.toUpperCase();
      const fieldTexts = block.fields
        .filter((f) => f.value)
        .map((f) => `${f.label}: ${f.value}`)
        .join('\n');
      return `${title}\n\n${fieldTexts || '[Campos não preenchidos]'}`;
    },
  };

  return blockTexts[block.type]?.() || '';
}

function generateSignatureBlock(): string {
  return `\nSão Paulo, ___ de _____________ de 20___

_______________________________________
Contratante

_______________________________________
Contratado`;
}
