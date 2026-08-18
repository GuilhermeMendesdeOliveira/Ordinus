## 1. Setup e Dependências

- [x] 1.1 Instalar @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- [x] 1.2 Instalar @react-pdf/renderer
- [x] 1.3 Criar diretório src/components/contracts/
- [x] 1.4 Criar diretório src/types/

## 2. Tipos e Interfaces

- [x] 2.1 Criar src/types/contract.ts com tipos ContractBlock, Field, Contract, ContractTemplate
- [x] 2.2 Definir tipos para BlockType e FieldType

## 3. Stores

- [x] 3.1 Criar src/lib/contracts-store.ts com CRUD de contratos
- [x] 3.2 Criar src/lib/templates-store.ts com CRUD de templates
- [x] 3.3 Criar src/lib/contract-utils.ts com utilitários de formatação

## 4. Componentes Base

- [x] 4.1 Criar FieldEditor.tsx - editor de campos genérico
- [x] 4.2 Criar BlockCard.tsx - card de bloco arrastável
- [x] 4.3 Criar ClientSelector.tsx - seleção de cliente com auto-fill

## 5. Sistema de Drag-and-Drop

- [x] 5.1 Criar BlockSidebar.tsx com lista de blocos arrastáveis
- [x] 5.2 Criar ContractCanvas.tsx com área de drop sortable
- [x] 5.3 Integrar dnd-kit no ContractBuilder.tsx

## 6. Builder Principal

- [x] 6.1 Criar ContractBuilder.tsx com layout 3 colunas
- [x] 6.2 Implementar estado do construtor com useReducer
- [x] 6.3 Implementar auto-preenchimento do cliente

## 7. Blocos do Contrato

- [x] 7.1 Implementar bloco Contratante com campos
- [x] 7.2 Implementar bloco Contratado com suporte a múltiplos
- [x] 7.3 Implementar bloco Objeto com textarea
- [x] 7.4 Implementar bloco Honorários com fixo/percentual/sucumbencial
- [x] 7.5 Implementar bloco Valor da Causa
- [x] 7.6 Implementar bloco Pagamento
- [x] 7.7 Implementar bloco Prazo
- [x] 7.8 Implementar bloco Rescisão
- [x] 7.9 Implementar bloco Foro
- [x] 7.10 Implementar bloco Cláusulas Gerais

## 8. Preview

- [x] 8.1 Criar ContractPreview.tsx com formatação legal
- [x] 8.2 Implementar renderização de blocos no preview
- [x] 8.3 Implementar atualização em tempo real

## 9. Templates

- [x] 9.1 Criar TemplateManager.tsx para gerenciamento
- [x] 9.2 Implementar salvar template
- [x] 9.3 Implementar carregar template
- [x] 9.4 Implementar deletar template
- [x] 9.5 Criar templates padrão (Padrão, Trabalhista, Cível)

## 10. PDF

- [x] 10.1 Criar ContractPDF.tsx com @react-pdf/renderer
- [x] 10.2 Implementar formatação do documento
- [x] 10.3 Implementar bloco de assinaturas
- [x] 10.4 Implementar download do PDF
- [x] 10.5 Implementar tratamento de erros

## 11. Rotas

- [x] 11.1 Criar src/routes/contratos/index.tsx - lista de contratos
- [x] 11.2 Criar src/routes/contratos/novo.tsx - construtor
- [x] 11.3 Criar src/routes/contratos/$id.tsx - visualizar/editar
- [x] 11.4 Implementar parâmetro clientId na URL

## 12. Integração

- [x] 12.1 Adicionar item "Contratos" no Sidebar.tsx
- [x] 12.2 Adicionar botão "Gerar Contrato" na página de clientes
- [x] 12.3 Implementar navegação com clientId

## 13. Validação

- [x] 13.1 Implementar validação de campos obrigatórios
- [x] 13.2 Implementar mensagens de erro
- [x] 13.3 Implementar validação de templates

## 14. Testes e Ajustes

- [ ] 14.1 Testar fluxo completo de criação
- [ ] 14.2 Testar drag-and-drop
- [ ] 14.3 Testar auto-preenchimento
- [ ] 14.4 Testar geração de PDF
- [ ] 14.5 Testar templates
- [ ] 14.6 Ajustar estilos e responsividade
