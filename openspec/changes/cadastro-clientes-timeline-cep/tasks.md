## 1. Estruturação dos Modelos de Dados

- [ ] 1.1 Atualizar a definição do tipo `ClientRow` em `src/components/dashboard/DashboardTable.tsx` para contemplar os novos campos pessoais e de endereço.

## 2. Criação da Visualização Detalhada

- [ ] 2.1 Criar o novo componente modal `ViewClientDialog.tsx` em `src/components/dashboard/ViewClientDialog.tsx` apresentando os dados divididos por seções organizadas de forma limpa.
- [ ] 2.2 Integrar a abertura do `ViewClientDialog` no clique da ação de visualização da tabela na página de gerenciamento de clientes (`src/routes/clientes/index.tsx`).

## 3. Formulário Cadastro Multi-Etapas (Timeline) e Consulta CEP

- [ ] 3.1 Ajustar o esquema do Zod `clientSchema` e valores padrão no `RegisterClientDialog.tsx` para abranger os novos campos pessoais e de endereço.
- [ ] 3.2 Implementar controle de abas/passos (`step` de 1 a 2) no `RegisterClientDialog.tsx` com navegação visual estilo timeline (Passo 1: Dados Pessoais e Processo; Passo 2: Endereço).
- [ ] 3.3 Adicionar validação do Passo 1 antes de permitir avançar para o Passo 2 utilizando a função `trigger` do `react-hook-form`.
- [ ] 3.4 Implementar o efeito ou gatilho de consulta automática de CEP chamando a API do ViaCEP quando o campo CEP atingir 8 dígitos válidos, tratando retornos de sucesso (autopreenchimento e foco no número) e de erro.
