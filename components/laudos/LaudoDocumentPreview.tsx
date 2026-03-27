"use client"

import {useEffect, useRef, useState} from "react"
import {LaudoPrintLayout, LaudoLayoutUnit, LaudoLayoutProfile} from "./LaudoPrintLayout"

// A4 at 96dpi: 210mm × 297mm ≈ 794px × 1123px
const A4_WIDTH_PX = 794
const A4_HEIGHT_PX = 1123

const EXAMPLE_PATIENT = {
  name: "Paciente Exemplo",
  birthDateFormatted: "15/06/1985 (40 anos)",
  examDateFormatted: "27/03/2026"
}

const EXAMPLE_CONTENT = (
  <>
    <div className="text-center mb-3">
      <h2 className="text-l font-bold uppercase tracking-tight">ULTRASSONOGRAFIA ABDOMINAL</h2>
    </div>
    <div className="space-y-6 report-body max-w-none text-black">
      <section>
        <h2 className="text-sm font-bold uppercase mb-2 pb-1 border-b border-black/10">Técnica</h2>
        <p className="text-[14px]">
          Realizado exame ultrassonográfico do abdome total com equipamento de alta resolução, utilizando transdutor
          convexo multifrequencial.
        </p>
      </section>
      <section>
        <h2 className="text-sm font-bold uppercase mb-2 pb-1 border-b border-black/10">Resultado</h2>
        <p className="text-[14px]">
          Fígado com dimensões preservadas, contornos regulares, ecotextura homogênea. Sem imagens nodulares focais.
          Vesícula biliar com paredes finas, sem cálculos. Vias biliares intra e extra-hepáticas sem dilatação. Pâncreas
          de aspecto usual. Baço com volume normal, estrutura homogênea. Rins com dimensões normais, boa diferenciação
          córtico-medular.
        </p>
      </section>
      <section className="pt-2">
        <h2 className="text-sm font-bold uppercase mb-2 pb-1 border-b border-black/10">Impressão</h2>
        <p className="text-[14px]">Exame dentro dos limites da normalidade para a faixa etária.</p>
      </section>
    </div>
  </>
)

interface LaudoDocumentPreviewProps {
  unitName: string
  reportHeader: string
  reportFooter: string
  profile: LaudoLayoutProfile | null
}

/**
 * Preview em escala do layout A4 do laudo.
 *
 * O containerRef (h-full) preenche toda a coluna de preview do UnitSheet.
 * O scale é o menor entre fit-por-largura e fit-por-altura, garantindo que
 * a folha nunca vaze em nenhuma dimensão e mantendo a proporção A4 exata.
 */
export function LaudoDocumentPreview({unitName, reportHeader, reportFooter, profile}: LaudoDocumentPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      // Desconta label (~20px) + gap (8px) do container p-2 (16px top+bottom)
      const availW = el.clientWidth - 16
      const availH = el.clientHeight - 44
      if (availW > 0 && availH > 0) {
        setScale(Math.min(availW / A4_WIDTH_PX, availH / A4_HEIGHT_PX))
      }
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scaledW = Math.round(A4_WIDTH_PX * scale)

  const unit: LaudoLayoutUnit = {
    name: unitName || "Nome da Unidade",
    report_header: reportHeader || null,
    report_footer: reportFooter || null
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-300 rounded-lg flex flex-col justify-center items-center">
      {scale > 0 && (
        <div
          className="overflow-hidden shrink-0"
          style={{
            width: scaledW,
            aspectRatio: "210 / 297",
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.22), 0 1.5px 4px 0 rgba(0,0,0,0.10)"
          }}
        >
          <div
            className="bg-white"
            style={{
              zoom: scale,
              width: A4_WIDTH_PX,
              height: A4_HEIGHT_PX,
              overflow: "hidden"
            }}
          >
            <LaudoPrintLayout unit={unit} profile={profile} patient={EXAMPLE_PATIENT} content={EXAMPLE_CONTENT} />
          </div>
        </div>
      )}
    </div>
  )
}
