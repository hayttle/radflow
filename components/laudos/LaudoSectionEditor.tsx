"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { VariableExtension } from "./extensions/VariableExtension";
import { VariableContext } from "./VariableContext";
import type { TemplateVariable } from "@/types/supabase";

interface LaudoSectionEditorProps {
  value: string;
  onChange: (value: string) => void;
  variables: TemplateVariable[];
  selections: Record<string, string>;
  onVariableSelect: (name: string, value: string) => void;
  onEditorReady?: (editor: Editor) => void;
  onFocus?: (editor: Editor) => void;
  /** Altura mínima para área clicável quando vazio (padrão: 1 linha) */
  minHeight?: string;
}

function ensureBlockWrapper(html: string): string {
  if (!html || html.trim() === "") return "<p></p>";
  const trimmed = html.trim();
  if (/^<(p|div|h[1-6]|ul|ol|li|blockquote)(\s|>)/i.test(trimmed)) return html;
  return `<p>${html}</p>`;
}

export function LaudoSectionEditor({
  value,
  onChange,
  variables,
  selections,
  onVariableSelect,
  onEditorReady,
  onFocus,
  minHeight = "min-h-[2.5rem]",
}: LaudoSectionEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, VariableExtension.configure({})],
    content: ensureBlockWrapper(value),
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    onCreate: ({ editor: ed }) => onEditorReady?.(ed),
    editorProps: {
      attributes: {
        class: [
          "prose prose-sm max-w-none focus:outline-none px-3 py-2",
          "border border-input rounded-md bg-background shadow-sm",
          "min-w-0 w-full",
          minHeight,
        ].join(" "),
      },
    },
  });

  useEffect(() => {
    if (!editor || !onFocus) return;
    const handleFocus = () => onFocus(editor);
    editor.on("focus", handleFocus);
    return () => {
      editor.off("focus", handleFocus);
    };
  }, [editor, onFocus]);

  if (!editor) return null;

  return (
    <VariableContext.Provider
      value={{ variables, selections, onSelect: onVariableSelect }}
    >
      <div className="w-full [&_.ProseMirror]:outline-none">
        <EditorContent editor={editor} />
      </div>
    </VariableContext.Provider>
  );
}
