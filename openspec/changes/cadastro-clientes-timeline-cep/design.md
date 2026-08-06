## Context

Consulte o `proposal.md` para entender a motivação desta mudança. O sistema utiliza React, TypeScript, Tailwind CSS, Lucide React, Radix UI (Dialog, Select, Tabs), React Hook Form e Zod. O armazenamento dos dados dos clientes é feito localmente no navegador via LocalStorage através da utilidade `src/lib/clients-store.ts`.

## Goals / Non-Goals

**Goals:**
- Ampliar a interface `ClientRow` com campos para dados pessoais (e-mail, telefone, CPF/CNPJ, RG, data de nascimento) e endereço completo.
- Implementar fluxo de cadastro visual em 2 etapas (Timeline / Abas) dentro do `RegisterClientDialog`.
- Consumir a API pública do ViaCEP no frontend com preenchimento reativo de endereço e tratamento de estados de erro.
- Atualizar a visualização de clientes na lista para exibir as informações completas através de um novo componente modal `ViewClientDialog`.

**Non-Goals:**
- Migração de dados de LocalStorage para um banco de dados relacional remoto ou backend próprio.
- Implementação de validação oficial de CPF/CNPJ via algoritmos matemáticos complexos (faremos validações de tamanho simples no Zod).

## Decisions

### 1. Estruturação do Wizard em 2 Etapas (Timeline)
- **Decisão**: Utilizaremos controle de estado simples no React Hook Form com um estado `step` (`1` e `2`) para gerenciar a exibição dos campos.
- **Razão**: Permite que o formulário compartilhe um único contexto de submissão do React Hook Form, ao mesmo tempo em que permite validar especificamente os campos da primeira etapa usando `trigger` do React Hook Form antes de avançar para a segunda.
- **Alternativas consideradas**: Usar o componente `Tabs` padrão diretamente. Rejeitado pois o usuário poderia alternar para a aba de endereço sem que os campos obrigatórios da aba de dados pessoais estivessem devidamente preenchidos.

### 2. Integração com ViaCEP
- **Decisão**: Fazer uma requisição `fetch` diretamente para `https://viacep.com.br/ws/{cep}/json/` quando o valor do campo CEP atingir exatamente 8 caracteres numéricos (após remover caracteres especiais).
- **Razão**: API pública, rápida, que não exige chaves de API ou autenticação e cobre com precisão o território nacional.
- **Alternativas consideradas**: Utilizar outra API de CEP paga ou exigir que o usuário clique em um botão de busca. O preenchimento automático contínuo via digitação de 8 dígitos provê uma experiência de usuário (UX) muito mais fluida.

### 3. Visualização de Detalhes
- **Decisão**: Criar o componente modal `ViewClientDialog` separado em `src/components/dashboard/ViewClientDialog.tsx` e integrá-lo nas ações da tabela.
- **Razão**: Centraliza a apresentação dos novos campos em uma visualização estruturada com seções claras, mantendo o código da listagem limpo e modular.

## Risks / Trade-offs

- **[Risk]** Dados antigos no LocalStorage sem os novos campos.
  - **Mitigação**: Declarar todos os novos campos como opcionais no tipo `ClientRow`. No componente de visualização, se um campo não existir, exibir um texto cinza indicando "Não informado".
- **[Risk]** Bloqueio ou falha de requisição da API ViaCEP por falta de conectividade do usuário.
  - **Mitigação**: Exibir toast de erro amigável caso a requisição falhe ou retorne CEP inexistente. Deixar os campos de endereço editáveis para que possam ser preenchidos manualmente pelo usuário.
