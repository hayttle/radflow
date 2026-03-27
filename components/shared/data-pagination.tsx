"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  /** Number of page buttons to show around the current page */
  siblingCount?: number;
}

export function DataPagination({
  currentPage,
  totalPages,
  siblingCount = 1,
}: DataPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createPageURL = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  if (totalPages <= 1) return null;

  // Build page number list with ellipsis
  const pages: (number | "ellipsis")[] = [];
  const leftBound = Math.max(2, currentPage - siblingCount);
  const rightBound = Math.min(totalPages - 1, currentPage + siblingCount);

  pages.push(1);
  if (leftBound > 2) pages.push("ellipsis");
  for (let i = leftBound; i <= rightBound; i++) pages.push(i);
  if (rightBound < totalPages - 1) pages.push("ellipsis");
  if (totalPages > 1) pages.push(totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
            onClick={(e) => {
              if (currentPage <= 1) return e.preventDefault();
              router.push(createPageURL(currentPage - 1));
            }}
          />
        </PaginationItem>

        {pages.map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={createPageURL(page)}
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(createPageURL(page));
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={createPageURL(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
            onClick={(e) => {
              if (currentPage >= totalPages) return e.preventDefault();
              router.push(createPageURL(currentPage + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
