# Documentação do Sistema — RadFlow

Sistema SaaS de emissão e gestão de laudos radiológicos, voltado para clínicas e radiologistas. Permite criar atendimentos, preencher laudos com editor rich text e variáveis dinâmicas, gerenciar pacientes, modelos de exame e frases padrão, além de imprimir laudos formatados em A4.

---

## 🚀 Principais Features

- **Laudos** — criação, edição e finalização de laudos com editor TipTap + variáveis dinâmicas
- **Pacientes** — cadastro e histórico de atendimentos
- **Modelos de Exame** — templates reutilizáveis com variáveis por unidade
- **Frases Padrão** — biblioteca de autotexto por categoria
- **Unidades** — multi-tenant por clínica/unidade de atendimento
- **Impressão A4** — rota dedicada `/print` com layout de laudo
- **Assinatura Digital** — upload e inserção no laudo
- **Planos e Faturamento** — integração Stripe (mensal/anual)
- **Admin** — painel super_admin com usuários, planos, assinaturas e feedbacks
- **Onboarding** — checklist guiado ao primeiro acesso

---

## 📋 Requisitos Funcionais

1. Usuário autenticado acessa apenas dados da própria conta (RLS Supabase)
2. Unidade ativa é persistida em cookie (`radflow_active_unit_id`) e gerenciada por context
3. Acesso às rotas protegidas exige assinatura ativa ou trial válido
4. Painel admin restrito a `profiles.role === "super_admin"`
5. Laudos possuem status: `pending` → `in_progress` → `completed`
6. Modelos e frases podem ser vinculados a uma unidade ou compartilhados (todas)
7. Impressão de laudo acessível apenas quando status `completed`
8. Pagamentos processados pelo Stripe; portal de gerenciamento via Customer Portal

---

## 📁 Estrutura de Componentes

```
components/
├── ui/               # Primitivos de UI (shadcn/Radix) — usados em todo o app
├── shared/           # Componentes de layout genérico reutilizados em todas as páginas
├── layout/           # Componentes do shell do app protegido (sidebar, header)
├── auth/             # Formulários e wrappers das rotas de autenticação
├── admin/            # Tabelas, kanbans e sidebars do painel super_admin
├── onboarding/       # Checklist, provider e tracker do onboarding
├── configuracoes/    # Sheets e filtros das configurações (modelos, frases, unidades, plano)
├── laudos/           # Editor, tabelas e extensões TipTap do módulo de laudos
├── pacientes/        # Sheet e filtro do módulo de pacientes
├── landing-page/     # Seções da landing page de marketing
└── seo/              # JsonLd para structured data
```

### `components/shared/`
| Arquivo | Usado em | Função |
|---------|----------|--------|
| `data-table.tsx` | Todas as páginas com listagem | Tabela genérica tipada (`DataTableColumn<T>`) |
| `data-pagination.tsx` | Laudos, pacientes, modelos | Paginação via query string |
| `data-filter.tsx` | Laudos | Filtro de status + intervalo de datas |
| `page-header.tsx` | Todas as páginas protegidas e admin | Título, descrição e slot de ações |
| `page-container.tsx` | Todas as páginas protegidas | Container com padding consistente |

### `components/layout/`
| Arquivo | Usado em | Função |
|---------|----------|--------|
| `app-sidebar.tsx` | `app/(protected)/layout.tsx` | Navegação lateral principal + feedback modal |
| `unit-switcher.tsx` | `app/(protected)/layout.tsx` | Seleção de unidade ativa (cookie + context) |
| `user-profile.tsx` | `app/(protected)/layout.tsx` | Avatar e dropdown do usuário |
| `theme-switcher.tsx` | App sidebar, admin sidebar, navbar | Toggle light/dark mode |
| `feedback-modal.tsx` | `app-sidebar.tsx` | Modal de envio de feedback ao time |

### `components/auth/`
| Arquivo | Usado em | Função |
|---------|----------|--------|
| `login-form.tsx` | `app/auth/login` | Formulário de login |
| `sign-up-form.tsx` | `app/auth/sign-up` | Formulário de cadastro |
| `forgot-password-form.tsx` | `app/auth/forgot-password` | Recuperação de senha |
| `update-password-form.tsx` | `app/auth/update-password` | Definição de nova senha |
| `auth-layout-wrapper.tsx` | Páginas de auth | Wrapper visual das telas de auth |
| `logout-button.tsx` | `auth-button.tsx` | Botão de encerrar sessão |
| `auth-button.tsx` | *(legado — não utilizado em produção)* | Botão de auth do template original |

### `components/admin/`
| Arquivo | Usado em | Função |
|---------|----------|--------|
| `admin-sidebar.tsx` | `app/(admin)/layout.tsx` | Navegação lateral do painel admin |
| `admin-profile-dropdown.tsx` | Admin sidebar e layout | Menu do usuário admin |
| `user-table-client.tsx` | `/admin/usuarios` | Tabela de usuários da plataforma |
| `role-switcher.tsx` | `user-table-client.tsx` | Altera role do usuário |
| `user-active-toggle.tsx` | `user-table-client.tsx` | Ativa/desativa conta |
| `plans-table-client.tsx` | `/admin/planos` | CRUD visual de planos Stripe |
| `feedback-table-client.tsx` | `/admin/feedbacks` | Tabela de feedbacks recebidos |
| `feedback-kanban-client.tsx` | `/admin/feedbacks` | Kanban de feedbacks (drag-and-drop) |
| `feedback-kanban-item.tsx` | `feedback-kanban-client.tsx` | Card individual do kanban |
| `feedback-status-switcher.tsx` | Tabela e kanban de feedbacks | Troca de status do feedback |

### `components/onboarding/`
| Arquivo | Usado em | Função |
|---------|----------|--------|
| `onboarding-checklist.tsx` | `/onboarding` | Passos e progresso do onboarding |
| `onboarding-provider.tsx` | `app/(protected)/layout.tsx` | Context global do estado do onboarding |
| `onboarding-tracker.tsx` | `app/(protected)/layout.tsx` | Barra de progresso no rodapé do layout |

### `components/configuracoes/`
| Arquivo | Usado em | Função |
|---------|----------|--------|
| `ModelSheet.tsx` | `/configuracoes/modelos` | Sheet criar/editar modelo de exame |
| `ModelsFilter.tsx` | `/configuracoes/modelos` | Busca e filtro por unidade |
| `PhraseSheet.tsx` | `/configuracoes/frases` | Sheet criar/editar frase padrão |
| `PhrasesFilter.tsx` | `/configuracoes/frases` | Filtro por categoria |
| `UnitSheet.tsx` | `/configuracoes/unidades` | Sheet criar/editar unidade |
| `plano/subscription-alert.tsx` | `/configuracoes/plano` | Alerta de trial/expiração |
| `plano/manage-subscription-button.tsx` | `/configuracoes/plano` | Abre portal Stripe |

### `components/laudos/`
| Arquivo | Usado em | Função |
|---------|----------|--------|
| `LaudoEditor.tsx` | `/laudos/[requestId]/[itemId]` | Shell do editor: status, seções, salvar/finalizar |
| `LaudoRichTextEditor.tsx` | Editor e assinatura | Editor TipTap com toolbars |
| `LaudoVariablesPanel.tsx` | `LaudoEditor.tsx` | Painel lateral de variáveis do template |
| `LaudosTable.tsx` | `/laudos` e `/dashboard` | Tabela de atendimentos com ações |
| `LaudosUnitSync.tsx` | `/laudos` | Sincroniza unidade ativa com filtro da lista |
| `NovoLaudoForm.tsx` | `/laudos/novo` | Formulário de criação de atendimento |
| `VariableContext.tsx` | Editor de laudos | Context React das variáveis dinâmicas |
| `extensions/VariableExtension.tsx` | TipTap | Nó customizado para variáveis inline |

### `components/pacientes/`
| Arquivo | Usado em | Função |
|---------|----------|--------|
| `PatientSheet.tsx` | `/pacientes` | Sheet criar/editar paciente |
| `PatientsFilter.tsx` | `/pacientes` | Campo de busca por nome/CPF |

### `components/landing-page/`
| Arquivo | Função |
|---------|--------|
| `Navbar.tsx` | Barra de navegação + theme-switcher |
| `Hero.tsx` | Seção principal com CTA |
| `Features.tsx` | Funcionalidades do produto |
| `ProblemSolution.tsx` | Problema × solução |
| `Pricing.tsx` | Tabela de planos |
| `FAQ.tsx` | Perguntas frequentes |
| `FinalCTA.tsx` | CTA de conversão final |
| `Footer.tsx` | Rodapé |

---

## 🗂️ Mapa de Páginas × Componentes

### `/dashboard`
**Função:** painel de métricas do dia — atendimentos, pendentes, concluídos e atalhos rápidos.  
**Redireciona para** `/onboarding` se faltar unidade ou assinatura.

| Componente | Caminho |
|-----------|---------|
| `PageHeader` | `shared/page-header` |
| `PageContainer` | `shared/page-container` |
| `LaudosTable` | `laudos/LaudosTable` |

---

### `/onboarding`
**Função:** checklist guiado — criar unidade, configurar perfil, criar primeiro modelo.

| Componente | Caminho |
|-----------|---------|
| `OnboardingChecklist` | `onboarding/onboarding-checklist` |
| `OnboardingProvider` | `onboarding/onboarding-provider` |
| `OnboardingTracker` | `onboarding/onboarding-tracker` |

---

### `/pacientes`
**Função:** listagem paginada e busca de pacientes (nome/CPF). Criar e editar cadastros.

| Componente | Caminho |
|-----------|---------|
| `PageContainer` | `shared/page-container` |
| `PageHeader` | `shared/page-header` |
| `DataTable` | `shared/data-table` |
| `DataPagination` | `shared/data-pagination` |
| `PatientsFilter` | `pacientes/PatientsFilter` |
| `PatientSheet` | `pacientes/PatientSheet` |
| `ActionButton` | `ui/action-button` |

---

### `/laudos`
**Função:** lista de todos os atendimentos com filtro de status, data e unidade.

| Componente | Caminho |
|-----------|---------|
| `PageContainer` | `shared/page-container` |
| `PageHeader` | `shared/page-header` |
| `DataPagination` | `shared/data-pagination` |
| `DataFilter` | `shared/data-filter` |
| `LaudosTable` | `laudos/LaudosTable` |
| `LaudosUnitSync` | `laudos/LaudosUnitSync` |

---

### `/laudos/novo`
**Função:** formulário para criar novo atendimento — paciente, unidade, data e modelos.

| Componente | Caminho |
|-----------|---------|
| `PageContainer` | `shared/page-container` |
| `PageHeader` | `shared/page-header` |
| `NovoLaudoForm` | `laudos/NovoLaudoForm` |

---

### `/laudos/[requestId]/[itemId]`
**Função:** editor de laudo — variáveis, frases, finalizar e imprimir.

| Componente | Caminho |
|-----------|---------|
| `PageContainer` | `shared/page-container` |
| `LaudoEditor` | `laudos/LaudoEditor` |
| `LaudoRichTextEditor` | `laudos/LaudoRichTextEditor` |
| `LaudoVariablesPanel` | `laudos/LaudoVariablesPanel` |
| `VariableContext` | `laudos/VariableContext` |
| `VariableExtension` | `laudos/extensions/VariableExtension` |

---

### `/(print)/laudos/.../imprimir`
**Função:** layout A4 de impressão (sem sidebar).

---

### `/configuracoes/perfil`
| Componente | Caminho |
|-----------|---------|
| `PageContainer` | `shared/page-container` |
| `PageHeader` | `shared/page-header` |

### `/configuracoes/assinatura`
| Componente | Caminho |
|-----------|---------|
| `PageContainer` | `shared/page-container` |
| `PageHeader` | `shared/page-header` |
| `LaudoRichTextEditor` | `laudos/LaudoRichTextEditor` |

### `/configuracoes/plano`
| Componente | Caminho |
|-----------|---------|
| `PageContainer` | `shared/page-container` |
| `PageHeader` | `shared/page-header` |
| `SubscriptionAlert` | `configuracoes/plano/subscription-alert` |
| `ManageSubscriptionButton` | `configuracoes/plano/manage-subscription-button` |

### `/configuracoes/modelos`
| Componente | Caminho |
|-----------|---------|
| `PageContainer` | `shared/page-container` |
| `PageHeader` | `shared/page-header` |
| `DataTable` | `shared/data-table` |
| `DataPagination` | `shared/data-pagination` |
| `ModelsFilter` | `configuracoes/ModelsFilter` |
| `ModelSheet` | `configuracoes/ModelSheet` |
| `ActionButton` | `ui/action-button` |
| `DeleteConfirmDialog` | `ui/delete-confirm-dialog` |

### `/configuracoes/frases`
| Componente | Caminho |
|-----------|---------|
| `PageContainer` | `shared/page-container` |
| `PageHeader` | `shared/page-header` |
| `DataTable` | `shared/data-table` |
| `PhrasesFilter` | `configuracoes/PhrasesFilter` |
| `PhraseSheet` | `configuracoes/PhraseSheet` |
| `ActionButton` | `ui/action-button` |
| `DeleteConfirmDialog` | `ui/delete-confirm-dialog` |

### `/configuracoes/unidades`
| Componente | Caminho |
|-----------|---------|
| `PageContainer` | `shared/page-container` |
| `PageHeader` | `shared/page-header` |
| `DataTable` | `shared/data-table` |
| `UnitSheet` | `configuracoes/UnitSheet` |
| `ActionButton` | `ui/action-button` |
| `DeleteConfirmDialog` | `ui/delete-confirm-dialog` |

---

### `/admin` (super_admin)
| Componente | Caminho |
|-----------|---------|
| `AdminSidebar` | `admin/admin-sidebar` |
| `AdminProfileDropdown` | `admin/admin-profile-dropdown` |
| `PageHeader` | `shared/page-header` |

### `/admin/usuarios`
| Componente | Caminho |
|-----------|---------|
| `PageHeader` | `shared/page-header` |
| `UserTableClient` | `admin/user-table-client` |
| `RoleSwitcher` | `admin/role-switcher` |
| `UserActiveToggle` | `admin/user-active-toggle` |

### `/admin/planos`
| Componente | Caminho |
|-----------|---------|
| `PageHeader` | `shared/page-header` |
| `PlansTableClient` | `admin/plans-table-client` |
| `ActionButton` | `ui/action-button` |
| `DeleteConfirmDialog` | `ui/delete-confirm-dialog` |

### `/admin/assinaturas`
| Componente | Caminho |
|-----------|---------|
| `PageContainer` | `shared/page-container` |
| `PageHeader` | `shared/page-header` |
| `DataTable` | `shared/data-table` |

### `/admin/feedbacks`
| Componente | Caminho |
|-----------|---------|
| `PageHeader` | `shared/page-header` |
| `FeedbackTableClient` | `admin/feedback-table-client` |
| `FeedbackKanbanClient` | `admin/feedback-kanban-client` |
| `FeedbackKanbanItem` | `admin/feedback-kanban-item` |
| `FeedbackStatusSwitcher` | `admin/feedback-status-switcher` |

---

### Landing Page (`/`)
| Componente | Caminho |
|-----------|---------|
| `Navbar` | `landing-page/Navbar` |
| `Hero` | `landing-page/Hero` |
| `Features` | `landing-page/Features` |
| `ProblemSolution` | `landing-page/ProblemSolution` |
| `Pricing` | `landing-page/Pricing` |
| `FAQ` | `landing-page/FAQ` |
| `FinalCTA` | `landing-page/FinalCTA` |
| `Footer` | `landing-page/Footer` |
| `JsonLd` | `seo/JsonLd` |

---

### Layout `(protected)` — compartilhado em todas as rotas protegidas

| Componente | Caminho |
|-----------|---------|
| `AppSidebar` | `layout/app-sidebar` |
| `UnitSwitcher` | `layout/unit-switcher` |
| `UserProfile` | `layout/user-profile` |
| `ThemeSwitcher` | `layout/theme-switcher` |
| `FeedbackModal` | `layout/feedback-modal` |
| `OnboardingProvider` | `onboarding/onboarding-provider` |
| `OnboardingTracker` | `onboarding/onboarding-tracker` |

---

## 🎨 Design System

### Identidade Visual
- **Paleta primária:** `baltic-blue` (azul profundo) + `teal` / `verdigris` / `mint-leaf`
- **Fundo neutro:** `cream` (modo claro), escala escura no modo dark
- **Cores semânticas CSS vars:** `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--ring`
- **Charts:** 5 cores semânticas (`chart-1` … `chart-5`)
- **Border radius:** `--radius: 0.5rem`
- **Dark mode:** estratégia `class` (`next-themes`)

### Tipografia
- **Font:** `Geist` (Google Fonts via `next/font`)
- **Variável CSS:** `--font-geist-sans`
- **Hierarquia:** `font-bold` para títulos de página, `font-medium` para dados primários de tabela, `text-muted-foreground` para dados secundários

### Componentes Core UI (`components/ui/`)
| Componente | Descrição |
|-----------|-----------|
| `action-button.tsx` | Botão ícone + tooltip para ações em tabelas; `ghost` com muted, cor só no hover |
| `delete-confirm-dialog.tsx` | Dialog de confirmação de exclusão com nome do item |
| `rich-text-editor.tsx` | Editor TipTap base (reexportado em `laudos/LaudoRichTextEditor`) |
| `sheet.tsx` | Drawer lateral para formulários de criação/edição |
| `badge.tsx` | Status chips com variantes (`default`, `secondary`, `outline`, `success`, `destructive`) |

### Componentes Shared (`components/shared/`)
| Componente | Descrição |
|-----------|-----------|
| `data-table.tsx` | Tabela genérica com colunas tipadas (`DataTableColumn<T>`) |
| `data-pagination.tsx` | Paginação via query string (`?page=N`) |
| `data-filter.tsx` | Filtro de status + intervalo de datas |
| `page-header.tsx` | Header de página com título, descrição e slot de ações |
| `page-container.tsx` | Wrapper com padding/max-width consistente |

---

## 🔐 Regras de Segurança

- **Row Level Security (RLS):** todas as tabelas de domínio (`patients`, `exam_requests`, `exam_items`, `exam_templates`, `exam_phrases`, `units`) exigem `auth.uid() = user_id`
- **Server Isolation:** clientes Supabase server (`lib/supabase/server.ts`) usados em Server Components e Server Actions; client-side limitado a componentes interativos
- **Validação:** schemas Zod em `lib/validations.ts` para todas as entidades (unidade, paciente, template, frase, feedback)
- **Admin:** rotas `/admin/*` verificam `profiles.role === "super_admin"` no layout server-side; redireciona para `/dashboard` se não autorizado
- **Assinatura:** `lib/subscription-access.ts` valida status `active` ou `trialing` + `trial_end` antes de liberar rotas protegidas
- **Stripe Webhooks:** `app/api/webhooks/stripe/` processa eventos do Stripe server-side

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript 5 |
| Auth / DB | Supabase (PostgreSQL + RLS + Auth) |
| Estilo | Tailwind CSS 3.4 + tailwindcss-animate |
| Componentes | Radix UI + shadcn/ui |
| Rich Text | TipTap |
| Pagamentos | Stripe |
| Forms | React Hook Form + Zod |
| Drag & Drop | @hello-pangea/dnd |
| Notificações | Sonner |
| Datas | date-fns (pt-BR) |
| Ícones | Lucide React |
| Deploy target | Easypanel / Nixpacks (Node 20+) |
