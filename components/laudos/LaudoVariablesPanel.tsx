"use client"

import {GripVertical} from "lucide-react"
import type {TemplateVariable} from "@/types/supabase"

const DRAG_TYPE = "application/x-radflow-variable"

interface LaudoVariablesPanelProps {
  variables: TemplateVariable[]
  onInsert: (varName: string) => void
}

export function LaudoVariablesPanel({variables, onInsert}: LaudoVariablesPanelProps) {
  if (variables.length === 0) {
    return (
      <div className="shrink-0 border-b px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">Variáveis do Exame</p>
        <p className="text-xs text-muted-foreground text-center py-4">Nenhuma variável no modelo</p>
      </div>
    )
  }

  const handleDragStart = (e: React.DragEvent, varName: string) => {
    e.dataTransfer.setData(DRAG_TYPE, varName)
    e.dataTransfer.effectAllowed = "copy"
    e.dataTransfer.setData("text/plain", varName)
  }

  return (
    <div className="shrink-0 border-b px-4 py-3">
      <p className="text-xs font-medium text-muted-foreground mb-2">Variáveis do Exame</p>
      <p className="text-[10px] text-muted-foreground mb-2">
        Arraste para o laudo ou clique para inserir no local do cursor.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {variables.map((v) => (
          <span
            key={v.name}
            draggable
            onDragStart={(e) => handleDragStart(e, v.name)}
            onClick={() => onInsert(v.name)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border bg-background border-input cursor-grab active:cursor-grabbing hover:bg-accent hover:border-primary/30 transition-colors select-none"
            title={`Arrastar ou clicar para inserir: ${v.label}`}
          >
            <GripVertical className="h-3 w-3 text-muted-foreground shrink-0" />
            {v.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export {DRAG_TYPE}
