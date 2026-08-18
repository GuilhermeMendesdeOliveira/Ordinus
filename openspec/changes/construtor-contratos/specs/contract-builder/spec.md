## Purpose

Provide a visual contract builder interface with drag-and-drop functionality for assembling fee agreement contracts from reusable blocks, with real-time preview and client auto-fill.

## ADDED Requirements

### Requirement: Builder screen layout
The system SHALL display a three-column layout with block sidebar on the left, contract canvas in the center, and contract preview on the right.

#### Scenario: Builder loads correctly
- **WHEN** user navigates to `/contratos/novo`
- **THEN** system displays the three-column builder interface with all available blocks in the sidebar

### Requirement: Drag and drop blocks
The system SHALL allow users to drag blocks from the sidebar and drop them onto the canvas to add them to the contract.

#### Scenario: Block added via drag
- **WHEN** user drags a block from the sidebar and drops it on the canvas
- **THEN** system adds the block to the contract at the drop position and updates the preview

#### Scenario: Block reordered via drag
- **WHEN** user drags a block within the canvas to a new position
- **THEN** system reorders the blocks and updates the preview accordingly

### Requirement: Block removal
The system SHALL allow users to remove blocks from the canvas.

#### Scenario: Remove block
- **WHEN** user clicks the remove button on a block in the canvas
- **THEN** system removes the block from the contract and updates the preview

### Requirement: Client selection and auto-fill
The system SHALL allow users to select an existing client and auto-fill client data into the contract.

#### Scenario: Select client from dropdown
- **WHEN** user selects a client from the client selector dropdown
- **THEN** system populates the contratante block with client data (name, CPF/CNPJ, address)

#### Scenario: Clear client selection
- **WHEN** user clears the client selection
- **THEN** system clears auto-filled fields in the contratante block

### Requirement: Real-time preview
The system SHALL display a formatted preview of the contract that updates in real-time as blocks are added, removed, or reordered.

#### Scenario: Preview updates on block change
- **WHEN** user adds, removes, or reorders a block
- **THEN** system updates the preview to reflect the current contract structure within 500ms

### Requirement: Multiple contratado support
The system SHALL allow users to add multiple contratado blocks for contracts with multiple lawyers.

#### Scenario: Add additional contratado
- **WHEN** user clicks "Adicionar" button on the contratado block
- **THEN** system adds a new contratado block to the canvas

### Requirement: Access from sidebar
The system SHALL provide access to the contract builder from the main sidebar navigation.

#### Scenario: Navigate via sidebar
- **WHEN** user clicks "Contratos" in the sidebar
- **THEN** system navigates to the contracts list page

#### Scenario: Create new contract from sidebar
- **WHEN** user clicks "Novo Contrato" button on the contracts list page
- **THEN** system navigates to the contract builder at `/contratos/novo`

### Requirement: Access from client page
The system SHALL provide a "Gerar Contrato" button on the client list page that opens the builder with the client pre-selected.

#### Scenario: Generate contract for specific client
- **WHEN** user clicks the "Gerar Contrato" button for a client row
- **THEN** system navigates to `/contratos/novo?clientId=<id>` with the client pre-selected

### Requirement: Form validation
The system SHALL validate that all required fields are filled before allowing PDF generation.

#### Scenario: Validation error on generate
- **WHEN** user clicks "Gerar PDF" with missing required fields
- **THEN** system highlights the missing fields and shows a validation error message

#### Scenario: Validation passes
- **WHEN** user clicks "Gerar PDF" with all required fields filled
- **THEN** system proceeds to PDF generation
