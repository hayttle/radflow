"use client"

import {useTransition, useRef, useState, useEffect} from "react"
import type {Editor} from "@tiptap/react"
import {toast} from "sonner"
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import {Save, Loader2} from "lucide-react"
import {saveUnit} from "@/app/(protected)/configuracoes/unidades/actions"
import type {Unit} from "@/types/supabase"
import {RichTextEditor} from "@/components/ui/rich-text-editor"
import {LaudoDocumentPreview} from "@/components/laudos/LaudoDocumentPreview"
import type {LaudoLayoutProfile} from "@/components/laudos/LaudoPrintLayout"

interface UnitSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit?: Unit | null
  printPreviewProfile?: LaudoLayoutProfile | null
}

export function UnitSheet({open, onOpenChange, unit, printPreviewProfile}: UnitSheetProps) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const headerEditorRef = useRef<Editor | null>(null)
  const footerEditorRef = useRef<Editor | null>(null)

  const [name, setName] = useState(unit?.name ?? "")
  const [header, setHeader] = useState(unit?.report_header ?? "")
  const [footer, setFooter] = useState(unit?.report_footer ?? "")
  const [active, setActive] = useState(unit?.active ?? true)

  useEffect(() => {
    if (open) {
      setName(unit?.name ?? "")
      setHeader(unit?.report_header ?? "")
      setFooter(unit?.report_footer ?? "")
      setActive(unit?.active ?? true)
    }
  }, [open, unit])

  async function action(formData: FormData) {
    // Lê diretamente do editor para capturar conteúdo mais recente (inclui imagens recém-inseridas)
    const currentHeader = headerEditorRef.current?.getHTML() ?? header
    const currentFooter = footerEditorRef.current?.getHTML() ?? footer

    formData.set("name", name)
    formData.set("report_header", currentHeader)
    formData.set("report_footer", currentFooter)
    formData.set("active", active.toString())

    startTransition(async () => {
      const result = await saveUnit(formData, unit?.id)
      if (result.error) {
        toast.error("Erro", {description: result.error})
        return
      }
      toast.success(unit ? "Unidade atualizada!" : "Unidade cadastrada!")
      onOpenChange(false)
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/*
        SheetContent: overflow-hidden permite colunas internas com scroll independente.
        h-screen garante que a coluna de preview tenha altura definida para h-full funcionar.
      */}
      <SheetContent
        className="w-full sm:max-w-[min(96vw,1400px)] h-screen flex flex-col overflow-hidden p-0"
        side="right"
      >
        {/* Cabeçalho fixo */}
        <div className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetHeader>
            <SheetTitle>{unit ? "Editar Unidade" : "Nova Unidade"}</SheetTitle>
            <SheetDescription>
              Configure as informações da unidade e o cabeçalho/rodapé que será impresso nos laudos. O preview ao lado
              reflete as alterações em tempo real.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Corpo: form (scroll) + preview (fixo) */}
        <div className="flex-1 flex overflow-hidden">
          {/* ── Coluna do formulário (scroll independente) ── */}
          <div className="overflow-y-auto shrink-0 px-6 py-4" style={{width: "min(55%, 680px)"}}>
            <form ref={formRef} action={action} className="space-y-6 pb-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
                <div className="space-y-1">
                  <Label htmlFor="active" className="text-base font-semibold">
                    Unidade Ativa
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Define se a unidade aparece nas opções de novos laudos.
                  </p>
                </div>
                <Switch id="active" checked={active} onCheckedChange={setActive} />
              </div>

              <div className="grid grid-cols-[1fr_160px] gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" required>
                    Nome da Unidade
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Clínica Centro"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" name="phone" defaultValue={unit?.phone ?? ""} placeholder="(00) 00000-0000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={unit?.address ?? ""}
                  placeholder="Rua, Número, Bairro, Cidade"
                />
              </div>

              <div className="space-y-2 pt-4">
                <Label>Cabeçalho para Impressão</Label>
                <p className="text-xs text-muted-foreground mb-2">Exibido no topo do laudo impresso.</p>
                <RichTextEditor
                  key={`header-${unit?.id ?? "new"}`}
                  value={header}
                  onChange={setHeader}
                  onReady={(editor) => {
                    headerEditorRef.current = editor
                  }}
                  bucket="units"
                />
              </div>

              <div className="space-y-2 pt-4">
                <Label>Rodapé para Impressão</Label>
                <p className="text-xs text-muted-foreground mb-2">Exibido na parte inferior do laudo impresso.</p>
                <RichTextEditor
                  key={`footer-${unit?.id ?? "new"}`}
                  value={footer}
                  onChange={setFooter}
                  onReady={(editor) => {
                    footerEditorRef.current = editor
                  }}
                  bucket="units"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t sticky bottom-0 bg-background py-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  {unit ? "Salvar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </div>

          {/* ── Coluna do preview A4 (ocupa o resto, sem scroll) ── */}
          <div className="flex-1 overflow-hidden border-l p-3">
            <LaudoDocumentPreview
              unitName={name}
              reportHeader={header}
              reportFooter={footer}
              profile={printPreviewProfile ?? null}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
