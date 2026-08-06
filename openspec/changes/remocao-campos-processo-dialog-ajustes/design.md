## Context

Consulte o `proposal.md` para entender as necessidades desta mudança. O fechamento inesperado da modal ao avançar o passo ocorre porque o botão de avanço é desmontado e removido do DOM durante o ciclo de clique do Radix UI. Radix UI detecta que o clique se originou fora da modal porque o elemento clicado desapareceu do DOM, fechando o Dialog.

## Goals / Non-Goals

**Goals:**
- Manter os botões e formulários montados no DOM mudando apenas a visibilidade (CSS hidden/flex) ao invés de usar renderização condicional do React.
- Remover os campos de processo do formulário `RegisterClientDialog`.
- Persistir valores padrão (vazios) para `matter`, `owner` e `status` ao salvar o cliente para evitar quebras nos componentes que consomem a tabela.

## Decisions

### Persistência de Elementos no DOM (Wizard)
- **Decisão**: Ao invés de usar `{step === 1 ? <Passo1 /> : <Passo2 />}` e `{step === 1 ? <BotoesPasso1 /> : <BotoesPasso2 />}`, passaremos a envolver as seções em `div` com classes condicionais: `<div className={step === 1 ? "space-y-4" : "hidden"}>` e `<div className={step === 2 ? "space-y-4" : "hidden"}>`.
- **Razão**: Isso garante que os elementos de entrada e os botões permaneçam na árvore DOM após a mudança de estado, impedindo que o detector de cliques externos do Radix UI feche a modal.
