import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
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
      exam_templates ( id, title, description ),
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
  const template = (item.exam_templates as unknown) as ExamTemplate | null;
  const patient = request.patients;
  const unit = request.units;
  
  if (!patient || !unit) {
    notFound();
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, crm, signature_url")
    .eq("id", user.id)
    .single();

  const snapshot = item.form_snapshot as any;

  // Render the page
  return (
    <div className="mx-auto min-h-screen w-full bg-gray-100 print:bg-white text-black p-8 print:p-0 flex flex-col items-center">
      {/* Floating print button for screen only */}
      <div className="fixed top-8 right-8 print:hidden z-50">
        <PrintButton />
      </div>

      <div className="print:block w-full max-w-[210mm] min-h-[297mm] bg-white print:shadow-none shadow-xl mx-auto overflow-hidden relative break-inside-avoid">
        {/* Header */}
        {unit.report_header ? (
          <div 
            className="mb-8 p-8 pb-0 prose prose-sm max-w-none prose-img:mx-auto" 
            dangerouslySetInnerHTML={{ __html: unit.report_header }} 
          />
        ) : (
          <div className="mb-8 p-8 pb-4 border-b text-center">
            <h1 className="text-2xl font-bold uppercase">{unit.name}</h1>
          </div>
        )}

        {/* Patient Info Block */}
        <div className="mb-8 mx-8 border border-muted-foreground/30 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm print:border-black/30">
          <div>
            <p><span className="font-semibold text-muted-foreground print:text-black">Paciente:</span> {patient.name}</p>
            {patient.cpf && <p><span className="font-semibold text-muted-foreground print:text-black">CPF:</span> {patient.cpf}</p>}
            {patient.birth_date && (
              <p>
                <span className="font-semibold text-muted-foreground print:text-black">Data de Nascimento:</span>{" "}
                {format(new Date(patient.birth_date + "T00:00:00"), "dd/MM/yyyy")}
              </p>
            )}
          </div>
          <div className="text-right">
            <p><span className="font-semibold text-muted-foreground print:text-black">Data do Exame:</span> {format(new Date(request.date + "T00:00:00"), "dd/MM/yyyy")}</p>
            <p><span className="font-semibold text-muted-foreground print:text-black">Exame:</span> {template?.title || "Laudo Não Especificado"}</p>
          </div>
        </div>

        {/* Exam Content */}
        <div className="space-y-6 mx-8 prose prose-sm max-w-none text-black print:text-black mt-12">
          {snapshot?.technique && (
            <section>
              <h2 className="text-sm font-bold uppercase mb-2 border-b border-muted-foreground/20 print:border-black/20 pb-1">Técnica</h2>
              <div dangerouslySetInnerHTML={{ __html: snapshot.technique }} />
            </section>
          )}

          {snapshot?.description && (
            <section>
              <h2 className="text-sm font-bold uppercase mb-2 border-b border-muted-foreground/20 print:border-black/20 pb-1">Descrição</h2>
              <div dangerouslySetInnerHTML={{ __html: snapshot.description }} />
            </section>
          )}

          {snapshot?.impression && (
            <section className="pt-2">
              <h2 className="text-sm font-bold uppercase mb-2 border-b border-muted-foreground/20 print:border-black/20 pb-1">Impressão</h2>
              <div dangerouslySetInnerHTML={{ __html: snapshot.impression }} />
            </section>
          )}
        </div>

        {/* Signature */}
        <div className="mt-32 mb-16 flex flex-col items-center text-center mx-8 break-inside-avoid">
          {profile?.signature_url ? (
            <div className="h-24 w-64 mb-2 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={profile.signature_url} 
                alt="Assinatura" 
                className="max-h-full max-w-full object-contain mix-blend-multiply" 
              />
            </div>
          ) : (
            <div className="h-24 w-64 mb-2 flex items-center justify-center opacity-0">.</div>
          )}
          <div className="border-t border-black w-72 pt-2 mt-2">
            <p className="font-semibold">{profile?.full_name || "Médico Responsável"}</p>
            {profile?.crm && <p className="text-sm text-muted-foreground print:text-black">CRM: {profile.crm}</p>}
          </div>
        </div>

        {/* Footer */}
        {unit.report_footer && (
          <div 
            className="mt-16 mx-8 pt-4 pb-8 prose prose-sm max-w-none text-center text-muted-foreground print:text-black prose-img:mx-auto absolute bottom-0 left-0 right-0 border-t border-muted-foreground/20 print:border-black/20" 
            dangerouslySetInnerHTML={{ __html: unit.report_footer }} 
          />
        )}
      </div>
    </div>
  );
}
