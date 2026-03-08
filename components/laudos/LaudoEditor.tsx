"use client";

import { useState, useCallback, useRef, useEffect, useTransition } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";
import { saveExamItem, finalizeExamItem } from "@/app/(protected)/laudos/actions";
import type { ExamFormSnapshot, TemplateVariable } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bold, Italic, List, Undo2, Redo2,
  Save, CheckCircle, Printer, ChevronDown, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// Helpers (unused at runtime but kept for reference)
// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
// Variable Badge Popover
// ──────────────────────────────────────────────
function VariableBadge({
  variable,
  selected,
  onSelect,
}: {
  variable: TemplateVariable;
  selected: string | undefined;
  onSelect: (val: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer border",
            selected
              ? "bg-primary/15 text-primary border-primary/30 hover:bg-primary/25"
              : "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
          )}
        >
          {selected ?? variable.label}
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        <p className="text-xs font-semibold text-muted-foreground px-2 pt-1 pb-2">
          {variable.label}
        </p>
        <div className="space-y-0.5">
          {variable.options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={cn(
                "w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors",
                selected === opt
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ──────────────────────────────────────────────
// Main LaudoEditor
// ──────────────────────────────────────────────
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
  profile: { full_name: string | null; crm: string | null; signature_url: string | null } | null;
  phrases: { id: string; category: string; label: string; content: string }[];
}

const SECTION_LABELS: Record<string, string> = {
  technique: "Técnica",
  description: "Descrição",
  impression: "Impressão",
};

type SectionKey = "technique" | "description" | "impression";

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
  const [isPending, startTransition] = useTransition();
  const [selections, setSelections] = useState<Record<string, string>>(
    snapshot.variable_selections ?? {}
  );
  const [activeSection, setActiveSection] = useState<SectionKey>("description");
  const [status, setStatus] = useState(initialStatus);

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const sectionContent: Record<SectionKey, string | null | undefined> = {
    technique: template?.technique,
    description: template?.description,
    impression: template?.impression,
  };

  const getInitialContent = (section: SectionKey) => {
    const saved = snapshot[section];
    const templateContent = sectionContent[section];
    return saved ?? templateContent ?? "";
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: getInitialContent("description"),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] px-1",
      },
    },
  });

  // Switch section content in editor
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(getInitialContent(activeSection) ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  const triggerAutosave = useCallback(() => {
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      if (!editor) return;
      const result = await saveExamItem(itemId, {
        technique: activeSection === "technique" ? editor.getHTML() : snapshot.technique,
        description: activeSection === "description" ? editor.getHTML() : snapshot.description,
        impression: activeSection === "impression" ? editor.getHTML() : snapshot.impression,
        variable_selections: selections,
      });
      if (!result?.error) setLastSaved(new Date());
    }, 2000);
  }, [editor, itemId, activeSection, selections, snapshot]);

  // Auto-save on editor change
  useEffect(() => {
    if (!editor) return;
    editor.on("update", triggerAutosave);
    return () => { editor.off("update", triggerAutosave); };
  }, [editor, triggerAutosave]);


  const handleVariableSelect = (varName: string, value: string) => {
    const next = { ...selections, [varName]: value };
    setSelections(next);
    triggerAutosave();
  };

  const handleFinalize = () => {
    startTransition(async () => {
      const result = await finalizeExamItem(itemId, requestId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        setStatus("completed");
        toast.success("Laudo finalizado!");
      }
    });
  };

  const handleInsertPhrase = (content: string) => {
    editor?.commands.insertContent(content);
  };


  // Group phrases by category
  const phrasesByCategory = phrases.reduce<Record<string, typeof phrases>>(
    (acc, p) => {
      (acc[p.category] = acc[p.category] ?? []).push(p);
      return acc;
    },
    {}
  );

  const isCompleted = status === "completed";

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* ── MAIN EDITOR AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header bar */}
        <div className="shrink-0 border-b bg-background px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <p className="font-semibold text-base truncate">
              {template?.title ?? "Laudo"}
            </p>
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
            <Badge variant={isCompleted ? "outline" : "secondary"}>
              {isCompleted ? "Concluído" : "Rascunho"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => window.open(`/laudos/${requestId}/${itemId}/print`, "_blank")}
            >
              <Printer className="h-4 w-4" /> Imprimir
            </Button>
            {!isCompleted && (
              <Button
                size="sm"
                className="gap-1.5"
                onClick={handleFinalize}
                disabled={isPending}
              >
                <CheckCircle className="h-4 w-4" />
                Finalizar
              </Button>
            )}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="shrink-0 border-b flex">
          {(["technique", "description", "impression"] as SectionKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={cn(
                "px-5 py-2.5 text-sm font-medium transition-colors border-b-2",
                activeSection === s
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              {SECTION_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Variables row */}
        {variables.length > 0 && (
          <div className="shrink-0 px-6 py-2.5 border-b bg-muted/20 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground mr-1">Variáveis:</span>
            {variables.map((v) => (
              <VariableBadge
                key={v.name}
                variable={v}
                selected={selections[v.name]}
                onSelect={(val) => handleVariableSelect(v.name, val)}
              />
            ))}
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <EditorContent editor={editor} />
        </div>

        <div className="shrink-0 border-t bg-background px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant={editor?.isActive("bold") ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              title="Negrito"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={editor?.isActive("italic") ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              title="Itálico"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={editor?.isActive("bulletList") ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              title="Lista"
            >
              <List className="h-4 w-4" />
            </Button>
            <div className="h-4 w-px bg-border mx-2" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor?.chain().focus().undo().run()}
              title="Desfazer"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor?.chain().focus().redo().run()}
              title="Refazer"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
          <div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-8"
            onClick={async () => {
              if (!editor) return;
              const result = await saveExamItem(itemId, {
                [activeSection]: editor.getHTML(),
                variable_selections: selections,
              });
              if (!result?.error) {
                setLastSaved(new Date());
                toast.success("Rascunho salvo!");
              }
            }}
          >
            <Save className="h-3.5 w-3.5" />
            Salvar
          </Button>
          </div>
        </div>
      </div>

      {/* ── PHRASES SIDEBAR ── */}
      <div className="w-64 shrink-0 border-l flex flex-col bg-muted/10 overflow-hidden">
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
