import {createClient} from "@/lib/supabase/server"
import {notFound, redirect} from "next/navigation"
import {format, differenceInYears} from "date-fns"
import type {Patient, Unit, ExamTemplate, ExamRequest, ExamFormSnapshot, TemplateVariable} from "@/types/supabase"
import { renderPrintHtml } from "@/components/laudos/render-print-html"
import {PrintButton} from "./PrintButton"
import {PrintLayoutManager} from "./PrintLayoutManager"

export const metadata = {
  title: "Impressão de Laudo | RadFlow"
}

export default async function PrintLaudoPage({params}: {params: Promise<{requestId: string; itemId: string}>}) {
  const {requestId, itemId} = await params
  const supabase = await createClient()
  const {
    data: {user}
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const {data: item} = await supabase
    .from("exam_items")
    .select(
      `
      id, form_snapshot, status, completed_at,
      exam_templates ( id, title, technique, description, impression, variables ),
      exam_requests (
        id, date, status, notes,
        patients ( id, name, cpf, birth_date, gender ),
        units ( id, name, report_header, report_footer, logo_url )
      )
    `
    )
    .eq("id", itemId)
    .eq("request_id", requestId)
    .single()

  if (!item || !item.exam_requests) notFound()

  const request = item.exam_requests as unknown as ExamRequest & {
    patients: Patient | null
    units: Unit | null
  }
  const template = item.exam_templates as unknown as (ExamTemplate & {variables: TemplateVariable[]}) | null
  const patient = request.patients
  const unit = request.units

  if (!patient || !unit) notFound()

  const {data: profile} = await supabase
    .from("profiles")
    .select("full_name, crm, signature")
    .eq("id", user.id)
    .single()

  const snapshot = item.form_snapshot as ExamFormSnapshot | null
  const selections = snapshot?.variable_selections || {}
  const variables = template?.variables || []

  const renderContent = (html: string | null | undefined) =>
    renderPrintHtml(html, {variableSelections: selections, templateVariables: variables})

  const age = patient.birth_date
    ? differenceInYears(new Date(), new Date(patient.birth_date + "T00:00:00"))
    : null

  const patientData = {
    name: patient.name,
    birthDateFormatted: patient.birth_date
      ? `${format(new Date(patient.birth_date + "T00:00:00"), "dd/MM/yyyy")}${age !== null ? ` (${age} anos)` : ""}`
      : undefined,
    examDateFormatted: format(new Date(request.date + "T00:00:00"), "dd/MM/yyyy"),
  }

  const laudoContent = (
    <>
      <div className="text-center mb-3">
        <h2 className="text-l font-bold uppercase tracking-tight">{template?.title || "EXAME"}</h2>
      </div>
      <div className="space-y-6 report-body max-w-none text-black">
        {(snapshot?.technique || template?.technique) && (
          <section>
            <h2 className="text-sm font-bold uppercase mb-2 pb-1 border-b border-black/10 print:border-black/10">Técnica</h2>
            <div dangerouslySetInnerHTML={{__html: renderContent(snapshot?.technique || template?.technique)}} />
          </section>
        )}
        {(snapshot?.description || template?.description) && (
          <section>
            <h2 className="text-sm font-bold uppercase mb-2 pb-1 border-b border-black/10 print:border-black/10">Resultado</h2>
            <div dangerouslySetInnerHTML={{__html: renderContent(snapshot?.description || template?.description)}} />
          </section>
        )}
        {(snapshot?.impression || template?.impression) && (
          <section className="pt-2">
            <h2 className="text-sm font-bold uppercase mb-2 pb-1 border-b border-black/10 print:border-black/10">Impressão</h2>
            <div dangerouslySetInnerHTML={{__html: renderContent(snapshot?.impression || template?.impression)}} />
          </section>
        )}
      </div>
    </>
  )

  return (
    <>
      <style type="text/css">
        {`
          @page {
            size: A4 portrait;
            margin: 0; /* margens controladas pelo componente LaudoPrintLayout */
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact;
            background: white !important;
          }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          .report-body, .report-body * { font-size: 14px !important; line-height: 1.5; }
          .report-body p { margin-bottom: 0.5rem; }
          .report-body h2 { font-weight: bold; text-transform: uppercase; margin-top: 1rem; margin-bottom: 0.25rem; }
          .report-body section { margin-bottom: 1.5rem; }
        `}
      </style>
      <div className="mx-auto min-h-screen print:min-h-0 w-full bg-gray-100 print:bg-white text-black p-4 md:p-8 print:p-0">
        <div className="fixed top-4 right-4 md:top-8 md:right-8 print:hidden z-50">
          <PrintButton />
        </div>
        <PrintLayoutManager
          unit={unit}
          profile={profile ?? null}
          patient={patientData}
          content={laudoContent}
          variableSelections={selections}
          templateVariables={variables}
        />
      </div>
    </>
  )
}
