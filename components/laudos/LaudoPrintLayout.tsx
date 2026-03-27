"use client";

import { ReactNode } from "react";
import { renderPrintHtml } from "./render-print-html";

export interface LaudoLayoutUnit {
  name: string
  report_header: string | null
  report_footer: string | null
}

export interface LaudoLayoutProfile {
  full_name: string | null
  crm: string | null
  signature: string | null
}

export interface LaudoLayoutPatient {
  name: string
  /** Ex: "15/06/1985 (40 anos)" — formatação feita pelo chamador */
  birthDateFormatted?: string
  /** Ex: "27/03/2026" */
  examDateFormatted: string
}

interface LaudoPrintLayoutProps {
  unit: LaudoLayoutUnit
  profile: LaudoLayoutProfile | null
  patient: LaudoLayoutPatient
  /** Corpo do laudo: seções Técnica / Resultado / Impressão (ou conteúdo de exemplo) */
  content: ReactNode
  variableSelections?: Record<string, string>
  templateVariables?: {name: string; label: string}[]
}

/**
 * Layout de impressão padrão do laudo — fonte única de verdade para:
 *   - Cabeçalho (report_header ou fallback nome da unidade)
 *   - Dados do paciente
 *   - Rodapé (report_footer)
 *   - Assinatura do médico
 *
 * Usa tabela nativa para que thead e tfoot repitam em cada página impressa.
 * Margens controladas por `p-[20mm]` — reflete fielmente o preview e a impressão.
 */
export function LaudoPrintLayout({
  unit,
  profile,
  patient,
  content,
  variableSelections = {},
  templateVariables = []
}: LaudoPrintLayoutProps) {
  const renderHtml = (html: string | null | undefined) => renderPrintHtml(html, {variableSelections, templateVariables})

  const header = unit.report_header ? (
    <div
      className="report-body max-w-none prose-p:my-0 prose-headings:my-0 flow-root clear-both"
      dangerouslySetInnerHTML={{__html: renderHtml(unit.report_header)}}
    />
  ) : (
    <div className="mb-4 pt-4 px-8 pb-4 border-b text-center">
      <h1 className="text-2xl font-bold uppercase">{unit.name}</h1>
    </div>
  )

  const patientInfo = (
    <div className="mt-4 grid grid-cols-2 gap-x-8 text-[14px] clear-both">
      <div className="space-y-1">
        <p>
          <span className="text-[#3b82f6] font-medium">Paciente:</span>{" "}
          <span className="text-black">{patient.name}</span>
        </p>
        {patient.birthDateFormatted && (
          <p>
            <span className="text-[#3b82f6] font-medium">Data de Nascimento:</span>{" "}
            <span className="text-black">{patient.birthDateFormatted}</span>
          </p>
        )}
      </div>
      <div className="text-right flex flex-col justify-start">
        <p>
          <span className="text-[#3b82f6] font-medium">Data do Exame:</span>{" "}
          <span className="text-black">{patient.examDateFormatted}</span>
        </p>
      </div>
    </div>
  )

  const signature = (
    <div className="pb-4">
      {profile?.signature ? (
        <div
          className="prose prose-sm max-w-none w-full text-black print:text-black prose-p:my-0 flow-root clear-both"
          dangerouslySetInnerHTML={{__html: renderHtml(profile.signature)}}
        />
      ) : (
        <div className="border-t border-black w-72 pt-2 mt-2">
          <p className="font-semibold">{profile?.full_name || "Médico Responsável"}</p>
          {profile?.crm && <p className="text-sm text-muted-foreground print:text-black">CRM: {profile.crm}</p>}
        </div>
      )}
    </div>
  )

  const footer = unit.report_footer ? (
    <div
      className="pt-2 report-body max-w-none text-center text-muted-foreground print:text-black flow-root clear-both"
      dangerouslySetInnerHTML={{__html: renderHtml(unit.report_footer)}}
    />
  ) : (
    <div />
  )

  return (
    <div
      className="w-full max-w-[210mm] mx-auto bg-white text-black p-[10mm] shadow-lg print:shadow-none flex flex-col"
      style={{ minHeight: "297mm" }}
    >
      {/* Cabeçalho */}
      {header}

      {/* Corpo — flex-1 empurra assinatura+rodapé para o fundo */}
      <div className="flex-1">
        {patientInfo}
        <div className="mt-4">{content}</div>
      </div>

      {/* Assinatura + Rodapé — sempre fixos no fundo da folha */}
      <div className="mt-8">
        <div className="break-inside-avoid">{signature}</div>
        {unit.report_footer && (
          <div className="pt-2">{footer}</div>
        )}
      </div>
    </div>
  )
}
