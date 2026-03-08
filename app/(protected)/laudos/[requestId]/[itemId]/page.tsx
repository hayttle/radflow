import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { LaudoEditor } from "@/components/laudos/LaudoEditor";
import type { ExamFormSnapshot, TemplateVariable } from "@/types/supabase";

interface PageProps {
  params: Promise<{ requestId: string; itemId: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditorPage({ params }: PageProps) {
  const { requestId, itemId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch exam item with template and request context
  const { data: item } = await supabase
    .from("exam_items")
    .select(
      `
      id, status, form_snapshot, updated_at,
      exam_templates ( id, title, technique, description, impression, variables ),
      exam_requests!inner (
        id, status, date, notes,
        patients ( id, name, birth_date, cpf, gender ),
        units ( id, name, report_header, report_footer )
      )
    `
    )
    .eq("id", itemId)
    .eq("request_id", requestId)
    .eq("user_id", user.id)
    .single();

  if (!item) notFound();

  // Fetch phrases for the sidebar
  const { data: phrases } = await supabase
    .from("exam_phrases")
    .select("id, category, label, content")
    .eq("user_id", user.id)
    .order("category")
    .order("label");

  // Fetch profile for signature
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, crm, signature_url")
    .eq("id", user.id)
    .single();

  type TemplateRow = {
    id: string;
    title: string;
    technique: string | null;
    description: string | null;
    impression: string | null;
    variables: unknown;
  };

  type RequestRow = {
    id: string;
    status: string;
    date: string;
    notes: string | null;
    patients: { id: string; name: string; birth_date: string | null; cpf: string | null; gender: string | null } | null;
    units: { id: string; name: string; report_header: string | null; report_footer: string | null } | null;
  };

  const template = (item.exam_templates as unknown) as TemplateRow | null;
  const request = (item.exam_requests as unknown) as RequestRow;

  const snapshot = (item.form_snapshot as ExamFormSnapshot) ?? {
    variable_selections: {},
  };

  return (
    <LaudoEditor
      itemId={itemId}
      requestId={requestId}
      status={item.status}
      snapshot={snapshot}
      template={template}
      variables={(template?.variables as TemplateVariable[]) ?? []}
      patient={request.patients}
      unit={request.units}
      profile={profile}
      phrases={phrases ?? []}
    />
  );
}
