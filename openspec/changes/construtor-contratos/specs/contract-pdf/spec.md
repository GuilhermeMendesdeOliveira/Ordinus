## Purpose

Generate professional PDF documents from contract data with formatted legal text and proper styling.

## ADDED Requirements

### Requirement: PDF generation
The system SHALL generate a PDF document from the current contract configuration.

#### Scenario: Generate PDF
- **WHEN** user clicks "Gerar PDF" with all required fields filled
- **THEN** system generates a PDF document with the contract content

#### Scenario: PDF download
- **WHEN** PDF generation completes
- **THEN** system triggers a browser download of the PDF file

### Requirement: PDF content formatting
The system SHALL format the PDF with professional legal document styling.

#### Scenario: PDF header
- **WHEN** PDF is generated
- **THEN** document displays "CONTRATO DE HONORÁRIOS ADVOCATÍCIOS" as the title

#### Scenario: PDF client section
- **WHEN** PDF is generated
- **THEN** document displays CONTRATANTE section with client data

#### Scenario: PDF lawyer section
- **WHEN** PDF is generated
- **THEN** document displays CONTRATADO section with lawyer data

#### Scenario: PDF clauses
- **WHEN** PDF is generated
- **THEN** document displays numbered clauses with formatted legal text

### Requirement: PDF signature block
The system SHALL include a signature block at the end of the PDF.

#### Scenario: Signature block
- **WHEN** PDF is generated
- **THEN** document displays signature lines for both Contratante and Contratado with location and date

### Requirement: PDF styling
The system SHALL use consistent typography and spacing in the PDF.

#### Scenario: Typography
- **WHEN** PDF is generated
- **THEN** document uses serif font for body text and appropriate heading styles

#### Scenario: Margins and spacing
- **WHEN** PDF is generated
- **THEN** document has proper margins (3cm) and line spacing (1.5)

### Requirement: PDF error handling
The system SHALL handle PDF generation errors gracefully.

#### Scenario: Generation failure
- **WHEN** PDF generation fails
- **THEN** system shows an error message and allows retry

### Requirement: PDF preview
The system SHALL display a preview of the contract before PDF generation.

#### Scenario: Preview display
- **WHEN** contract has blocks in the canvas
- **THEN** preview panel shows formatted contract text matching PDF output
