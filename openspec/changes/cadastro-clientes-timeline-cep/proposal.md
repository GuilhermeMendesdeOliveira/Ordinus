## Why

Atualmente, o cadastro de clientes do sistema coleta apenas informações básicas (nome, número de processo e responsável). Para um controle processual e administrativo eficaz, o escritório necessita de dados pessoais detalhados (CPF/CNPJ, RG, data de nascimento, e-mail, telefone) e endereço completo dos clientes, além de otimizar o fluxo de trabalho por meio do autopreenchimento de endereço via CEP.

## What Changes

- Expansão do formulário de cadastro de clientes para incluir novos dados pessoais (e-mail, telefone, CPF/CNPJ, RG e data de nascimento).
- Inclusão de campos para endereço completo (CEP, endereço/logradouro, número, bairro, complemento, cidade e UF).
- Reorganização visual do cadastro em fluxo do tipo "timeline" ou passos (passo 1: dados pessoais/processo, passo 2: endereço).
- Integração da API ViaCEP para preenchimento automático das informações de endereço a partir do CEP informado.
- Criação de uma modal de visualização de detalhes do cliente para que todas essas novas informações possam ser exibidas na tabela de clientes.

## Capabilities

### New Capabilities

- `gerenciamento-clientes`: Cadastro estendido de clientes com fluxo em duas etapas (pessoal e endereço), consulta automática à API do ViaCEP e exibição detalhada de todas as informações.

### Modified Capabilities

## Impact

- `src/components/dashboard/DashboardTable.tsx`: Atualização do tipo `ClientRow` para acomodar os novos campos.
- `src/components/dashboard/RegisterClientDialog.tsx`: Reformulação do formulário para o formato de timeline com suporte a validação em dois passos e consulta do CEP.
- `src/components/dashboard/ViewClientDialog.tsx`: Novo componente para visualizar todos os dados do cliente de forma elegante.
- `src/routes/clientes/index.tsx`: Atualização para integrar a nova modal de visualização.
