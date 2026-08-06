## Purpose

Permite cadastrar clientes capturando dados pessoais estendidos e endereço completo organizados em etapas, com preenchimento automático a partir de CEP e exibição dos dados detalhados.

## ADDED Requirements

### Requirement: Cadastro de cliente em etapas
O sistema SHALL apresentar um fluxo de cadastro dividido em dois passos lógicos distintos (Dados Pessoais & Processo, e Endereço) para facilitar o preenchimento das informações.

#### Scenario: Visualização do fluxo em etapas
- **WHEN** o usuário abre a modal de cadastro de novo cliente
- **THEN** o sistema exibe o Passo 1 (Dados Pessoais e Processo) e permite transição para o Passo 2 (Endereço) apenas se os campos obrigatórios do Passo 1 forem validados

### Requirement: Autopreenchimento de endereço por CEP
O sistema SHALL realizar o preenchimento automático das informações de endereço a partir de um CEP de 8 dígitos informado.

#### Scenario: Busca de CEP com sucesso
- **WHEN** o usuário digita um CEP válido de 8 dígitos
- **THEN** o sistema consulta a API ViaCEP, preenche automaticamente os campos de Endereço/Logradouro, Bairro, Cidade e UF, e move o foco do cursor para o campo de Número

#### Scenario: CEP não encontrado ou erro de consulta
- **WHEN** o usuário digita um CEP inexistente ou ocorre um erro de conexão
- **THEN** o sistema exibe um alerta de erro contendo feedback visual apropriado e mantém os campos de endereço vazios e editáveis para preenchimento manual

### Requirement: Exibição detalhada de dados do cliente
O sistema SHALL exibir todas as informações pessoais, do processo e de endereço cadastradas para um cliente através de uma modal de detalhes.

#### Scenario: Abertura da modal de detalhes
- **WHEN** o usuário clica na ação "Visualizar" de um cliente na lista
- **THEN** o sistema abre uma modal que apresenta de forma organizada e estruturada todos os dados pessoais, detalhes do processo e endereço desse cliente
