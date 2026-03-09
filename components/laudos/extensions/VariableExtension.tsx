import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TemplateVariable } from "@/types/supabase";
export interface VariableOptions {
  variables: TemplateVariable[];
  selections: Record<string, string>;
  onSelect: (name: string, value: string) => void;
  HTMLAttributes: Record<string, string | number | boolean | undefined>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (name: string) => ReturnType;
    };
  }
}

import { useVariableContext } from "../VariableContext";

interface VariableNodeViewProps {
  node: { attrs: { name?: string } };
}

const VariableNodeView = (props: VariableNodeViewProps) => {
  const { node } = props;
  const name = node.attrs.name ?? "";

  const { variables, selections, onSelect } = useVariableContext();
  const variable = variables.find((v) => v.name === name);
  const selected = selections[name];

  if (!variable) {
    return (
      <NodeViewWrapper as="span" className="inline-block text-destructive bg-destructive/10 px-1 rounded mx-0.5">
        [{name} não encontrada]
      </NodeViewWrapper>
    );
  }

  // Prevent default events (like Enter key) from bubbling up and inserting a new line in Tiptap
  // while we interact with the popover.
  const handleSelect = (e: React.MouseEvent, opt: string) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(name, opt);
  };

  return (
    <NodeViewWrapper as="span" className="inline-block mx-1 align-baseline cursor-pointer" data-drag-handle>
      <Popover>
        <PopoverTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 pb-0.5 pt-0 rounded-full text-xs font-medium border decoration-clone select-none",
              selected
                ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                : "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
            )}
            onClick={(e) => {
              // stop prop to prevent tiptap from focusing right here right away
              e.stopPropagation();
            }}
          >
            {selected ?? variable.label}
            <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
          </span>
        </PopoverTrigger>
        <PopoverContent
          className="w-48 p-1"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <p className="text-xs font-semibold text-muted-foreground px-2 pt-1 pb-2 truncate">
            {variable.label}
          </p>
          <div className="space-y-0.5">
            {variable.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={(e) => handleSelect(e, opt)}
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
    </NodeViewWrapper>
  );
};

export const VariableExtension = Node.create<VariableOptions>({
  name: "variable",

  group: "inline",
  inline: true,
  selectable: false,
  atom: true, // it acts as a single unit

  addOptions() {
    return {
      variables: [],
      selections: {},
      onSelect: () => {},
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-variable"),
        renderHTML: (attributes) => {
          return {
            "data-variable": attributes.name,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-variable]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableNodeView);
  },

  addCommands() {
    return {
      insertVariable:
        (name: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              name,
            },
          });
        },
    };
  },
});
