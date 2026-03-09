import { z } from "zod";

// ============================================================
// UNIT (Unidade de Atendimento)
// ============================================================
export const UnitSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200),
  address: z.string().optional(),
  phone: z.string().optional(),
  logo_url: z.string().url("URL inválida").optional().or(z.literal("")),
  report_header: z.string().optional(),
  report_footer: z.string().optional(),
  active: z.boolean().default(true),
});
export type UnitInput = z.infer<typeof UnitSchema>;

// ============================================================
// PATIENT (Paciente)
// ============================================================
export const PatientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(300),
  birth_date: z.string().min(1, "Data de nascimento é obrigatória"),
  cpf: z
    .string()
    .optional()
    .nullable()
    .transform((v: string | null | undefined) => v?.replace(/\D/g, "") || null),
  gender: z.enum(["M", "F", "O"]).optional().nullable(),
  phone: z.string().optional().nullable(),
  mother_name: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});
export type PatientInput = z.infer<typeof PatientSchema>;

// ============================================================
// EXAM TEMPLATE (Modelo de Exame)
// ============================================================
const TemplateVariableSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  options: z.array(z.string().min(1)).min(1, "Adicione pelo menos uma opção"),
});

export const ExamTemplateSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(300),
  unit_id: z.string().uuid().optional().nullable(),
  technique: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  impression: z.string().optional().nullable(),
  variables: z.array(TemplateVariableSchema).default([]),
  active: z.boolean().default(true),
});
export type ExamTemplateInput = z.infer<typeof ExamTemplateSchema>;

// ============================================================
// EXAM PHRASE (Frase Padrão)
// ============================================================
export const ExamPhraseSchema = z.object({
  category: z.string().min(1, "Categoria é obrigatória"),
  label: z.string().min(1, "Rótulo é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  unit_id: z.string().uuid().optional().nullable(),
});
export type ExamPhraseInput = z.infer<typeof ExamPhraseSchema>;

// ============================================================
// EXAM REQUEST (Atendimento / Novo Laudo)
// ============================================================
export const CreateExamRequestSchema = z.object({
  patient_id: z.string().uuid("Selecione um paciente"),
  unit_id: z.string().uuid("Selecione uma unidade"),
  template_id: z.string().uuid("Selecione um modelo de exame"),
  date: z.string().optional(),
  notes: z.string().optional().nullable(),
});
export type CreateExamRequestInput = z.infer<typeof CreateExamRequestSchema>;

// ============================================================
// EXAM ITEM (Laudo — save/finalize)
// ============================================================
export const SaveExamItemSchema = z.object({
  technique: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  impression: z.string().optional().nullable(),
  variable_selections: z.record(z.string(), z.string()).default({}),
});
export type SaveExamItemInput = z.infer<typeof SaveExamItemSchema>;

// ============================================================
// PROFILE
// ============================================================
export const ProfileSchema = z.object({
  full_name: z.string().min(1, "Nome completo é obrigatório"),
  crm: z.string().optional().nullable(),
  signature: z.string().optional().nullable(),
});
export type ProfileInput = z.infer<typeof ProfileSchema>;
