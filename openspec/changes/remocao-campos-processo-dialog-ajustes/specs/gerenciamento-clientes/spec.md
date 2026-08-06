## MODIFIED Requirements

### Requirement: Cadastro de cliente em etapas
O sistema SHALL apresentar um fluxo de cadastro dividido em dois passos lógicos distintos (Dados Pessoais e Endereço) para facilitar o preenchimento das informações.

#### Scenario: Transição de etapas sem fechamento da modal
- **WHEN** o usuário clica no botão "Próximo (Endereço)" com os dados pessoais obrigatórios validados
- **THEN** o sistema exibe os campos de Endereço sem fechar a modal de cadastro

### Requirement: Exclusão de campos do processo no cadastro de clientes
O sistema SHALL ocultar/remover os campos "Número do Processo", "Advogado Responsável" e "Status do Caso" da modal de cadastro do cliente.

#### Scenario: Visualização do formulário sem campos do processo
- **WHEN** o usuário abre a modal de cadastro de novo cliente
- **THEN** o sistema exibe apenas campos pessoais na primeira etapa e campos de endereço na segunda etapa, sem exibir campos de processos
