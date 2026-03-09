"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

export function AutoA4PageWrapper({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let resizeTimer: NodeJS.Timeout;

    const calculatePages = () => {
      if (el.children.length < 2) return;

      const measureDiv = document.createElement("div");
      measureDiv.style.height = "297mm";
      measureDiv.style.position = "absolute";
      measureDiv.style.visibility = "hidden";
      document.body.appendChild(measureDiv);
      const a4Px = measureDiv.getBoundingClientRect().height;
      document.body.removeChild(measureDiv);

      const children = Array.from(el.children);
      const footerChild = children.pop() as HTMLElement;
      const contentChildren = children;

      if (contentChildren.length === 0) return;

      const lastContentChild = contentChildren[contentChildren.length - 1] as HTMLElement;

      const containerTop = el.getBoundingClientRect().top;
      const lastContentBottom = lastContentChild.getBoundingClientRect().bottom;
      
      const contentHeight = lastContentBottom - containerTop;
      const footerHeight = footerChild.getBoundingClientRect().height;
      
      const style = window.getComputedStyle(el);
      const pb = parseFloat(style.paddingBottom) || 0;
      
      const contentMb = parseFloat(window.getComputedStyle(lastContentChild).marginBottom) || 0;

      const naturalHeight = contentHeight + contentMb + footerHeight + pb;
      const calculatedPages = Math.max(1, Math.ceil(naturalHeight / a4Px));

      setPages((prev) => (prev !== calculatedPages ? calculatedPages : prev));
    };

    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculatePages, 50);
    });

    observer.observe(el);
    // Also observe the body content in case it changes height
    Array.from(el.children).forEach((child) => observer.observe(child));

    const images = el.querySelectorAll("img");
    const onImageLoad = () => calculatePages();
    images.forEach((img) => img.addEventListener("load", onImageLoad));

    // Initial calculation
    calculatePages();

    return () => {
      observer.disconnect();
      clearTimeout(resizeTimer);
      images.forEach((img) => img.removeEventListener("load", onImageLoad));
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[210mm] bg-white print:shadow-none shadow-xl mx-auto flex flex-col pt-8 print:pt-4 break-inside-avoid"
      style={{ minHeight: `${pages * 297}mm` }}
    >
      {children}
    </div>
  );
}
