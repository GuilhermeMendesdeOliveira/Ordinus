## Purpose

Define the system of reusable contract blocks that can be composed to build fee agreement contracts, each with specific fields and auto-fill capabilities.

## ADDED Requirements

### Requirement: Available block types
The system SHALL provide the following block types: contratante, contratado, objeto, honorarios, valor_causa, pagamento, prazo, rescisao, foro, and clausulas.

#### Scenario: All blocks available in sidebar
- **WHEN** user opens the contract builder
- **THEN** sidebar displays all 10 block types with labels and icons

### Requirement: Contratante block
The system SHALL provide a contratante block with fields for client name, CPF/CNPJ, and address.

#### Scenario: Contratante block fields
- **WHEN** user adds a contratante block
- **THEN** block displays fields for Nome, CPF/CNPJ, Endereço, and allows text input

#### Scenario: Contratante auto-fill
- **WHEN** user selects a client from the client selector
- **THEN** contratante block fields are populated with client data automatically

### Requirement: Contratado block
The system SHALL provide a contratado block with fields for lawyer name, OAB number, and address.

#### Scenario: Contratado block fields
- **WHEN** user adds a contratado block
- **THEN** block displays fields for Nome, OAB, and Endereço

### Requirement: Objeto block
The system SHALL provide an objeto block with a textarea for describing the legal service.

#### Scenario: Objeto block field
- **WHEN** user adds an objeto block
- **THEN** block displays a textarea for Descrição do Serviço

### Requirement: Honorarios block
The system SHALL provide an honorarios block with fields for fixed value, percentage, and sucumbencial percentage.

#### Scenario: Honorarios with fixed value
- **WHEN** user enters a value in the fixed value field
- **THEN** block stores the fixed value in BRL currency format

#### Scenario: Honorarios with percentage
- **WHEN** user enters a percentage value
- **THEN** block stores the percentage and displays it with % symbol

#### Scenario: Honorarios with sucumbencial
- **WHEN** user enters a sucumbencial percentage
- **THEN** block stores the sucumbencial percentage separately

#### Scenario: Honorarios calculation mode
- **WHEN** user selects the calculation mode (fixo, percentual, or misto)
- **THEN** block adjusts displayed fields based on the selected mode

### Requirement: Valor da causa block
The system SHALL provide a valor_causa block with a currency field for the case value.

#### Scenario: Valor da causa field
- **WHEN** user adds a valor_causa block
- **THEN** block displays a currency input field for Valor Estimado da Ação

### Requirement: Pagamento block
The system SHALL provide a pagamento block with fields for payment conditions and deadlines.

#### Scenario: Pagamento block fields
- **WHEN** user adds a pagamento block
- **THEN** block displays fields for Condições de Pagamento and Prazo de Pagamento

### Requirement: Prazo block
The system SHALL provide a prazo block with fields for contract duration.

#### Scenario: Prazo block fields
- **WHEN** user adds a prazo block
- **THEN** block displays fields for Duração do Contrato and data fields

### Requirement: Rescisao block
The system SHALL provide a rescisao block with fields for termination conditions.

#### Scenario: Rescisao block fields
- **WHEN** user adds a rescisao block
- **THEN** block displays a textarea for Condições de Rescisão

### Requirement: Foro block
The system SHALL provide a foro block with a field for jurisdiction.

#### Scenario: Foro block field
- **WHEN** user adds a foro block
- **THEN** block displays a text input for Comarca Competente

### Requirement: Clausulas block
The system SHALL provide a clausulas block with a textarea for general clauses.

#### Scenario: Clausulas block field
- **WHEN** user adds a clausulas block
- **THEN** block displays a textarea for Disposições Gerais e Sigilo

### Requirement: Block content rendering
The system SHALL render block content in the preview using formatted legal text.

#### Scenario: Block content in preview
- **WHEN** a block is added to the canvas
- **THEN** preview displays the block content as formatted legal text with appropriate clauses
