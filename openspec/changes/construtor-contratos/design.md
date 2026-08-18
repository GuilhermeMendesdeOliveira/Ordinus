## Context

O projeto Elevate Dashboard é um sistema de gestão jurídica para o escritório Mendes & Aragão Advocacia. Utiliza TanStack Router, React 19, Tailwind CSS, e componentes shadcn/ui. O armazenamento atual é via localStorage. O projeto já possui um padrão de componentes em `src/components/`, stores em `src/lib/`, e rotas em `src/routes/`.

## Goals / Non-Goals

**Goals:**
- Criar uma tela de construção visual de contratos com drag-and-drop
- Implementar 10 tipos de blocos reutilizáveis para contratos de honorários
- Permitir auto-preenchimento de dados do cliente
- Suportar múltiplos contratados
- Implementar sistema de templates
- Gerar PDF profissional
- Integrar com a página de clientes existente

**Non-Goals:**
- Não implementar backend ou API (mantém localStorage)
- Não criar sistema de assinatura digital
- Não implementar versionamento de contratos
- Não criar fluxo de aprovação
- Não suportar outros tipos de contratos além de honorários

## Decisions

### 1. Biblioteca de Drag-and-Drop

**Decisão:** Usar `@dnd-kit/core` + `@dnd-kit/sortable`

**Alternativas consideradas:**
- `react-beautiful-dnd`: Depreciado, sem suporte ativo
- HTML5 nativo: Sem acessibilidade, sem animações
- `react-dnd`: Mais complexo, menos popular

**Justificativa:** dnd-kit é moderno, acessível, leve, e tem suporte a sortable list nativo.

### 2. Geração de PDF

**Decisão:** Usar `@react-pdf/renderer`

**Alternativas consideradas:**
- `html2canvas` + `jsPDF`: Qualidade inferior, não renderiza bem
- `pdfmake`: Mais verboso, menos flexível
- Server-side generation: Requer backend

**Justificativa:** @react-pdf/renderer renderiza PDF nativo no browser com boa qualidade e controle total sobre layout.

### 3. Arquitetura de Componentes

**Decisão:** Separar em componentes menores com responsabilidade única

**Estrutura:**
```
src/components/contracts/
├── ContractBuilder.tsx      // Layout principal 3 colunas
├── BlockSidebar.tsx         // Lista de blocos + templates
├── ContractCanvas.tsx       // Área de drop com sortable
├── BlockCard.tsx            // Card individual do bloco
├── FieldEditor.tsx          // Edição de campos do bloco
├── ContractPreview.tsx      // Preview formatado
├── ContractPDF.tsx          // Renderização PDF
├── ClientSelector.tsx       // Seleção de cliente
├── TemplateManager.tsx      // Gerenciamento de templates
└── ContractList.tsx         // Lista de contratos
```

**Justificativa:** Componentes menores são mais fáceis de manter, testar e reutilizar.

### 4. Estado do Construtor

**Decisão:** Usar `useReducer` com contexto React

**Alternativas consideradas:**
- Zustand: Mais uma dependência
- Redux: Muito pesado para este caso
- useState múltiplos: Difícil de gerenciar

**Justificativa:** useReducer é nativo do React, adequado para estado complexo com múltiplas ações.

### 5. Armazenamento

**Decisão:** Manter localStorage com keys separadas

**Keys:**
- `ordinus_contracts`: Array de contratos
- `ordinus_templates`: Array de templates

**Justificativa:** Consistente com o padrão existente (ordinus_clients, ordinus_processes).

### 6. Validação

**Decisão:** Usar Zod (já é dependência do projeto)

**Justificativa:** Zod já está no projeto, oferece validação em tempo real com react-hook-form.

## Risks / Trade-offs

**[Risk] Performance com muitos blocos** → Mitigação: Virtualizar lista de blocos se necessário, limitar a 20 blocos por contrato

**[Risk] Tamanho do bundle com @react-pdf/renderer** → Mitigação: Lazy loading do módulo PDF, carregar apenas quando necessário

**[Risk] Limitações do localStorage** → Mitigação: Mostrar aviso quando storage estiver > 80% cheio, sugerir exportação

**[Risk] Acessibilidade do drag-and-drop** → Mitigação: dnd-kit suporta teclado nativamente, adicionar aria-labels

**[Trade-off] Sem backend** → Contratos ficam apenas no browser, sem sincronização entre dispositivos. Aceitável para uso individual.

**[Trade-off] PDF client-side** → Documentos muito grandes podem causar lentidão. Aceitável para contratos de 1-3 páginas.

## Migration Plan

1. Instalar dependências: `@dnd-kit/core`, `@dnd-kit/sortable`, `@react-pdf/renderer`
2. Criar estrutura de componentes em `src/components/contracts/`
3. Implementar stores (contracts-store.ts, templates-store.ts)
4. Criar rotas (/contratos/)
5. Integrar com sidebar e página de clientes
6. Testar fluxo completo

## Open Questions

- Deve haver limite de contratos armazenados?
- Templates devem ser compartilháveis entre usuários (futuro)?
