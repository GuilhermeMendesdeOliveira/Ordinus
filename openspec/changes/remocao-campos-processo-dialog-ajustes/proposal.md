## Why

Após testes práticos, identificou-se que os campos "Número do Processo", "Advogado Responsável" e "Status do Caso" não devem estar presentes no cadastro de clientes, uma vez que serão preenchidos em uma tela própria de processos futuramente. Além disso, há um bug de UX em que o clique no botão de avanço do formulário faz a modal fechar devido ao desmembramento (unmounting) do botão antes da finalização do ciclo de clique do Radix UI.

## What Changes

- Remoção dos campos de processo (número, responsável, status) do formulário de cadastro de clientes.
- Manutenção dos campos nos registros como strings/valores vazios por padrão para evitar quebrar componentes existentes da tabela de listagem.
- Ajuste na estrutura DOM dos passos do formulário para evitar o fechamento inesperado da modal ao avançar de etapa.

## Capabilities

### New Capabilities

### Modified Capabilities

- `gerenciamento-clientes`: Ajuste nos campos e fix de fechamento inesperado da modal de cadastro.

## Impact

- `src/components/dashboard/RegisterClientDialog.tsx`: Remoção de campos e ajuste de persistência DOM do wizard de cadastro.
