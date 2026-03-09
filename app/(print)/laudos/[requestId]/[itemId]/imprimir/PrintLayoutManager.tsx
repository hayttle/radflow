"use client";

import { ReactNode } from "react";

/**
 * Layout de impressão simples e confiável.
 * Usa tabela nativa: thead e tfoot repetem automaticamente em cada página impressa.
 * Assinatura fica no tbody com break-inside-avoid, aparecendo apenas no final do conteúdo.
 */
export function PrintLayoutManager({
  header,
  patientInfo,
  content,
  signature,
  footer,
}: {
  header: ReactNode;
  patientInfo: ReactNode;
  content: ReactNode;
  signature: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white text-black">
      <table className="w-full" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <td className="align-top">{header}</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="align-top pb-8 pt-4">
              {patientInfo}
              <div className="mt-4">{content}</div>
              <div className="mt-12 break-inside-avoid">{signature}</div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className="align-bottom pt-4">{footer}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
