"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import type { Editor } from "@tiptap/react";
import { saveExamItem, finalizeExamItem } from "@/app/(protected)/laudos/actions";
import type { ExamFormSnapshot, TemplateVariable } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Save, CheckCircle, Printer, BookOpen,
  Clock, AlertCircle, CheckCircle2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { LaudoRichTextEditor } from "./LaudoRichTextEditor";
import { LaudoVariablesPanel, DRAG_TYPE } from "./LaudoVariablesPanel";

type SectionKey = "technique" | "description" | "impression";

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "success"; Icon: React.ElementType }
> = {
  pending: { label: "Pendente", variant: "secondary", Icon: Clock },
  in_progress: { label: "Em andamento", variant: "default", Icon: AlertCircle },
  completed: { label: "Concluído", variant: "success", Icon: CheckCircle2 },
};

interface LaudoEditorProps {
  itemId: string;
  requestId: string;
  status: string;
  snapshot: ExamFormSnapshot;
  template: {
    id: string;
    title: string;
    technique: string | null;
    description: string | null;
    impression: string | null;
    variables: unknown;
  } | null;
  variables: TemplateVariable[];
  patient: { id: string; name: string; birth_date: string | null; cpf: string | null; gender: string | null } | null;
  unit: { id: string; name: string; report_header: string | null; report_footer: string | null } | null;
  profile: { full_name: string | null; crm: string | null; signature: string | null } | null;
  phrases: { id: string; category: string; label: string; content: string }[];
}

export function LaudoEditor({
  itemId,
  requestId,
  status: initialStatus,
  snapshot,
  template,
  variables,
  patient,
  unit,
  phrases,
}: LaudoEditorProps) {
  const [selections, setSelections] = useState<Record<string, string>>(
    snapshot.variable_selections ?? {}
  );
  const [status, setStatus] = useState(initialStatus);
  const [focusedEditor, setFocusedEditor] = useState<Editor | null>(null);
  const editorsRef = useRef<Record<SectionKey, Editor | null>>({
    technique: null,
    description: null,
    impression: null,
  });

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const processInitialHTML = useCallback((content: string | null | undefined) => {
    if (!content) return "";
    return content.replace(/\{\{([^}]+)\}\}/g, (_, varName) => {
      return `<span data-variable="${varName.trim()}"></span>`;
    });
  }, []);

  const getInitialContent = useCallback(
    (snapVal: string | null | undefined, tplVal: string | null | undefined) => {
      const raw = snapVal ?? tplVal ?? "";
      return processInitialHTML(raw || undefined) || "";
    },
    [processInitialHTML]
  );

  const [contents, setContents] = useState<Record<SectionKey, string>>(() => ({
    technique: getInitialContent(snapshot.technique, template?.technique),
    description: getInitialContent(snapshot.description, template?.description),
    impression: getInitialContent(snapshot.impression, template?.impression),
  }));

  const triggerAutosave = useCallback(async () => {
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      const result = await saveExamItem(itemId, {
        technique: contents.technique,
        description: contents.description,
        impression: contents.impression,
        variable_selections: selections,
      });
      if (!result?.error) setLastSaved(new Date());
    }, 2000);
  }, [itemId, contents, selections]);

  const handleVariableSelect = useCallback((varName: string, value: string) => {
    setSelections((prev) => ({ ...prev, [varName]: value }));
  }, []);

  const handleContentChange = useCallback((key: SectionKey, value: string) => {
    setContents((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    triggerAutosave();
  }, [contents, selections, triggerAutosave]);

  const handleInsertPhrase = useCallback((content: string) => {
    focusedEditor?.commands.insertContent(content);
  }, [focusedEditor]);

  const handleEditorReady = useCallback((key: SectionKey) => (editor: Editor) => {
    editorsRef.current[key] = editor;
  }, []);

  const getTargetEditor = useCallback((): Editor | null => {
    if (focusedEditor?.commands.insertVariable) return focusedEditor;
    return editorsRef.current.description ?? editorsRef.current.technique ?? editorsRef.current.impression;
  }, [focusedEditor]);

  const handleInsertVariable = useCallback((varName: string) => {
    const editor = getTargetEditor();
    if (editor?.commands.insertVariable) {
      editor.chain().focus().insertVariable(varName).run();
    }
  }, [getTargetEditor]);


  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes(DRAG_TYPE)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    const varName = e.dataTransfer.getData(DRAG_TYPE);
    if (varName) {
      e.preventDefault();
      e.stopPropagation();
      handleInsertVariable(varName);
    }
  }, [handleInsertVariable]);

  const handleSave = useCallback(async () => {
    const result = await saveExamItem(itemId, {
      technique: contents.technique,
      description: contents.description,
      impression: contents.impression,
      variable_selections: selections,
    });
    if (!result?.error) {
      setLastSaved(new Date());
      toast.success("Rascunho salvo!");
    } else {
      toast.error(result?.error);
    }
  }, [itemId, contents, selections]);

  const handleFinalize = useCallback(async () => {
    await saveExamItem(itemId, {
      technique: contents.technique,
      description: contents.description,
      impression: contents.impression,
      variable_selections: selections,
    });
    const res = await finalizeExamItem(itemId, requestId);
    if (!res?.error) {
      setStatus("completed");
      toast.success("Laudo finalizado com sucesso!");
    } else {
      toast.error("Erro ao finalizar", { description: res.error });
    }
  }, [itemId, requestId, contents, selections]);

  const phrasesByCategory = phrases.reduce<Record<string, typeof phrases>>(
    (acc, p) => {
      (acc[p.category] = acc[p.category] ?? []).push(p);
      return acc;
    },
    {}
  );

  const statusConfig = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.Icon;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* ── MAIN EDITOR AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header bar */}
        <div className="shrink-0 border-b bg-background px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-base truncate">
                {template?.title ?? "Laudo"}
              </p>
              <Badge variant={statusConfig.variant} className="gap-1 w-fit shrink-0">
                <StatusIcon className="h-3 w-3" />
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {patient?.name} · {unit?.name}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {lastSaved && (
              <span className="text-xs text-muted-foreground hidden md:block">
                Salvo {lastSaved.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
        </div>

        {/* Form único com os 3 campos em coluna */}
        <form
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
          onSubmit={(e) => {
            e.preventDefault();
            handleFinalize();
          }}
        >
          <div
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="space-y-2">
              <Label>Técnica</Label>
              <LaudoRichTextEditor
                value={contents.technique}
                onChange={(v) => handleContentChange("technique", v)}
                variables={variables}
                selections={selections}
                onVariableSelect={handleVariableSelect}
                onFocus={setFocusedEditor}
                onEditorReady={handleEditorReady("technique")}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <LaudoRichTextEditor
                value={contents.description}
                onChange={(v) => handleContentChange("description", v)}
                variables={variables}
                selections={selections}
                onVariableSelect={handleVariableSelect}
                onFocus={setFocusedEditor}
                onEditorReady={handleEditorReady("description")}
              />
            </div>
            <div className="space-y-2">
              <Label>Impressão</Label>
              <LaudoRichTextEditor
                value={contents.impression}
                onChange={(v) => handleContentChange("impression", v)}
                variables={variables}
                selections={selections}
                onVariableSelect={handleVariableSelect}
                onFocus={setFocusedEditor}
                onEditorReady={handleEditorReady("impression")}
              />
            </div>
          </div>

          {/* Footer: Rascunho e Finalizar */}
          <div className="shrink-0 border-t bg-background px-4 py-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-1.5 h-8"
              onClick={handleSave}
            >
              <Save className="h-3.5 w-3.5" />
                Rascunho
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-1.5 h-8"
            >
              <CheckCircle className="h-3.5 w-3.5" />
                Finalizar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 h-8"
              disabled={status !== "completed"}
              onClick={() => window.open(`/laudos/${requestId}/${itemId}/imprimir`, "_blank")}
            >
              <Printer className="h-3.5 w-3.5" /> Imprimir
            </Button>
          </div>
        </form>
      </div>

      {/* ── SIDEBAR: Variáveis + Frases ── */}
      <div className="w-64 shrink-0 border-l flex flex-col bg-muted/10 overflow-hidden">
        <LaudoVariablesPanel variables={variables} onInsert={handleInsertVariable} />
        <div className="shrink-0 px-4 py-3 border-b flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Frases Padrão</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {Object.entries(phrasesByCategory).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 pb-1">
                {category}
              </p>
              {items.map((phrase) => (
                <button
                  key={phrase.id}
                  type="button"
                  onClick={() => handleInsertPhrase(phrase.content)}
                  className="w-full text-left px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors"
                  title={phrase.content}
                >
                  {phrase.label}
                </button>
              ))}
            </div>
          ))}
          {phrases.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">
              Nenhuma frase padrão cadastrada ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
