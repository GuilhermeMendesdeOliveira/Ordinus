## Purpose

Enable users to save and reuse contract block configurations as templates for faster contract creation.

## ADDED Requirements

### Requirement: Save template
The system SHALL allow users to save the current block configuration as a named template.

#### Scenario: Save new template
- **WHEN** user clicks "Salvar Template" and enters a template name
- **THEN** system saves the current block configuration with the given name and timestamp

#### Scenario: Template saved to storage
- **WHEN** user saves a template
- **THEN** system persists the template to localStorage and shows a success message

### Requirement: Load template
The system SHALL allow users to load a previously saved template into the builder.

#### Scenario: Select template from sidebar
- **WHEN** user clicks a template name in the sidebar templates section
- **THEN** system replaces the current canvas blocks with the template's block configuration

#### Scenario: Template loads with client selection
- **WHEN** user loads a template and has a client selected
- **THEN** system loads blocks and auto-fills client data into the contratante block

### Requirement: Delete template
The system SHALL allow users to delete saved templates.

#### Scenario: Delete template
- **WHEN** user clicks the delete button on a template
- **THEN** system removes the template from storage after confirmation

### Requirement: Template list display
The system SHALL display saved templates in the sidebar with name and last modified date.

#### Scenario: Templates listed in sidebar
- **WHEN** user opens the contract builder
- **THEN** sidebar displays a "Templates" section with all saved templates

### Requirement: Default templates
The system SHALL provide default templates for common contract types.

#### Scenario: Default templates available
- **WHEN** user opens the contract builder for the first time
- **THEN** system displays default templates: "Padrão", "Trabalhista", "Cível"

### Requirement: Template validation
The system SHALL validate that templates contain at least the required blocks before saving.

#### Scenario: Invalid template save
- **WHEN** user tries to save a template without required blocks (contratante, objeto, honorarios)
- **THEN** system shows an error message listing missing required blocks

### Requirement: Template overwrite
The system SHALL allow users to update an existing template with the current configuration.

#### Scenario: Update existing template
- **WHEN** user clicks "Salvar Template" and selects an existing template name
- **THEN** system prompts for confirmation and updates the template with current blocks
