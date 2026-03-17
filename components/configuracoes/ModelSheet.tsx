"use client";

import { useTransition, useState, useEffect } from "react";
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
import { Save, Loader2, Plus, Trash } from "lucide-react";
import { saveExamTemplate } from "@/app/(protected)/configuracoes/modelos/actions";
import type { ExamTemplate, TemplateVariable } from "@/types/supabase";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Editor } from "@tiptap/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface UnitOption {
  id: string;
  name: string;
}

interface ModelSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: ExamTemplate | null;
  units: UnitOption[];
}

export function ModelSheet({ open, onOpenChange, template, units }: ModelSheetProps) {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [unitId, setUnitId] = useState<string>("");
  const [active, setActive] = useState(true);

  const [technique, setTechnique] = useState("");
  const [description, setDescription] = useState("");
  const [impression, setImpression] = useState("");

  const [variables, setVariables] = useState<{ name: string; label: string; options: string }[]>([]);

  // Editor instances for external control (variable insertion)
  const [teqEditor, setTeqEditor] = useState<Editor | null>(null);
  const [descEditor, setDescEditor] = useState<Editor | null>(null);
  const [impEditor, setImpEditor] = useState<Editor | null>(null);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "_")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    if (open) {
      setTitle(template?.title ?? "");
      setUnitId(template?.unit_id ?? (units[0]?.id ?? ""));
      setActive(template?.active ?? true);
      setTechnique(template?.technique ?? "");
      setDescription(template?.description ?? "");
      setImpression(template?.impression ?? "");

      const parsedVars = (template?.variables as TemplateVariable[] | undefined)?.map((v) => ({
        ...v,
        options: Array.isArray(v.options) ? v.options.join("; ") : v.options,
      })) ?? [];

      setVariables(parsedVars);
    }
  }, [open, template]);

  const addVariable = () => {
    setVariables([...variables, { name: "", label: "", options: "" }]);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateVariable = (index: number, field: string, value: string) => {
    const newVars = [...variables];
    const updated = { ...newVars[index], [field]: value };
    // If updating label, auto-update name as slug
    if (field === "label") {
      updated.name = slugify(value);
    }
    newVars[index] = updated;
    setVariables(newVars);
  };

  const insertVariable = (editor: Editor | null, varName: string) => {
    if (editor && varName) {
      editor.chain().focus().insertContent(`{{${varName}}}`).run();
    }
  };

  const VariableChips = ({ onInsert }: { onInsert: (name: string) => void }) => {
    const validVars = variables.filter(v => v.name.trim() && v.label.trim());
    if (validVars.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1.5 mb-2 bg-muted/30 p-2 rounded-md border border-dashed border-muted-foreground/20">
        <span className="text-[10px] uppercase font-bold text-muted-foreground w-full mb-1">Inserir Variável:</span>
        {validVars.map((v) => (
          <Badge
            key={v.name}
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-[11px] py-0 h-5"
            onClick={() => onInsert(v.name)}
          >
            {v.label}
          </Badge>
        ))}
      </div>
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("O título do modelo é obrigatório.");
      return;
    }

    const payloadVars = variables.map(v => ({
      name: v.name.trim() || slugify(v.label),
      label: v.label.trim(),
      options: v.options.split(";").map(o => o.trim()).filter(Boolean)
    })).filter(v => v.label && v.options.length > 0);

    const payload = {
      title,
      unit_id: unitId,
      active,
      technique,
      description,
      impression,
      variables: payloadVars,
    };

    startTransition(async () => {
      const result = await saveExamTemplate(payload, template?.id);
      if (result.error) {
        if (typeof result.error === "string") {
          toast.error("Erro", { description: result.error });
        } else {
          toast.error("Erro de validação", { description: "Verifique os dados informados." });
        }
        return;
      }
      toast.success(template?.id ? "Modelo atualizado!" : "Modelo cadastrado!");
      onOpenChange(false);
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-3xl md:w-3/4 p-0" side="right">
        <div className="p-6 border-b shrink-0 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <SheetHeader>
            <SheetTitle>{template?.id ? "Editar Modelo de Exame" : "Novo Modelo de Exame"}</SheetTitle>
            <SheetDescription>
              Configure o texto padrão e defina variáveis do sistema.
            </SheetDescription>
          </SheetHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Identificação */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Identificação do Modelo</h3>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
              <div className="space-y-1">
                <Label htmlFor="active" className="text-base font-semibold">Modelo Ativo</Label>
                <p className="text-sm text-muted-foreground">Disponível para seleção em novos laudos.</p>
              </div>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="title" required>Título do Exame</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ressonância Magnética do Crânio"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label required>Unidade Atendida</Label>
                <Select value={unitId} onValueChange={setUnitId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Variáveis Dinâmicas */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-medium">Variáveis Dinâmicas</h3>
              <Button type="button" variant="outline" size="sm" onClick={addVariable}>
                <Plus className="h-4 w-4 mr-2" />
                Variável
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Crie campos que podem ser preenchidos no momento do laudo.
              As opções devem ser separadas por ponto-e-virgula (;).
            </p>

            {variables.length === 0 ? (
              <div className="border border-dashed rounded-xl p-6 text-center text-muted-foreground text-sm bg-muted/20">
                Sem variáveis configuradas para este modelo.
              </div>
            ) : (
              <div className="space-y-3">
                {variables.map((v, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-3 items-start p-3 border rounded-lg bg-card group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                      <div className="space-y-1">
                        <Label className="text-xs">Variável / Pergunta</Label>
                        <Input
                          placeholder="Ex: Aspecto do pulmão"
                          value={v.label}
                          onChange={(e) => updateVariable(index, "label", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Opções (separadas por ponto-e-virgula ;) </Label>
                        <Input
                          placeholder="Normal; Múltiplos nódulos; Condensação"
                          value={v.options}
                          onChange={(e) => updateVariable(index, "options", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive shrink-0 mt-5"
                      onClick={() => removeVariable(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Textos Padrão */}
          <section className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Modelo de Laudo</h3>

            <div className="space-y-2">
              <Label>Técnica</Label>
              <VariableChips onInsert={(name) => insertVariable(teqEditor, name)} />
              <RichTextEditor value={technique} onChange={setTechnique} onReady={setTeqEditor} />
            </div>

            <div className="space-y-2">
              <Label>Resultado</Label>
              <VariableChips onInsert={(name) => insertVariable(descEditor, name)} />
              <RichTextEditor value={description} onChange={setDescription} onReady={setDescEditor} />
            </div>

            <div className="space-y-2">
              <Label>Impressão Diagnóstica</Label>
              <VariableChips onInsert={(name) => insertVariable(impEditor, name)} />
              <RichTextEditor value={impression} onChange={setImpression} onReady={setImpEditor} />
            </div>
          </section>

          <div className="flex gap-2 justify-end pt-4 border-t sticky bottom-0 bg-background py-4 z-10 mt-12">
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
              {template?.id ? "Salvar Modelo" : "Cadastrar Modelo"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
