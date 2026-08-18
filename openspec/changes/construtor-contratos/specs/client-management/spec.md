## MODIFIED Requirements

### Requirement: Client row actions
The system SHALL display action buttons for each client row including view, edit, delete, and generate contract.

#### Scenario: Generate contract button
- **WHEN** user views the client list
- **THEN** each client row displays a "Gerar Contrato" button (document icon)

#### Scenario: Click generate contract
- **WHEN** user clicks the "Gerar Contrato" button for a client
- **THEN** system navigates to `/contratos/novo?clientId=<id>` with the client pre-selected
