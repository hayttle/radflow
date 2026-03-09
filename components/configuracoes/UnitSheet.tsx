"use client";

import { useTransition, useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2 } from "lucide-react";
import { saveUnit } from "@/app/(protected)/configuracoes/unidades/actions";
import type { Unit } from "@/types/supabase";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface UnitSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit?: Unit | null;
}

export function UnitSheet({ open, onOpenChange, unit }: UnitSheetProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [header, setHeader] = useState(unit?.report_header ?? "");
  const [footer, setFooter] = useState(unit?.report_footer ?? "");
  const [active, setActive] = useState(unit?.active ?? true);

  useEffect(() => {
    if (open) {
      setHeader(unit?.report_header ?? "");
      setFooter(unit?.report_footer ?? "");
      setActive(unit?.active ?? true);
    }
  }, [open, unit]);

  async function action(formData: FormData) {
    formData.set("report_header", header);
    formData.set("report_footer", footer);
    formData.set("active", active.toString());

    startTransition(async () => {
      const result = await saveUnit(formData, unit?.id);
      if (result.error) {
        toast.error("Erro", { description: result.error });
        return;
      }
      toast.success(unit ? "Unidade atualizada!" : "Unidade cadastrada!");
      onOpenChange(false);
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-2xl md:w-3/4" side="right">
        <SheetHeader>
          <SheetTitle>{unit ? "Editar Unidade" : "Nova Unidade"}</SheetTitle>
          <SheetDescription>
            Configure as informações da unidade de atendimento e o cabeçalho/rodapé que será impresso nos laudos.
          </SheetDescription>
        </SheetHeader>

        <form ref={formRef} action={action} className="space-y-6 mt-6 pb-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
            <div className="space-y-1">
              <Label htmlFor="active" className="text-base font-semibold">Unidade Ativa</Label>
              <p className="text-sm text-muted-foreground">Define se a unidade aparece nas opções de novos laudos.</p>
            </div>
            <Switch
              id="active"
              checked={active}
              onCheckedChange={setActive}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Unidade *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={unit?.name}
                placeholder="Ex: Clínica Centro"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={unit?.phone ?? ""}
                placeholder="(00) 00000-0000"
              />
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
            <p className="text-xs text-muted-foreground mb-2">Este texto/imagem será exibido no topo do laudo impresso.</p>
            <RichTextEditor value={header} onChange={setHeader} bucket="units" />
          </div>

          <div className="space-y-2 pt-4">
            <Label>Rodapé para Impressão</Label>
            <p className="text-xs text-muted-foreground mb-2">Exibido na parte inferior final do laudo.</p>
            <RichTextEditor value={footer} onChange={setFooter} bucket="units" />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t sticky bottom-0 bg-background py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {unit ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
