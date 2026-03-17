import {createClient} from "@/lib/supabase/server"
import {notFound, redirect} from "next/navigation"
import {format, differenceInYears} from "date-fns"
import type {Patient, Unit, ExamTemplate, ExamRequest, ExamFormSnapshot, TemplateVariable} from "@/types/supabase"
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

  // Fetch the exam item and related data
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

  if (!item || !item.exam_requests) {
    notFound()
  }

  // Cast intermediate types as Supabase JS inner joins return arrays conceptually (though single due to FK)
  const request = item.exam_requests as unknown as ExamRequest & {
    patients: Patient | null
    units: Unit | null
  }
  const template = item.exam_templates as unknown as (ExamTemplate & { variables: TemplateVariable[] }) | null
  const patient = request.patients
  const unit = request.units

  if (!patient || !unit) {
    notFound()
  }

  const {data: profile} = await supabase.from("profiles").select("full_name, crm, signature").eq("id", user.id).single()

  const snapshot = item.form_snapshot as ExamFormSnapshot | null
  const selections = snapshot?.variable_selections || {}
  const variables = template?.variables || []

  // Helper to replace variable placeholders with actual selected values
  const renderContent = (content: string | null | undefined) => {
    if (!content) return ""

    // 1. Replace Tiptap spans: <span data-variable="name">...</span>
    let processed = content.replace(/<span[^>]*data-variable="([^"]+)"[^>]*>([\s\S]*?)<\/span>/g, (match, varName) => {
      return selections[varName] || variables.find((v: TemplateVariable) => v.name === varName)?.label || `[${varName}]`
    })

    // 2. Replace raw braces: {{variable_name}}
    processed = processed.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
      const name = varName.trim()
      return selections[name] || variables.find((v: TemplateVariable) => v.name === name)?.label || match
    })

    // 3. Image Style Consolidation
    // Identifies <img> tags and merges layout properties into a single style attribute.
    processed = processed.replace(/<img([^>]*)>/g, (match: string, attrGroup: string) => {
      // Extract existing attributes
      const attrs: Record<string, string> = {}
      const attrRegex = /([a-z0-9-]+)="([^"]*)"/gi
      let m
      while ((m = attrRegex.exec(attrGroup)) !== null) {
        attrs[m[1].toLowerCase()] = m[2]
      }

      const alignment = attrs["data-text-align"] || attrs["align"] || attrs["textalign"]
      let finalAlignment = alignment || ""

      // If no explicit alignment, check style margin
      const styleAttr = attrs["style"] || ""
      if (!alignment && styleAttr) {
        if (
          styleAttr.includes("margin-left: auto") ||
          styleAttr.includes("0 0 0 auto") ||
          styleAttr.includes("0px 0px 0px auto")
        )
          finalAlignment = "right"
        else if (styleAttr.includes("margin: 0 auto") || styleAttr.includes("margin: 0px auto"))
          finalAlignment = "center"
      }

      const width = attrs["width"]
      const height = attrs["height"]

      let style = ""
      if (finalAlignment === "center") {
        style += "display: block; margin: 0 auto;"
      } else if (finalAlignment === "right") {
        style += "display: block; margin: 0 0 0 auto;"
      } else if (finalAlignment === "left") {
        style += "display: block; margin: 0 auto 0 0;"
      }

      if (width) style += ` width: ${width.endsWith("%") || width.endsWith("px") ? width : width + "px"};`
      if (height) style += ` height: ${height.endsWith("%") || height.endsWith("px") ? height : height + "px"};`

      // Reconstruct tag cleanly
      let newTag = "<img"
      const skip = ["style", "containerstyle", "wrapperstyle", "data-text-align", "textalign", "align"]

      for (const [key, val] of Object.entries(attrs)) {
        if (!skip.includes(key)) {
          newTag += ` ${key}="${val}"`
        }
      }

      newTag += ` data-text-align="${finalAlignment}" align="${finalAlignment}" style="${style}">`
      return newTag
    })

    return processed
  }

  // Calculate age
  const age = patient.birth_date ? differenceInYears(new Date(), new Date(patient.birth_date + "T00:00:00")) : null

  return (
    <>
      <style type="text/css">
        {`
          @page {
            size: A4 portrait;
            margin: 10mm; /* top right bottom left - iguais */
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
        {/* Floating print button for screen only */}
        <div className="fixed top-4 right-4 md:top-8 md:right-8 print:hidden z-50">
          <PrintButton />
        </div>

        <PrintLayoutManager
          header={
            unit.report_header ? (
              <div
                className="mb-4 pt-4 pb-0 report-body max-w-none prose-p:my-0 prose-headings:my-0 flow-root clear-both"
                dangerouslySetInnerHTML={{__html: renderContent(unit.report_header)}}
              />
            ) : (
              <div className="mb-4 pt-4 px-8 pb-4 border-b text-center">
                <h1 className="text-2xl font-bold uppercase">{unit.name}</h1>
              </div>
            )
          }
          patientInfo={
            <div className="mt-4 grid grid-cols-2 gap-x-8 text-[14px] clear-both">
              <div className="space-y-1">
                <p>
                  <span className="text-[#3b82f6] font-medium">Paciente:</span>{" "}
                  <span className="text-black">{patient.name}</span>
                </p>
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
          }
          content={
            <>
              <div className="text-center mb-3">
                <h2 className="text-l font-bold uppercase tracking-tight">{template?.title || "EXAME"}</h2>
              </div>
              <div className="space-y-6 report-body max-w-none text-black">
                {(snapshot?.technique || template?.technique) && (
                  <section>
                    <h2 className="text-sm font-bold uppercase mb-2 pb-1 border-b border-black/10 print:border-black/10">Técnica</h2>
                    <div
                      dangerouslySetInnerHTML={{__html: renderContent(snapshot?.technique || template?.technique)}}
                    />
                  </section>
                )}
                {(snapshot?.description || template?.description) && (
                  <section>
                    <h2 className="text-sm font-bold uppercase mb-2 pb-1 border-b border-black/10 print:border-black/10">Resultado</h2>
                    <div
                      dangerouslySetInnerHTML={{__html: renderContent(snapshot?.description || template?.description)}}
                    />
                  </section>
                )}
                {(snapshot?.impression || template?.impression) && (
                  <section className="pt-2">
                    <h2 className="text-sm font-bold uppercase mb-2 pb-1 border-b border-black/10 print:border-black/10">Impressão</h2>
                    <div
                      dangerouslySetInnerHTML={{__html: renderContent(snapshot?.impression || template?.impression)}}
                    />
                  </section>
                )}
              </div>
            </>
          }
          signature={
            <div className="pb-4">
              {profile?.signature ? (
                <div
                  className="prose prose-sm max-w-none w-full text-black print:text-black prose-p:my-0 flow-root clear-both"
                  dangerouslySetInnerHTML={{__html: renderContent(profile.signature)}}
                />
              ) : (
                <div className="border-t border-black w-72 pt-2 mt-2">
                  <p className="font-semibold">{profile?.full_name || "Médico Responsável"}</p>
                  {profile?.crm && <p className="text-sm text-muted-foreground print:text-black">CRM: {profile.crm}</p>}
                </div>
              )}
            </div>
          }
          footer={
            unit.report_footer ? (
              <div
                className="pt-6 pb-8 print:pb-4 report-body max-w-none text-center text-muted-foreground print:text-black flow-root clear-both"
                dangerouslySetInnerHTML={{__html: renderContent(unit.report_footer)}}
              />
            ) : (
              <div />
            ) // Return empty block if no footer to satisfy ReactNode
          }
        />
      </div>
    </>
  )
}
