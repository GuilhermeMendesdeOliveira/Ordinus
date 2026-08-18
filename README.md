<div align="center">

# ⚖️ Ordinus Frontend

### Dashboard de Gestão Jurídica para Escritórios de Advocacia

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge&logo=semver&logoColor=white" alt="Version"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/TanStack_Start-1.168-000?style=for-the-badge&logo=react&logoColor=white" alt="TanStack Start"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
</p>

<p align="center">
  Interface web moderna e responsiva para gerenciamento completo de processos jurídicos, clientes, contratos e prazos advocatícios.
</p>

<br/>

<p align="center">
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-features">Features</a> •
  <a href="#-rotas">Rotas</a> •
  <a href="#-componentes">Componentes</a> •
  <a href="#-como-executar">Como Executar</a> •
  <a href="#-deploy">Deploy</a>
</p>

<br/>

---

</div>

## 📋 Sumário

- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Features](#-features)
- [Rotas](#-rotas)
- [Componentes](#-componentes)
- [Hooks & Stores](#-hooks--stores)
- [Como Executar](#-como-executar)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Deploy](#-deploy)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Licença](#-licença)

---

## 🚀 Tecnologias

<div align="center">

### Core

| Tecnologia | Versão | Descrição |
|:---:|:---:|---|
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) | `19.2` | Biblioteca de interface |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | `5.8` | Linguagem com tipagem estática |
| ![TanStack Start](https://img.shields.io/badge/-TanStack_Start-000?style=flat-square&logo=react&logoColor=white) | `1.168` | Framework SSR full-stack |
| ![TanStack Router](https://img.shields.io/badge/-TanStack_Router-000?style=flat-square&logo=react&logoColor=white) | `1.170` | Roteamento file-based |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | `8.1` | Build tool de alta performance |
| ![Nitro](https://img.shields.io/badge/-Nitro-000?style=flat-square&logo=nitro&logoColor=white) | `3.0` | Server engine (SSR) |

### UI & Styling

| Biblioteca | Descrição |
|---|---|
| `tailwindcss` | Framework CSS utility-first |
| `@radix-ui/*` | Primitivos de UI acessíveis (30+ componentes) |
| `shadcn/ui` | Componentes reutilizáveis (estilo New York) |
| `lucide-react` | Ícones SVG consistentes |
| `class-variance-authority` | Variants de componentes |
| `tailwind-merge` | Merge inteligente de classes Tailwind |
| `motion` | Animações e transições fluidas |
| `embla-carousel-react` | Carrosséis responsivos |
| `vaul` | Drawers modais |
| `cmdk` | Command palette (⌘K) |
| `sonner` | Toast notifications elegantes |

### Forms & Validação

| Biblioteca | Descrição |
|---|---|
| `react-hook-form` | Gerenciamento de formulários performático |
| `@hookform/resolvers` | Integradores de validação |
| `zod` | Validação de schemas TypeScript |
| `react-day-picker` | Seletor de datas acessível |
| `input-otp` | Input de código OTP |

### Data & Visualização

| Biblioteca | Descrição |
|---|---|
| `@tanstack/react-query` | Fetching e cache de dados |
| `recharts` | Gráficos e dashboards |
| `@react-pdf/renderer` | Geração de PDFs no cliente |
| `@tiptap/react` | Editor rich-text extensível |
| `date-fns` | Manipulação de datas |

### Drag & Drop

| Biblioteca | Descrição |
|---|---|
| `@dnd-kit/core` | Framework DnD acessível |
| `@dnd-kit/sortable` | Listas ordenáveis |
| `react-resizable-panels` | Painéis redimensionáveis |

</div>

---

## 🏗️ Arquitetura

<div align="center">

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR                                │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   TanStack Start    │
                    │   (SSR + Hydration) │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼───────┐    ┌────────▼────────┐    ┌────────▼────────┐
│   TanStack    │    │  React Query    │    │   React Hook    │
│   Router      │    │  (Data Layer)   │    │   Form + Zod    │
│  (File-based) │    │  - Fetching     │    │  (Forms)        │
│  - Routes     │    │  - Caching      │    │  - Validation   │
│  - Layouts    │    │  - Mutations    │    │  - Submission   │
└───────┬───────┘    └────────┬────────┘    └────────┬────────┘
        │                     │                      │
        └──────────────────────┼──────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │    API Client       │
                    │   (Fetch Wrapper)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Backend API       │
                    │   (Express.js)      │
                    └─────────────────────┘
```

</div>

### Padrões Utilizados

- **File-based Routing** — Rotas definidas pela estrutura de pastas
- **Server-Side Rendering (SSR)** — Renderização no servidor com hidratação
- **Component Composition** — Componentes pequenos e reutilizáveis
- **Context API** — Estado global (auth, sidebar, theme)
- **Custom Hooks** — Lógica reutilizável encapsulada
- **Store Pattern** — Gerenciamento de estado com TanStack Query
- **Protected Routes** — Rotas protegidas com autenticação
- **Responsive Design** — Layout adaptativo mobile-first

---

## ✨ Features

<div align="center">

| Módulo | Descrição |
|:---:|---|
| 📊 **Dashboard** | Métricas, gráficos e indicadores do escritório |
| ⚖️ **Processos** | CRUD completo com timeline, documentos e movimentações |
| 📝 **Contratos** | Editor visual com blocos drag-and-drop e geração de PDF |
| 👤 **Clientes** | Gestão de clientes com busca e filtros avançados |
| 📅 **Prazos** | Controle de prazos com alertas visuais |
| 🔔 **Notificações** | Sistema de notificações em tempo real |
| 🌐 **Portal do Cliente** | Área exclusiva para acompanhamento de casos |
| 📋 **Templates** | Modelos reutilizáveis de contratos |
| 🔐 **Autenticação** | Login seguro com rotas protegidas |
| 🎨 **Tema** | Suporte a temas claro e escuro |
| 📱 **Responsivo** | Layout adaptativo para todos os dispositivos |
| ⌨️ **Command Palette** | Acesso rápido com ⌘K |
| 📄 **Geração de PDF** | Exportação de contratos em PDF |
| ✍️ **Editor Rich Text** | Editor TipTap com formatação avançada |
| 🖱️ **Drag & Drop** | Reordenação de blocos de contratos |

</div>

---

## 🛤️ Rotas

<div align="center">

```
/                           # Dashboard principal
/login                      # Autenticação

/processos                  # Lista de processos
/processos/:id              # Detalhes do processo

/clientes                   # Gestão de clientes

/contratos                  # Lista de contratos
/contratos/novo             # Criar novo contrato
/contratos/:id              # Editor de contrato

/configuracoes              # Configurações do sistema

/portal                     # Portal do cliente (dashboard)
/portal/login               # Login do cliente
/portal/processos           # Processos do cliente
/portal/contratos           # Contratos do cliente
/portal/notificacoes        # Notificações do cliente
```

</div>

---

## 🧩 Componentes

<div align="center">

### UI Components (47 componentes)

</div>

<details>
<summary><b>📦 Componentes de UI (shadcn/ui)</b></summary>

| Componente | Descrição |
|---|---|
| `accordion` | Seções expansíveis |
| `alert-dialog` | Diálogos de confirmação |
| `alert` | Alertas informativos |
| `aspect-ratio` | Controle de proporção |
| `avatar` | Avatares de usuários |
| `badge` | Etiquetas e tags |
| `breadcrumb` | Navegação hierárquica |
| `button` | Botões com variants |
| `calendar` | Calendário interativo |
| `card` | Cards de conteúdo |
| `carousel` | Carrosséis de imagens |
| `chart` | Gráficos integrados |
| `checkbox` | Caixas de seleção |
| `collapsible` | Conteúdo recolhível |
| `command` | Command palette (⌘K) |
| `context-menu` | Menu de contexto |
| `dialog` | Modais e diálogos |
| `drawer` | Drawers laterais |
| `dropdown-menu` | Menus dropdown |
| `form` | Formulários integrados |
| `hover-card` | Cards em hover |
| `input-otp` | Input de código OTP |
| `input` | Campos de entrada |
| `label` | Rótulos de formulário |
| `menubar` | Barra de menus |
| `navigation-menu` | Menu de navegação |
| `pagination` | Paginação |
| `popover` | Popovers |
| `progress` | Barras de progresso |
| `radio-group` | Grupo de radio buttons |
| `resizable` | Painéis redimensionáveis |
| `rich-text-editor` | Editor TipTap |
| `scroll-area` | Áreas de scroll customizadas |
| `select` | Selects acessíveis |
| `separator` | Divisores |
| `sheet` | Sheets laterais |
| `sidebar` | Sidebar responsiva |
| `skeleton` | Loading skeletons |
| `slider` | Sliders de seleção |
| `sonner` | Toast notifications |
| `switch` | Toggle switches |
| `table` | Tabelas de dados |
| `tabs` | Abas de navegação |
| `textarea` | Áreas de texto |
| `toggle-group` | Grupos de toggle |
| `toggle` | Botões de toggle |
| `tooltip` | Tooltips informativos |

</details>

<details>
<summary><b>📊 Dashboard Components</b></summary>

| Componente | Descrição |
|---|---|
| `Header` | Cabeçalho com navegação e perfil |
| `Sidebar` | Menu lateral navegável |
| `MetricCard` | Cards de métricas |
| `ChartCard` | Cards com gráficos |
| `DashboardTable` | Tabela de dados principal |
| `ActivityCard` | Card de atividades recentes |
| `DeadlineList` | Lista de prazos |
| `DeadlineDialog` | Diálogo de prazos |
| `SearchInput` | Campo de busca |
| `UserMenu` | Menu do usuário |
| `NotificationButton` | Botão de notificações |
| `RegisterProcessDialog` | Cadastro de processos |
| `RegisterClientDialog` | Cadastro de clientes |
| `ViewClientDialog` | Visualização de clientes |
| `ProcessDetailsForm` | Formulário de detalhes |
| `ProcessTimeline` | Timeline de movimentações |
| `DocumentUploadDialog` | Upload de documentos |
| `DocumentViewerDialog` | Visualizador de documentos |
| `AddMovementDialog` | Adicionar movimentação |
| `ConfirmDeleteDialog` | Confirmação de exclusão |
| `CreateProcessPromptDialog` | Prompt de criação |

</details>

<details>
<summary><b>📝 Contract Components</b></summary>

| Componente | Descrição |
|---|---|
| `ContractBuilder` | Editor principal de contratos |
| `ContractCanvas` | Canvas de edição drag-and-drop |
| `ContractPreview` | Pré-visualização do contrato |
| `ContractList` | Lista de contratos |
| `ContractPDF` | Gerador de PDF |
| `ContractPDFModal` | Modal de PDF |
| `BlockCard` | Card de bloco editável |
| `BlockSidebar` | Sidebar de blocos disponíveis |
| `FieldEditor` | Editor de campos |
| `ClientSelector` | Seletor de clientes |
| `TemplateManager` | Gerenciador de templates |
| `StandardClauses` | Cláusulas padrão |
| `CustomBlockModal` | Modal de blocos customizados |
| `LetterheadSettings` | Configurações de timbrado |
| `LogoSettings` | Configurações de logo |

</details>

<details>
<summary><b>🌐 Portal Components</b></summary>

| Componente | Descrição |
|---|---|
| `ClientHeader` | Cabeçalho do portal |
| `ClientSidebar` | Menu lateral do portal |
| `ClientProtectedRoute` | Rotas protegidas do cliente |

</details>

<details>
<summary><b>🔐 Auth Components</b></summary>

| Componente | Descrição |
|---|---|
| `ProtectedRoute` | HOC de rota protegida |

</details>

---

## 🔄 Hooks & Stores

<div align="center">

### Contexts (Estado Global)

| Context | Descrição |
|---|---|
| `AuthContext` | Autenticação e sessão do usuário |
| `ClientAuthContext` | Autenticação do portal do cliente |
| `SidebarContext` | Estado da sidebar (aberta/fechada) |

</div>

<div align="center">

### Stores (TanStack Query)

| Store | Descrição |
|---|---|
| `api-client.ts` | Cliente HTTP centralizado |
| `processes-store.ts` | CRUD de processos |
| `contracts-store.ts` | CRUD de contratos |
| `clients-store.ts` | CRUD de clientes |
| `deadlines-store.ts` | CRUD de prazos |
| `notifications-store.ts` | CRUD de notificações |
| `templates-store.ts` | CRUD de templates |
| `custom-blocks-store.ts` | CRUD de blocos customizados |
| `custom-clauses-store.ts` | CRUD de cláusulas |

</div>

<div align="center">

### Utilities

| Utilidade | Descrição |
|---|---|
| `contract-utils.ts` | Funções auxiliares de contratos |
| `datajud-service.ts` | Integração com API DataJud |
| `error-capture.ts` | Captura de erros |
| `error-page.ts` | Página de erro customizada |
| `utils.ts` | Utilitários gerais (cn, etc.) |

</div>

---

## 🛠️ Como Executar

### Pré-requisitos

- ![Node.js](https://img.shields.io/badge/-Node.js%20%3E%3D%2022-339933?style=flat-square&logo=node.js&logoColor=white)
- ![npm](https://img.shields.io/badge/-npm%20%3E%3D%2010-CB3837?style=flat-square&logo=npm&logoColor=white) ou ![Bun](https://img.shields.io/badge/-Bun-000?style=flat-square&logo=bun&logoColor=white)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/ordinus-frontend.git
cd ordinus-frontend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com a URL do backend

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

<div align="center">

| Script | Descrição |
|:---:|---|
| `npm run dev` | Inicia em modo desenvolvimento com HMR |
| `npm run build` | Build de produção |
| `npm run build:dev` | Build em modo desenvolvimento |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Verifica código com ESLint |
| `npm run format` | Formata código com Prettier |

</div>

---

## 🔧 Variáveis de Ambiente

<details>
<summary><b>Clique para expandir todas as variáveis</b></summary>

```env
# ============================================
# API
# ============================================
VITE_API_URL=http://localhost:3000/api/v1    # URL do backend

# ============================================
# NODE (SSR)
# ============================================
NODE_ENV=development                          # development | production
PORT=3000                                     # Porta do servidor SSR
```

</details>

---

## 🐳 Deploy

### Docker

```bash
# Build da imagem
docker build -t ordinus-frontend .

# Executar
docker run -p 80:80 ordinus-frontend
```

### Coolify

1. Crie um novo recurso **Public Application**
2. Selecione o repositório Git
3. Configure **Build Pack** como `Dockerfile`
4. Adicione as variáveis de ambiente no painel
5. Configure **Port Exposes** como `80`
6. Clique em **Deploy**

### Build Manual

```bash
# Build de produção
npm run build

# O output estará em .output/
# Servidor Node.js em .output/server/index.mjs
```

---

## 📁 Estrutura do Projeto

```
elevate-dashboard/
├── src/
│   ├── components/             # Componentes React
│   │   ├── auth/               # Autenticação
│   │   ├── contracts/          # Editor de contratos
│   │   ├── dashboard/          # Dashboard principal
│   │   ├── portal/             # Portal do cliente
│   │   ├── system/             # Componentes de sistema
│   │   └── ui/                 # Componentes base (shadcn/ui)
│   │
│   ├── lib/                    # Utilitários e stores
│   │   ├── api-client.ts       # Cliente HTTP
│   │   ├── auth-context.tsx    # Context de autenticação
│   │   ├── *-store.ts          # Stores (TanStack Query)
│   │   └── utils.ts            # Utilitários gerais
│   │
│   ├── routes/                 # Rotas (file-based)
│   │   ├── __root.tsx          # Layout raiz
│   │   ├── index.tsx           # Dashboard
│   │   ├── login.tsx           # Login
│   │   ├── processos/          # Processos
│   │   ├── clientes/           # Clientes
│   │   ├── contratos/          # Contratos
│   │   ├── configuracoes/      # Configurações
│   │   └── portal/             # Portal do cliente
│   │
│   ├── styles.css              # Estilos globais (Tailwind)
│   └── routeTree.gen.ts        # Árvore de rotas gerada
│
├── public/                     # Assets estáticos
│   ├── favicon.svg             # Favicon (balança)
│   └── robots.txt
│
├── Dockerfile                  # Configuração Docker
├── .dockerignore
├── components.json             # Config shadcn/ui
├── vite.config.ts              # Configuração Vite
├── tsconfig.json               # Configuração TypeScript
├── package.json
└── README.md
```

---

## 🎨 Design System

<div align="center">

### Cores Primárias

| Cor | Hex | Uso |
|:---:|:---:|---|
| 🔵 | `#1e3a5f` | Cor principal (azul escuro) |
| 🟡 | `#c9a84c` | Destaques (dourado) |
| ⚪ | `#f8fafc` | Background claro |
| ⚫ | `#0f172a` | Background escuro |

### Tipografia

| Fonte | Uso |
|---|---|
| **Cinzel** | Títulos e headings |
| **Inter** | Texto corpo e UI |

### Componentes

- **47 componentes** base (shadcn/ui)
- **Estilo:** New York
- **Base color:** Slate
- **CSS Variables:** Habilitado
- **Ícones:** Lucide React

</div>

---

## 🔌 Integrações

<div align="center">

| Serviço | Descrição |
|---|---|
| **Ordinus Backend** | API RESTful principal |
| **DataJud API** | Consulta pública de processos judiciais |
| **WebSocket** | Comunicação em tempo real com o backend |
| **PDF Renderer** | Geração de contratos em PDF |

</div>

---

## 📊 Performance

<div align="center">

| Métrica | Valor |
|---|---|
| **First Contentful Paint** | < 1.5s |
| **Largest Contentful Paint** | < 2.5s |
| **Time to Interactive** | < 3.5s |
| **Cumulative Layout Shift** | < 0.1 |

</div>

---

## 🧪 Qualidade

<div align="center">

| Ferramenta | Uso |
|---|---|
| **TypeScript** | Tipagem estática |
| **ESLint** | Linting de código |
| **Prettier** | Formatação consistente |
| **Zod** | Validação em runtime |

</div>

---

## 📝 Licença

<div align="center">

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

<br/>

---

### Desenvolvido com ❤️ por Jeniffer Lemes Advocacia

<p align="center">
  <img src="https://img.shields.io/badge/⚖️-Ordinus-1a1a2e?style=for-the-badge" alt="Ordinus"/>
</p>

</div>
