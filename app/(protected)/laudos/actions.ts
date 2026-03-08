"use server";

import { createClient } from "@/lib/supabase/server";
import {
  CreateExamRequestSchema,
  SaveExamItemSchema,
  PatientSchema,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ExamFormSnapshot } from "@/types/supabase";

// ────── HELPERS ──────
async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Não autenticado");
  return { supabase, user };
}

// ────── PATIENTS ──────

/** Search patients by name (for the combobox). Returns at most 10 results. */
export async function searchPatients(query: string) {
  const { supabase, user } = await getAuthUser();
  const { data, error } = await supabase
    .from("patients")
    .select("id, name, cpf, birth_date")
    .eq("user_id", user.id)
    .ilike("name", `%${query}%`)
    .order("name")
    .limit(10);
  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

/** Quick-create a patient inline from the new-laudo form. */
export async function createPatientQuick(name: string) {
  const parsed = PatientSchema.safeParse({ name });
  if (!parsed.success) return { error: "Nome inválido", data: null };

  const { supabase, user } = await getAuthUser();
  const { data, error } = await supabase
    .from("patients")
    .insert({ ...parsed.data, user_id: user.id })
    .select("id, name")
    .single();
  if (error) return { error: error.message, data: null };
  revalidatePath("/pacientes");
  return { data, error: null };
}

// ────── EXAM REQUESTS ──────

/**
 * Creates an exam_request + the first exam_item, then redirects to the editor.
 */
export async function createExamRequest(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = CreateExamRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { supabase, user } = await getAuthUser();

  // 1. Create the exam_request (atendimento)
  const { data: request, error: reqErr } = await supabase
    .from("exam_requests")
    .insert({
      user_id: user.id,
      patient_id: parsed.data.patient_id,
      unit_id: parsed.data.unit_id,
      date: parsed.data.date ?? new Date().toISOString().split("T")[0],
      notes: parsed.data.notes,
      status: "pending",
    })
    .select("id")
    .single();

  if (reqErr || !request) return { error: reqErr?.message ?? "Erro ao criar atendimento" };

  // 2. Create the exam_item (laudo) linked to template
  const { data: item, error: itemErr } = await supabase
    .from("exam_items")
    .insert({
      user_id: user.id,
      request_id: request.id,
      template_id: parsed.data.template_id,
      status: "in_progress",
      form_snapshot: { variable_selections: {} } satisfies ExamFormSnapshot,
    })
    .select("id")
    .single();

  if (itemErr || !item) return { error: itemErr?.message ?? "Erro ao criar laudo" };

  // Update request status to in_progress
  await supabase
    .from("exam_requests")
    .update({ status: "in_progress" })
    .eq("id", request.id);

  revalidatePath("/laudos");
  redirect(`/laudos/${request.id}/${item.id}`);
}

// ────── EXAM ITEMS ──────

/** Auto-save the exam item (draft). */
export async function saveExamItem(
  itemId: string,
  snapshot: Partial<ExamFormSnapshot>
) {
  const parsed = SaveExamItemSchema.safeParse(snapshot);
  if (!parsed.success) return { error: "Dados inválidos" };

  const { supabase, user } = await getAuthUser();

  const formSnapshot: ExamFormSnapshot = {
    technique: parsed.data.technique ?? undefined,
    description: parsed.data.description ?? undefined,
    impression: parsed.data.impression ?? undefined,
    variable_selections: parsed.data.variable_selections,
  };

  const { error } = await supabase
    .from("exam_items")
    .update({ form_snapshot: formSnapshot as unknown as Record<string, unknown>, status: "in_progress" })
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error saving exam item:", error);
    return { error: error.message };
  }

  // Mirror the report snapshot to exam_reports table
  try {
    await upsertExamReport(itemId, formSnapshot);
  } catch (err) {
    console.error("Error mirroring report:", err);
  }

  return { success: true };
}


/** Finalize the exam item, mark as completed. */
export async function finalizeExamItem(itemId: string, requestId: string) {
  const { supabase, user } = await getAuthUser();

  const { error: itemErr } = await supabase
    .from("exam_items")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (itemErr) return { error: itemErr.message };

  // Mirror the report snapshot to exam_reports table
  try {
    await upsertExamReport(itemId);
  } catch (err) {
    console.error("Error mirroring report:", err);
  }

  // Check if all items in the request are completed
  const { data: allItems } = await supabase
    .from("exam_items")
    .select("status")
    .eq("request_id", requestId)
    .eq("user_id", user.id);

  const allDone = allItems?.every((i) => i.status === "completed");
  if (allDone) {
    await supabase
      .from("exam_requests")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", requestId)
      .eq("user_id", user.id);
  }

  revalidatePath(`/laudos/${requestId}/${itemId}`);
  revalidatePath("/laudos");
  return { success: true };
}

// ────── REPORT MIRROR (SNAPSHOT) ──────

/**
 * Generates the full HTML body for the report from a snapshot.
 * Falls back to template values if snapshot sections are missing or empty.
 */
function generateReportHTML(snapshot: ExamFormSnapshot, template?: { technique?: string | null, description?: string | null, impression?: string | null }) {
  const sections: string[] = [];

  const technique = snapshot.technique || template?.technique;
  const description = snapshot.description || template?.description;
  const impression = snapshot.impression || template?.impression;

  if (technique) {
    sections.push(`<section><h3>Técnica</h3><div>${technique}</div></section>`);
  }
  if (description) {
    sections.push(`<section><h3>Resultado</h3><div>${description}</div></section>`);
  }
  if (impression) {
    sections.push(`<section><h3>Impressão</h3><div>${impression}</div></section>`);
  }

  return sections.join("\n\n");
}

/**
 * Creates/Updates a standalone snapshot of the report in the exam_reports table.
 * This mirror is used for future consultations independent of template changes.
 */
async function upsertExamReport(itemId: string, providedSnapshot?: ExamFormSnapshot) {
  const { supabase, user } = await getAuthUser();

  // 1. Fetch full context for the snapshot
  const { data: item } = await supabase
    .from("exam_items")
    .select(`
      form_snapshot,
      exam_templates ( title, technique, description, impression ),
      exam_requests (
        patient_id,
        unit_id
      )
    `)
    .eq("id", itemId)
    .eq("user_id", user.id)
    .single();

  if (!item || !item.exam_requests) return;

  const snapshot = providedSnapshot || (item.form_snapshot as unknown as ExamFormSnapshot);
  const template = item.exam_templates as any;
  const request = item.exam_requests as any;

  // Render content with template defaults if snapshot is missing sections
  const content = generateReportHTML(snapshot, template);
  const title = template?.title || "LAUDO";

  // 2. Upsert the mirror record
  await supabase
    .from("exam_reports")
    .upsert({
      exam_item_id: itemId,
      user_id: user.id,
      patient_id: request.patient_id,
      unit_id: request.unit_id,
      title: title,
      content: content,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "exam_item_id"
    });
}

