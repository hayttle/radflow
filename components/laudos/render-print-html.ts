interface RenderOptions {
  variableSelections?: Record<string, string>;
  templateVariables?: { name: string; label: string }[];
}

/**
 * Normalizes HTML content for print/preview rendering.
 * - Replaces TipTap <span data-variable="..."> and {{variable}} placeholders.
 * - Consolidates <img> layout attributes into a single style attribute for consistent rendering.
 */
export function renderPrintHtml(
  content: string | null | undefined,
  { variableSelections = {}, templateVariables = [] }: RenderOptions = {}
): string {
  if (!content) return "";

  let processed = content.replace(
    /<span[^>]*data-variable="([^"]+)"[^>]*>([\s\S]*?)<\/span>/g,
    (_match, varName: string) => {
      return (
        variableSelections[varName] ||
        templateVariables.find((v) => v.name === varName)?.label ||
        `[${varName}]`
      );
    }
  );

  processed = processed.replace(/\{\{([^}]+)\}\}/g, (_match, varName: string) => {
    const name = varName.trim();
    return (
      variableSelections[name] ||
      templateVariables.find((v) => v.name === name)?.label ||
      _match
    );
  });

  // Use DOMParser when available (browser) to also resolve parent element text-align.
  if (typeof window !== "undefined") {
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(processed, "text/html");
    doc.querySelectorAll("img").forEach((img) => {
      const existingAlign = img.getAttribute("data-text-align") || img.getAttribute("align");
      const styleAttr = img.getAttribute("style") || "";
      const containerStyle = img.getAttribute("containerstyle") || "";
      const allStyles = containerStyle + " " + styleAttr;

      let alignment = existingAlign || "";
      if (!alignment) {
        if (allStyles.includes("0px 0px 0px auto") || allStyles.includes("0 0 0 auto") || allStyles.includes("margin-left: auto")) alignment = "right";
        else if (allStyles.includes("0px auto") || allStyles.includes("0 auto") || allStyles.includes("margin: 0 auto")) alignment = "center";
      }
      if (!alignment) {
        const parentAlign = (img.parentElement as HTMLElement | null)?.style?.textAlign;
        if (parentAlign && parentAlign !== "start") alignment = parentAlign;
      }
      if (!alignment) alignment = "left";

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
    processed = doc.body.innerHTML;
    return processed;
  }

  // SSR fallback: regex-based processing (no DOM, cannot read parent text-align)
  processed = processed.replace(/<img([^>]*)>/g, (_match: string, attrGroup: string) => {
    const attrs: Record<string, string> = {};
    const attrRegex = /([a-z0-9-]+)="([^"]*)"/gi;
    let m;
    while ((m = attrRegex.exec(attrGroup)) !== null) {
      attrs[m[1].toLowerCase()] = m[2];
    }

    const alignment = attrs["data-text-align"] || attrs["align"] || attrs["textalign"];
    let finalAlignment = alignment || "";

    const styleAttr = attrs["style"] || "";
    if (!alignment && styleAttr) {
      if (
        styleAttr.includes("margin-left: auto") ||
        styleAttr.includes("0 0 0 auto") ||
        styleAttr.includes("0px 0px 0px auto")
      )
        finalAlignment = "right";
      else if (
        styleAttr.includes("margin: 0 auto") ||
        styleAttr.includes("margin: 0px auto")
      )
        finalAlignment = "center";
    }

    const width = attrs["width"];
    const height = attrs["height"];

    let style = "";
    if (finalAlignment === "center") {
      style += "display: block; margin: 0 auto;";
    } else if (finalAlignment === "right") {
      style += "display: block; margin: 0 0 0 auto;";
    } else if (finalAlignment === "left") {
      style += "display: block; margin: 0 auto 0 0;";
    }

    if (width)
      style += ` width: ${width.endsWith("%") || width.endsWith("px") ? width : width + "px"};`;
    if (height)
      style += ` height: ${height.endsWith("%") || height.endsWith("px") ? height : height + "px"};`;

    let newTag = "<img";
    const skip = ["style", "containerstyle", "wrapperstyle", "data-text-align", "textalign", "align"];

    for (const [key, val] of Object.entries(attrs)) {
      if (!skip.includes(key)) {
        newTag += ` ${key}="${val}"`;
      }
    }

    newTag += ` data-text-align="${finalAlignment}" align="${finalAlignment}" style="${style}">`;
    return newTag;
  });

  return processed;
}
