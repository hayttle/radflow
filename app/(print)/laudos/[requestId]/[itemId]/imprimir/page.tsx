import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { format, differenceInYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Patient, Unit, Profile, ExamTemplate, ExamRequest } from "@/types/supabase";
import { PrintButton } from "./PrintButton";

export const metadata = {
  title: "Impressão de Laudo | RadFlow",
};

export default async function PrintLaudoPage({
  params,
}: {
  params: Promise<{ requestId: string; itemId: string }>;
}) {
  const { requestId, itemId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch the exam item and related data
  const { data: item } = await supabase
    .from("exam_items")
    .select(`
      id, form_snapshot, status, completed_at,
      exam_templates ( id, title, technique, description, impression, variables ),
      exam_requests (
        id, date, status, notes,
        patients ( id, name, cpf, birth_date, gender ),
        units ( id, name, report_header, report_footer, logo_url )
      )
    `)
    .eq("id", itemId)
    .eq("request_id", requestId)
    .single();

  if (!item || !item.exam_requests) {
    notFound();
  }

  // Cast intermediate types as Supabase JS inner joins return arrays conceptually (though single due to FK)
  const request = (item.exam_requests as unknown) as ExamRequest & {
    patients: Patient | null;
    units: Unit | null;
  };
  const template = (item.exam_templates as unknown) as (ExamTemplate & { variables: any[] }) | null;
  const patient = request.patients;
  const unit = request.units;

  if (!patient || !unit) {
    notFound();
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, crm, signature")
    .eq("id", user.id)
    .single();

  const snapshot = item.form_snapshot as any;
  const selections = snapshot?.variable_selections || {};
  const variables = template?.variables || [];

  // Helper to replace variable placeholders with actual selected values
  const renderContent = (content: string | null | undefined) => {
    if (!content) return "";

    // 1. Replace Tiptap spans: <span data-variable="name">...</span>
    let processed = content.replace(/<span[^>]*data-variable="([^"]+)"[^>]*>([\s\S]*?)<\/span>/g, (match, varName) => {
      return selections[varName] || variables.find((v: any) => v.name === varName)?.label || `[${varName}]`;
    });

    // 2. Replace raw braces: {{variable_name}}
    processed = processed.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
      const name = varName.trim();
      return selections[name] || variables.find((v: any) => v.name === name)?.label || match;
    });

    // 3. Image Style Consolidation
    // Identifies <img> tags and merges layout properties into a single style attribute.
    processed = processed.replace(/<img([^>]*)>/g, (match: string, attrGroup: string) => {
      // Extract existing attributes
      const attrs: Record<string, string> = {};
      const attrRegex = /([a-z0-9-]+)="([^"]*)"/gi;
      let m;
      while ((m = attrRegex.exec(attrGroup)) !== null) {
        attrs[m[1].toLowerCase()] = m[2];
      }

      const alignment = attrs['data-text-align'] || attrs['align'] || attrs['textalign'];
      let finalAlignment = alignment || 'left';

      // If no explicit alignment, check style margin
      const styleAttr = attrs['style'] || "";
      if (!alignment && styleAttr) {
        if (styleAttr.includes('margin-left: auto') || styleAttr.includes('0 0 0 auto') || styleAttr.includes('0px 0px 0px auto')) finalAlignment = 'right';
        else if (styleAttr.includes('margin: 0 auto') || styleAttr.includes('margin: 0px auto')) finalAlignment = 'center';
      }

      const width = attrs['width'];
      const height = attrs['height'];

      let margin = "0";
      if (finalAlignment === "center") margin = "0 auto";
      else if (finalAlignment === "right") margin = "0 0 0 auto";

      // Build clean consolidated style (NO text-align inside img tag style as per user request)
      let style = `display: block; margin: ${margin};`;
      if (width) style += ` width: ${width.endsWith("%") || width.endsWith("px") ? width : width + "px"};`;
      if (height) style += ` height: ${height.endsWith("%") || height.endsWith("px") ? height : height + "px"};`;

      // Reconstruct tag cleanly
      let newTag = '<img';
      const skip = ['style', 'containerstyle', 'wrapperstyle', 'data-text-align', 'textalign', 'align'];

      for (const [key, val] of Object.entries(attrs)) {
        if (!skip.includes(key)) {
          newTag += ` ${key}="${val}"`;
        }
      }

      newTag += ` data-text-align="${finalAlignment}" align="${finalAlignment}" style="${style}">`;
      return newTag;
    });

    return processed;
  };

  // Calculate age
  const age = patient.birth_date
    ? differenceInYears(new Date(), new Date(patient.birth_date + "T00:00:00"))
    : null;

  return (
    <div className="mx-auto min-h-screen w-full bg-gray-100 print:bg-white text-black p-8 print:p-0 flex flex-col items-center">
      {/* Floating print button for screen only */}
      <div className="fixed top-8 right-8 print:hidden z-50">
        <PrintButton />
      </div>

      <div className="print:block w-full max-w-[210mm] min-h-[297mm] bg-white print:shadow-none shadow-xl mx-auto overflow-hidden flex flex-col break-inside-avoid">
        {/* Header */}
        {unit.report_header ? (
          <div
            className="mb-8 p-8 pb-0 prose prose-sm max-w-none prose-img:mx-auto prose-p:my-0 prose-headings:my-0"
            dangerouslySetInnerHTML={{ __html: unit.report_header }}
          />
        ) : (
          <div className="mb-8 p-8 pb-4 border-b text-center">
            <h1 className="text-2xl font-bold uppercase">{unit.name}</h1>
          </div>
        )}

        {/* Patient Info Block */}
        <div className="mb-8 mx-8 border border-muted-foreground/30 rounded-lg p-4 grid grid-cols-2 gap-x-8 text-sm print:border-black/30">
          <div className="space-y-1">
            <p><span className="text-[#3b82f6] font-medium">Paciente:</span> <span className="text-black">{patient.name}</span></p>
            {patient.birth_date && (
              <p>
                <span className="text-[#3b82f6] font-medium">Data de Nascimento:</span>{" "}
                <span className="text-black">
                  {format(new Date(patient.birth_date + "T00:00:00"), "dd/MM/yyyy")}
                  {age !== null && ` (${age} anos)`}
                </span>
              </p>
            )}
          </div>
          <div className="text-right flex flex-col justify-start">
            <p>
              <span className="text-[#3b82f6] font-medium">Data do Exame:</span>{" "}
              <span className="text-black">{format(new Date(request.date + "T00:00:00"), "dd/MM/yyyy")}</span>
            </p>
          </div>
        </div>

        {/* Content Area - flex-1 fills remaining space, eliminating blank whitespace */}
        <div className="flex-1 mt-1 py-2">
          {/* Exam Title - Centered, Uppercase, above the body */}
          <div className="text-center mb-3">
            <h2 className="text-xl font-bold uppercase underline tracking-tight">
              {template?.title || "EXAME"}
            </h2>
          </div>

          {/* Exam Content */}
          <div className="space-y-8 mx-8 prose prose-sm max-w-none text-black print:text-black prose-p:my-1 prose-headings:my-2">
            {(snapshot?.technique || template?.technique) && (
              <section>
                <h2 className="text-sm font-bold uppercase mb-2 pb-1 border-b print:border-black/10">Técnica</h2>
                <div dangerouslySetInnerHTML={{ __html: renderContent(snapshot?.technique || template?.technique) }} />
              </section>
            )}

            {(snapshot?.description || template?.description) && (
              <section>
                <h2 className="text-sm font-bold uppercase mb-2 pb-1 border-b print:border-black/10">Resultado</h2>
                <div dangerouslySetInnerHTML={{ __html: renderContent(snapshot?.description || template?.description) }} />
              </section>
            )}

            {(snapshot?.impression || template?.impression) && (
              <section className="pt-2">
                <h2 className="text-sm font-bold uppercase mb-2 pb-1 border-b print:border-black/10">Impressão</h2>
                <div dangerouslySetInnerHTML={{ __html: renderContent(snapshot?.impression || template?.impression) }} />
              </section>
            )}
          </div>
        </div>

        {/* Signature + Footer pinned to bottom via mt-auto */}
        <div className="mt-auto">
          {/* Signature */}
          <div className="px-8 pb-4 break-inside-avoid">
            {profile?.signature ? (
              <div
                className="prose prose-sm max-w-none w-full text-black print:text-black prose-img:inline prose-p:my-0"
                dangerouslySetInnerHTML={{ __html: profile.signature }}
              />
            ) : (
              <div className="border-t border-black w-72 pt-2 mt-2">
                <p className="font-semibold">{profile?.full_name || "Médico Responsável"}</p>
                {profile?.crm && <p className="text-sm text-muted-foreground print:text-black">CRM: {profile.crm}</p>}
              </div>
            )}
          </div>

          {/* Footer */}
          {unit.report_footer && (
            <div
              className="px-8 pt-2 pb-6 prose prose-sm max-w-none text-center text-muted-foreground print:text-black prose-img:mx-auto"
              dangerouslySetInnerHTML={{ __html: unit.report_footer }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
