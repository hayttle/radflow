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

## 🗂️ Mapa de Páginas × Componentes

### `/dashboard`
**Função:** painel de métricas do dia — atendimentos, pendentes, concluídos e atalhos rápidos.  
**Redireciona para** `/onboarding` se faltar unidade ou assinatura.

| Componente | Papel |
|-----------|-------|
| `page-header.tsx` | Título e ações da página |
| `data-table.tsx` | Últimos atendimentos |
| `LaudosTable.tsx` | Tabela de atendimentos recentes |

---

### `/onboarding`
**Função:** checklist guiado — criar unidade, configurar perfil, criar primeiro modelo.

| Componente | Papel |
|-----------|-------|
| `onboarding-checklist.tsx` | Passos e progresso |
| `onboarding/onboarding-provider.tsx` | Estado global do onboarding |
| `onboarding/onboarding-tracker.tsx` | Barra de progresso no layout |

---

### `/pacientes`
**Função:** listagem paginada e busca de pacientes (nome/CPF). Criar e editar cadastros.

| Componente | Papel |
|-----------|-------|
| `pacientes/PatientsFilter.tsx` | Campo de busca |
| `pacientes/PatientSheet.tsx` | Sheet criar/editar paciente |
| `data-table.tsx` | Tabela de pacientes |
| `data-pagination.tsx` | Paginação |
| `ui/action-button.tsx` | Botão de ação (Editar) na linha da tabela |
| `page-header.tsx` | Título + botão "Novo Paciente" |

---

### `/laudos`
**Função:** lista de todos os atendimentos/laudos com filtro de status, data e unidade.

| Componente | Papel |
|-----------|-------|
| `laudos/LaudosTable.tsx` | Tabela com ações (abrir, imprimir) |
| `laudos/LaudosUnitSync.tsx` | Sincroniza unidade ativa com o filtro |
| `data-filter.tsx` | Filtro status + intervalo de datas |
| `data-pagination.tsx` | Paginação |
| `ui/action-button.tsx` | Ações (Imprimir) na tabela |
| `ui/badge.tsx` | Badge de status do atendimento |
| `page-header.tsx` | Título + botão "Novo Atendimento" |

---

### `/laudos/novo`
**Função:** formulário para criar novo atendimento — selecionar paciente, unidade, data e modelos.

| Componente | Papel |
|-----------|-------|
| `laudos/NovoLaudoForm.tsx` | Formulário completo de criação |
| `ui/select.tsx` | Seleção de paciente, unidade e modelo |
| `ui/input.tsx` | Data e campos livres |

---

### `/laudos/[requestId]/[itemId]`
**Função:** editor de laudo — preencher campos, inserir variáveis e frases, finalizar e imprimir.

| Componente | Papel |
|-----------|-------|
| `laudos/LaudoEditor.tsx` | Shell principal: status, seções, salvar/finalizar |
| `laudos/LaudoRichTextEditor.tsx` | Editor TipTap com toolbars |
| `laudos/LaudoVariablesPanel.tsx` | Painel lateral de variáveis do template |
| `laudos/VariableContext.tsx` | Context das variáveis no editor |
| `laudos/extensions/VariableExtension.tsx` | Nó TipTap para variáveis inline |
| `ui/badge.tsx` | Status do laudo |
| `ui/button.tsx` | Ações de salvar, finalizar, imprimir |

---

### `/(print)/laudos/[requestId]/[itemId]/imprimir`
**Função:** layout A4 de impressão do laudo finalizado.

| Componente | Papel |
|-----------|-------|
| *(layout próprio sem sidebar)* | Renderiza HTML do laudo formatado para A4 |

---

### `/configuracoes/perfil`
**Função:** editar dados do perfil (nome, CRM).

| Componente | Papel |
|-----------|-------|
| `ui/input.tsx`, `ui/button.tsx` | Formulário de perfil |
| `page-header.tsx` | Título da seção |

---

### `/configuracoes/assinatura`
**Função:** upload e configuração da assinatura digital para inserção nos laudos.

| Componente | Papel |
|-----------|-------|
| `laudos/LaudoRichTextEditor.tsx` | Editor da assinatura |
| `ui/button.tsx` | Salvar |

---

### `/configuracoes/plano`
**Função:** visualização do plano atual, datas e gerenciamento via Stripe.

| Componente | Papel |
|-----------|-------|
| `configuracoes/plano/subscription-alert.tsx` | Alerta de trial/expiração |
| `configuracoes/plano/manage-subscription-button.tsx` | Abre portal Stripe |
| `ui/card.tsx` | Card de resumo do plano |
| `page-header.tsx` | Título da seção |

---

### `/configuracoes/modelos`
**Função:** CRUD de templates de exame com variáveis dinâmicas.

| Componente | Papel |
|-----------|-------|
| `configuracoes/ModelsFilter.tsx` | Busca e filtro por unidade |
| `configuracoes/ModelSheet.tsx` | Sheet criar/editar modelo |
| `data-table.tsx` | Tabela de modelos |
| `data-pagination.tsx` | Paginação |
| `ui/action-button.tsx` | Ações (Editar, Duplicar, Excluir) |
| `ui/delete-confirm-dialog.tsx` | Confirmação de exclusão |
| `page-header.tsx` | Título + botão "Novo Modelo" |

---

### `/configuracoes/frases`
**Função:** biblioteca de frases/autotexto por categoria para uso no editor de laudos.

| Componente | Papel |
|-----------|-------|
| `configuracoes/PhrasesFilter.tsx` | Filtro por categoria |
| `configuracoes/PhraseSheet.tsx` | Sheet criar/editar frase |
| `data-table.tsx` | Tabela de frases |
| `ui/action-button.tsx` | Ações (Editar, Excluir) |
| `ui/delete-confirm-dialog.tsx` | Confirmação de exclusão |
| `page-header.tsx` | Título + botão "Nova Frase" |

---

### `/configuracoes/unidades`
**Função:** gestão de unidades de atendimento (clínicas) — dados, cabeçalho e rodapé de laudo.

| Componente | Papel |
|-----------|-------|
| `configuracoes/UnitSheet.tsx` | Sheet criar/editar unidade |
| `data-table.tsx` | Tabela de unidades |
| `ui/action-button.tsx` | Ações (Editar, Excluir) |
| `ui/delete-confirm-dialog.tsx` | Confirmação de exclusão |
| `page-header.tsx` | Título + botão "Nova Unidade" |

---

### `/admin` (super_admin)
**Função:** painel administrativo — métricas globais, links rápidos.

| Componente | Papel |
|-----------|-------|
| `admin-sidebar.tsx` | Navegação admin |
| `admin-profile-dropdown.tsx` | Menu do usuário admin |
| `page-header.tsx` | Título |

---

### `/admin/usuarios`
**Função:** listagem e gerenciamento de todos os usuários da plataforma.

| Componente | Papel |
|-----------|-------|
| `user-table-client.tsx` | Tabela de usuários |
| `role-switcher.tsx` | Altera role do usuário |
| `user-active-toggle.tsx` | Ativa/desativa conta |

---

### `/admin/planos`
**Função:** CRUD de planos e preços Stripe.

| Componente | Papel |
|-----------|-------|
| `plans-table-client.tsx` | Tabela + diálogo de criação/edição de planos |
| `ui/action-button.tsx` | Ações (Editar, Excluir) |
| `ui/delete-confirm-dialog.tsx` | Confirmação de exclusão |

---

### `/admin/assinaturas`
**Função:** visão de todas as assinaturas ativas, trial e canceladas.

| Componente | Papel |
|-----------|-------|
| `data-table.tsx` | Tabela de assinaturas |
| `ui/badge.tsx` | Status da assinatura |

---

### `/admin/feedbacks`
**Função:** triagem e gestão de feedbacks enviados pelos usuários (lista + kanban).

| Componente | Papel |
|-----------|-------|
| `feedback-table-client.tsx` | Tabela de feedbacks |
| `feedback-kanban-client.tsx` | Kanban drag-and-drop |
| `feedback-kanban-item.tsx` | Card do kanban |
| `feedback-status-switcher.tsx` | Altera status do feedback |
| `ui/tabs.tsx` | Alternar entre lista e kanban |

---

### Landing Page (`/`)
**Função:** página de marketing e conversão.

| Componente | Papel |
|-----------|-------|
| `landing-page/Navbar.tsx` | Barra de navegação + toggle de tema |
| `landing-page/Hero.tsx` | Seção principal com CTA |
| `landing-page/Features.tsx` | Funcionalidades do produto |
| `landing-page/ProblemSolution.tsx` | Problema × solução |
| `landing-page/Pricing.tsx` | Tabela de planos |
| `landing-page/FAQ.tsx` | Perguntas frequentes |
| `landing-page/FinalCTA.tsx` | CTA final |
| `landing-page/Footer.tsx` | Rodapé |
| `seo/JsonLd.tsx` | Structured data para SEO |

---

### Layout `(protected)` — compartilhado em todas as rotas protegidas

| Componente | Papel |
|-----------|-------|
| `app-sidebar.tsx` | Navegação lateral + feedback modal |
| `unit-switcher.tsx` | Seleção de unidade ativa (cookie + context) |
| `user-profile.tsx` | Avatar e dropdown do usuário |
| `feedback-modal.tsx` | Modal de envio de feedback |
| `onboarding/onboarding-provider.tsx` | Estado global do onboarding |
| `onboarding/onboarding-tracker.tsx` | Indicador de progresso no header |

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
| `data-table.tsx` | Tabela genérica com colunas tipadas (`DataTableColumn<T>`) |
| `delete-confirm-dialog.tsx` | Dialog de confirmação de exclusão com nome do item |
| `page-header.tsx` | Header de página com título, descrição e slot de ações |
| `data-pagination.tsx` | Paginação via query string |
| `rich-text-editor.tsx` | Editor TipTap base (reexportado em `LaudoRichTextEditor`) |
| `sheet.tsx` | Drawer lateral para formulários de criação/edição |
| `badge.tsx` | Status chips com variantes (`default`, `secondary`, `outline`, `success`, `destructive`) |

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
