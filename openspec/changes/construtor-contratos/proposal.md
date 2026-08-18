## Why

O escritório Mendes & Aragão Advocacia precisa de uma ferramenta para criar contratos de honorários advocatícios de forma rápida e padronizada. Atualmente, os contratos são criados manualmente em editores de texto, o que gera inconsistências, perda de tempo e risco de erros em cláusulas importantes. Um construtor visual com arrastar-e-soltar permite montar contratos personalizados em minutos, garantindo conformidade e profissionalismo.

## What Changes

- Nova tela `/contratos/novo` com construtor visual de contratos (área "white-label")
- Sistema de blocos arrastáveis para montar a estrutura do contrato
- Auto-preenchimento de dados do cliente a partir do cadastro existente
- Suporte a múltiplos contratados (sócios) no mesmo contrato
- Campos de honorários dinâmicos: fixo + percentual + sucumbencial
- Sistema de templates para reutilizar configurações de blocos
- Preview formatado do contrato em tempo real
- Geração de PDF profissional
- Botão "Gerar Contrato" na página de clientes
- Item "Contratos" no menu lateral
- Armazenamento local de contratos e templates

## Capabilities

### New Capabilities

- `contract-builder`: Tela principal com construtor visual, drag-and-drop de blocos, canvas de montagem e preview em tempo real
- `contract-blocks`: Sistema de blocos reutilizáveis (contratante, contratado, objeto, honorários, valor da causa, pagamento, prazo, rescisão, foro, cláusulas gerais)
- `contract-templates`: Gerenciamento de templates para salvar e reutilizar configurações de blocos
- `contract-pdf`: Geração de PDF profissional a partir do contrato montado
- `contract-storage`: Armazenamento e gerenciamento de contratos salvos

### Modified Capabilities

- `client-management`: Adicionar botão "Gerar Contrato" na listagem de clientes com link para construtor

## Impact

- **Novas dependências**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `@react-pdf/renderer`
- **Novas rotas**: `/contratos/`, `/contratos/novo`, `/contratos/:id`, `/contratos/:id/editar`
- **Novos componentes**: ~10 componentes em `src/components/contracts/`
- **Novos stores**: `contracts-store.ts`, `templates-store.ts`
- **Modificação**: `Sidebar.tsx` (adicionar item de menu), `clientes/index.tsx` (adicionar botão de ação)
- **Armazenamento**: Dados em localStorage (mesmo padrão existente)
