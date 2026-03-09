"use client";

import { useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
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
  AlignJustify
} from "lucide-react";
import { Button } from "./button";

// Extend ImageResize so that containerStyle is reconstructed from our saved 'align' attribute on load.
// The plugin NodeView (ImageNodeView.setupDOMStructure) reads node.attrs.containerStyle
// to set the wrapper div's style. Without this, loading saved HTML (with align='right' but no
// containerstyle attribute) always shows left-aligned because the plugin's default parseHTML
// ignores margin info. The attribute key in Tiptap is 'containerStyle' (camelCase!).
const AlignedImageResize = ImageResize.extend({
  addAttributes() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parentAttrs: any = this.parent?.() ?? {};
    return {
      ...parentAttrs,
      // Override containerStyle (camelCase = Tiptap attribute key)
      containerStyle: {
        ...parentAttrs.containerStyle,
        parseHTML: (element: HTMLElement) => {
          // If containerstyle HTML attribute is present (from plugin's own save), use it directly
          const existing = element.getAttribute('containerstyle');
          if (existing) return existing;

          // Reconstruct from our saved align attribute
          const align = element.getAttribute('align') || element.getAttribute('data-text-align');
          const width = element.getAttribute('width');
          const style = element.getAttribute('style') || '';

          // Plugin convention: left='margin: 0 auto 0 0', center='margin: 0 auto', right='margin: 0 0 0 auto'
          let margin = '0 auto 0 0'; // default = left
          if (align === 'right') margin = '0 0 0 auto';
          else if (align === 'center') margin = '0 auto';
          else if (!align || align === 'left') {
            // Fallback: detect from inline style margin
            if (style.includes('0 0 0 auto') || style.includes('0px 0px 0px auto')) margin = '0 0 0 auto';
            else if (style.includes('0 auto') || style.includes('0px auto')) margin = '0 auto';
          }

          const widthPart = width ? `width: ${width.endsWith('px') ? width : width + 'px'}; ` : 'width: 100%; ';
          return `${widthPart}height: auto; cursor: pointer; margin: ${margin};`;
        },
      },
    };
  },
})

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onReady?: (editor: Editor) => void;
  bucket?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  onReady,
  bucket = "signatures"
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      // TextAlign manages text-align style on all these node types, including image
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
        defaultAlignment: "left",
      }),
      AlignedImageResize,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      let html = editor.getHTML();
      
      // Post-process: convert text-align style on <img> to margin-based alignment
      // This removes 'text-align' from the img tag and uses display:block + margins instead
      if (typeof window !== "undefined") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const imgs = doc.querySelectorAll("img");

        imgs.forEach(img => {
          // Read all possible alignment sources
          const styleAttr = img.getAttribute("style") || "";
          const existingAlign = img.getAttribute("align") || img.getAttribute("data-text-align");
          
          // Extract text-align from style (set by TextAlign extension / our toolbar buttons)
          let alignment = "left";
          const textAlignMatch = styleAttr.match(/text-align:\s*(left|center|right|justify)/);
          if (textAlignMatch) {
            alignment = textAlignMatch[1];
          } else if (existingAlign && existingAlign !== "left") {
            // Trust a non-default saved attribute
            alignment = existingAlign;
          } else {
            // CRITICAL: The plugin's floating sub-menu sets alignment via `containerstyle`, not `style`.
            // e.g. containerstyle="position: relative; width: 288px; margin: 0px 0px 0px auto;"
            const containerStyle = img.getAttribute("containerstyle") || "";
            const allStyles = containerStyle + " " + styleAttr;
            if (allStyles.includes('0px 0px 0px auto') || allStyles.includes('0 0 0 auto') || allStyles.includes('margin-left: auto')) alignment = 'right';
            else if (allStyles.includes('0px auto') || allStyles.includes('0 auto')) alignment = 'center';
            else alignment = existingAlign || 'left';
          }

          const width = img.getAttribute("width");
          const height = img.getAttribute("height");
          
          let margin = "0";
          if (alignment === "center") margin = "0 auto";
          else if (alignment === "right") margin = "0 0 0 auto";

          // Build clean style: display:block + margins. NO text-align on img.
          let style = `display: block; margin: ${margin};`;
          if (width) style += ` width: ${width.endsWith("%") || width.endsWith("px") ? width : width + "px"};`;
          if (height) style += ` height: ${height.endsWith("%") || height.endsWith("px") ? height : height + "px"};`;

          // Apply clean attributes
          img.setAttribute("style", style);
          img.setAttribute("data-text-align", alignment);
          img.setAttribute("align", alignment);
          
          // Remove noisy attributes from tiptap-extension-resize-image
          img.removeAttribute("containerstyle");
          img.removeAttribute("wrapperstyle");
          img.removeAttribute("textalign");
        });
        html = doc.body.innerHTML;
      }

      onChange(html);
    },
    onCreate: ({ editor }) => {
      onReady?.(editor);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[120px] p-3 bg-background rounded-b-md border-x border-b",
      },
    },
  });

  if (!editor) return null;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Você precisa estar logado para enviar imagens");
          return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        // @ts-expect-error: setImage is provided by tiptap-extension-resize-image
        editor.chain().focus().setImage({ src: publicUrl }).run();
        toast.success("Imagem enviada com sucesso");
      } catch (error: unknown) {
        console.error("Error uploading image:", error);
        toast.error("Erro ao enviar imagem", { description: error instanceof Error ? error.message : "Erro desconhecido" });
      }
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col w-full rounded-md shadow-sm">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      <div className="flex items-center gap-1 border bg-muted/50 p-1 py-1.5 px-2 rounded-t-md">
        <Button
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="icon"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="icon"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          size="icon"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
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
          onClick={() => {
            if (editor.isActive("image")) {
              const w = editor.getAttributes("image").width;
              const wp = w ? ` width: ${String(w).endsWith('px') ? w : w + 'px'};` : '';
              editor.chain().focus().updateAttributes("image", { containerstyle: `position: relative;${wp} margin: 0;` }).run();
            } else {
              editor.chain().focus().setTextAlign("left").run();
            }
          }}
          title="Alinhar à Esquerda"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            if (editor.isActive("image")) {
              const w = editor.getAttributes("image").width;
              const wp = w ? ` width: ${String(w).endsWith('px') ? w : w + 'px'};` : '';
              editor.chain().focus().updateAttributes("image", { containerstyle: `position: relative;${wp} margin: 0 auto;` }).run();
            } else {
              editor.chain().focus().setTextAlign("center").run();
            }
          }}
          title="Centralizar"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            if (editor.isActive("image")) {
              const w = editor.getAttributes("image").width;
              const wp = w ? ` width: ${String(w).endsWith('px') ? w : w + 'px'};` : '';
              editor.chain().focus().updateAttributes("image", { containerstyle: `position: relative;${wp} margin: 0 0 0 auto;` }).run();
            } else {
              editor.chain().focus().setTextAlign("right").run();
            }
          }}
          title="Alinhar à Direita"
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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <EditorContent editor={editor} />
      {/* CSS to visually reflect image alignment inside the editor.
          The tiptap-extension-resize-image plugin renders images inside a NodeView wrapper.
          We use CSS selectors to target img by align attribute and inline margin to force correct visual display. */}
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
      `}</style>
    </div>
  );
}
