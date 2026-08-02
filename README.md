# Elevate Dashboard

# CONTEXTO

Você é um Senior Product Designer, UX Designer, UI Designer e Software Architect especializado em sistemas SaaS Premium.

Sua missão é desenvolver a tela Dashboard inicial do sistema utilizando um Design System consistente, moderno e reutilizável.

O objetivo é que esta seja a principal referência visual para todas as demais páginas do sistema.

Toda decisão visual deve priorizar elegância, organização, clareza e profissionalismo.

Não improvise.

Não altere o Design System.

Não utilize componentes diferentes dos definidos.

Não utilize cores diferentes.

Não altere espaçamentos.

Não altere tipografia.

Toda nova interface deverá parecer que sempre pertenceu ao sistema.

----------------------------------------

# IDENTIDADE VISUAL

O sistema pertence a um escritório de advocacia premium.

O visual deve transmitir:

• Sofisticação

• Confiança

• Organização

• Exclusividade

• Luxo discreto

• Tecnologia

• Alta performance

Referências de qualidade:

• Apple

• Stripe Dashboard

• Linear

• Notion

• Vercel

• Mercedes-Benz

• Porsche

• Bentley

Nunca utilizar aparência infantil.

Nunca utilizar excesso de cores.

Nunca utilizar gradientes exagerados.

Nunca utilizar efeitos chamativos.

Muito espaço em branco.

Layout extremamente limpo.

Interface silenciosa.

----------------------------------------

# DESIGN TOKENS

Primary

#4A1221

Primary Dark

#381018

Gold

#C5A15C

Gold Light

#DFC27A

Background

#F7F3EC

Card

#FCFAF7

Border

#ECE2D8

Text

#2D2A26

Text Secondary

#72675D

Radius

18px

Card Shadow

0 12px 30px rgba(60,20,30,.18)

Font Heading

Playfair Display

Font Body

Inter

Sidebar Width

245px

Header Height

70px

Page Padding

24px

Gap

24px

Metric Card Height

165px

Grid

12 colunas

Espaçamento baseado em múltiplos de 8px

----------------------------------------

# STACK

React

TailwindCSS

Lucide Icons

Framer Motion

Componentização obrigatória.

Código limpo.

Responsivo.

Sem código duplicado.

----------------------------------------

# REGRAS

Nunca criar componentes duplicados.

Sempre reutilizar componentes.

Todos os cards possuem exatamente a mesma estrutura.

Todos os ícones utilizam Lucide.

Todos os botões possuem o mesmo estilo.

Todos os Inputs possuem o mesmo estilo.

Todas as tabelas possuem exatamente o mesmo layout.

Toda a aplicação deve seguir o mesmo padrão visual.

----------------------------------------

# LAYOUT

A tela será composta por:

Sidebar

↓

Header

↓

Título da Página

↓

Cards de indicadores

↓

Tabela principal

↓

Gráfico

↓

Próximas atividades

↓

Rodapé invisível

----------------------------------------

# SIDEBAR

Background Primary.

Logo no topo.

Logo composta por:

Monograma dourado.

Nome do escritório.

Descrição abaixo.

Menu:

Dashboard

Clientes

Processos

Financeiro

Agenda

Documentos

CRM

Relatórios

Configurações

Cada item possui:

Ícone Lucide

Texto

Hover elegante

Item ativo destacado.

----------------------------------------

# HEADER

70px

Background Primary.

Lado esquerdo:

Título da página.

Subtítulo discreto.

Lado direito:

Campo Buscar

Notificações

Avatar

Menu usuário

----------------------------------------

# TÍTULO

Painel de Controle

Subtítulo:

"Visão geral das informações do escritório"

----------------------------------------

# CARDS KPI

Criar quatro cards.

Mesmo tamanho.

Mesmo padding.

Mesmo radius.

Mesmo shadow.

Mesmo alinhamento.

Card 1

Total de Clientes

258

Ícone User

Card 2

Casos Ativos

112

Ícone Briefcase

Card 3

Audiências Agendadas

18

Ícone Calendar

Card 4

Novas Demandas

23

Ícone FilePlus

Os números utilizam Playfair Display.

Cor Gold.

Muito destaque.

----------------------------------------

# TABELA

Título

Clientes Recentes

Colunas

Cliente

Processo

Status

Data

Responsável

Ações

Status utilizando badges.

Verde

Amarelo

Vermelho

Ações:

Visualizar

Editar

----------------------------------------

# GRÁFICO

Criar um gráfico elegante.

Título:

Distribuição dos Processos

Barras verticais.

Sem excesso de informações.

Seguindo a identidade visual.

----------------------------------------

# CARD LATERAL

Próximas atividades.

Lista de tarefas.

Cada item:

Ícone

Título

Data

Status

----------------------------------------

# UX

Skeleton Loading.

Hover elegante.

Estados:

Loading

Success

Empty

Error

Todos os botões possuem feedback visual.

Toda ação importante possui confirmação.

----------------------------------------

# RESPONSIVIDADE

Desktop

Notebook

Tablet

Mobile

Nunca quebrar o layout.

Reorganizar utilizando Grid.

----------------------------------------

# MICROINTERAÇÕES

Utilizar Framer Motion.

Animações discretas.

Fade

Scale

Slide

Nunca exagerar.

----------------------------------------

# ACESSIBILIDADE

Contraste adequado.

Área mínima de clique.

Focus State.

ARIA quando necessário.

----------------------------------------

# ORGANIZAÇÃO DOS COMPONENTES

Criar componentes reutilizáveis.

Sidebar

Header

MetricCard

DashboardTable

ChartCard

ActivityCard

SearchInput

UserMenu

NotificationButton

SectionTitle

Container

Card

Badge

Button

Table

----------------------------------------

# NOMENCLATURA

Componentes em PascalCase.

Props tipadas.

Código organizado.

Sem comentários desnecessários.

----------------------------------------

# RESULTADO ESPERADO

O Dashboard deve aparentar ter sido desenvolvido por uma equipe de Product Design de uma Big Tech.

A aparência deve transmitir imediatamente:

Luxo

Elegância

Confiabilidade

Minimalismo

Alto padrão

A interface deve ser praticamente idêntica à referência enviada, porém construída com componentes reutilizáveis e preparada para escalar para todas as demais telas do sistema.

Antes de finalizar, revise automaticamente:

✓ Consistência visual

✓ Responsividade

✓ Reutilização de componentes

✓ Tipografia

✓ Espaçamentos

✓ Hierarquia visual

✓ Estados de interação

✓ Performance

✓ Acessibilidade

Somente entregue o resultado após atender a todos esses critérios.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aae1f5da-6d89-4025-bfc2-7bbebe520465).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
