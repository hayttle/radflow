"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import ImageResize from "tiptap-extension-resize-image";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  List,
  Undo2,
  Redo2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VariableExtension } from "./extensions/VariableExtension";
import { VariableContext } from "./VariableContext";
import type { TemplateVariable } from "@/types/supabase";

const AlignedImageResize = ImageResize.extend({
  addAttributes() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parentAttrs: any = this.parent?.() ?? {};
    return {
      ...parentAttrs,
      containerStyle: {
        ...parentAttrs.containerStyle,
        parseHTML: (element: HTMLElement) => {
          const existing = element.getAttribute("containerstyle");
          if (existing) return existing;
          const align = element.getAttribute("align") || element.getAttribute("data-text-align");
          const width = element.getAttribute("width");
          const style = element.getAttribute("style") || "";
          let margin = "0 auto 0 0";
          if (align === "right") margin = "0 0 0 auto";
          else if (align === "center") margin = "0 auto";
          else if (!align || align === "left") {
            if (style.includes("0 0 0 auto") || style.includes("0px 0px 0px auto")) margin = "0 0 0 auto";
            else if (style.includes("0 auto") || style.includes("0px auto")) margin = "0 auto";
          }
          const widthPart = width ? `width: ${width.endsWith("px") ? width : width + "px"}; ` : "width: 100%; ";
          return `${widthPart}height: auto; cursor: pointer; margin: ${margin};`;
        },
      },
    };
  },
});

interface LaudoRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  variables: TemplateVariable[];
  selections: Record<string, string>;
  onVariableSelect: (name: string, value: string) => void;
  onEditorReady?: (editor: Editor) => void;
  onFocus?: (editor: Editor) => void;
  minHeight?: string;
}

function ensureBlockWrapper(html: string): string {
  if (!html || html.trim() === "") return "<p></p>";
  const trimmed = html.trim();
  if (/^<(p|div|h[1-6]|ul|ol|li|blockquote)(\s|>)/i.test(trimmed)) return html;
  return `<p>${html}</p>`;
}

function postProcessImageHTML(html: string): string {
  if (typeof window === "undefined") return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const imgs = doc.querySelectorAll("img");
  imgs.forEach((img) => {
    const styleAttr = img.getAttribute("style") || "";
    const existingAlign = img.getAttribute("align") || img.getAttribute("data-text-align");
    let alignment = "left";
    const textAlignMatch = styleAttr.match(/text-align:\s*(left|center|right|justify)/);
    if (textAlignMatch) alignment = textAlignMatch[1];
    else if (existingAlign && existingAlign !== "left") alignment = existingAlign;
    else {
      const containerStyle = img.getAttribute("containerstyle") || "";
      const allStyles = containerStyle + " " + styleAttr;
      if (allStyles.includes("0px 0px 0px auto") || allStyles.includes("0 0 0 auto")) alignment = "right";
      else if (allStyles.includes("0px auto") || allStyles.includes("0 auto")) alignment = "center";
    }
    const width = img.getAttribute("width");
    const height = img.getAttribute("height");
    let margin = "0";
    if (alignment === "center") margin = "0 auto";
    else if (alignment === "right") margin = "0 0 0 auto";
    let style = `display: block; margin: ${margin};`;
    if (width) style += ` width: ${width.endsWith("%") || width.endsWith("px") ? width : width + "px"};`;
    if (height) style += ` height: ${height.endsWith("%") || height.endsWith("px") ? height : height + "px"};`;
    img.setAttribute("style", style);
    img.setAttribute("data-text-align", alignment);
    img.setAttribute("align", alignment);
    img.removeAttribute("containerstyle");
    img.removeAttribute("wrapperstyle");
    img.removeAttribute("textalign");
  });
  return doc.body.innerHTML;
}

export function LaudoRichTextEditor({
  value,
  onChange,
  variables,
  selections,
  onVariableSelect,
  onEditorReady,
  onFocus,
  minHeight = "min-h-[2.5rem]",
}: LaudoRichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph", "image"], defaultAlignment: "left" }),
      AlignedImageResize,
      VariableExtension.configure({}),
    ],
    content: ensureBlockWrapper(value),
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      let html = ed.getHTML();
      html = postProcessImageHTML(html);
      onChange(html);
    },
    onCreate: ({ editor: ed }) => onEditorReady?.(ed),
    editorProps: {
      attributes: {
        class: [
          "prose-custom max-w-none focus:outline-none px-3 py-2 text-[14px]",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado para enviar imagens");
        return;
      }
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("signatures").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("signatures").getPublicUrl(fileName);
      // @ts-expect-error setImage from tiptap-extension-resize-image
      editor.chain().focus().setImage({ src: publicUrl }).run();
      toast.success("Imagem enviada");
    } catch (err: unknown) {
      toast.error("Erro ao enviar imagem", { description: (err as Error).message });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!editor) return null;

  const ToolbarButtons = () => (
    <>
      <Button
        type="button"
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Negrito"
      >
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Itálico"
      >
        <Italic className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Lista"
      >
        <List className="h-3.5 w-3.5" />
      </Button>
      <div className="h-4 w-px bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => fileInputRef.current?.click()}
        title="Inserir Imagem"
      >
        <ImageIcon className="h-3.5 w-3.5" />
      </Button>
      <div className="h-4 w-px bg-border mx-1" />
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        title="Esquerda"
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        title="Centro"
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        title="Direita"
      >
        <AlignRight className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "justify" }) ? "secondary" : "ghost"}
        size="icon"
        className="h-7 w-7"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        title="Justificar"
      >
        <AlignJustify className="h-3.5 w-3.5" />
      </Button>
      <div className="h-4 w-px bg-border mx-1" />
      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => editor.chain().focus().undo().run()} title="Desfazer">
        <Undo2 className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => editor.chain().focus().redo().run()} title="Refazer">
        <Redo2 className="h-3.5 w-3.5" />
      </Button>
    </>
  );

  return (
    <VariableContext.Provider value={{ variables, selections, onSelect: onVariableSelect }}>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      <BubbleMenu
        editor={editor}
        shouldShow={({ state }) => !state.selection.empty}
        options={{ placement: "top" }}
        className="flex items-center gap-0.5 border bg-background rounded-md shadow-lg p-1"
      >
        <ToolbarButtons />
      </BubbleMenu>
      <div className="w-full [&_.ProseMirror]:outline-none">
        <EditorContent editor={editor} />
      </div>
      <style>{`
        .ProseMirror img[align="right"],
        .ProseMirror img[style*="margin: 0 0 0 auto"],
        .ProseMirror img[style*="margin: 0px 0px 0px auto"] {
          display: block !important;
          margin-left: auto !important;
          margin-right: 0 !important;
        }
        .ProseMirror img[align="center"],
        .ProseMirror img[style*="margin: 0 auto"],
        .ProseMirror img[style*="margin: 0px auto"] {
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .ProseMirror img[align="left"] {
          display: block !important;
          margin-left: 0 !important;
          margin-right: auto !important;
        }
        .prose-custom, .prose-custom * {
          font-size: 14px !important;
          line-height: 1.5;
        }
        .prose-custom p {
          margin-bottom: 0.5rem;
        }
        .prose-custom h2 {
          font-weight: bold;
          text-transform: uppercase;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
        }
      `}</style>
    </VariableContext.Provider>
  );
}
