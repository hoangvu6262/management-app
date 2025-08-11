import React, { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  PagedFootballMatches,
  FootballMatchFilter,
} from "@/services/footballMatchService";

interface PaginationProps {
  data: PagedFootballMatches;
  onFilterChange: (key: keyof FootballMatchFilter, value: any) => void;
}

export function Pagination({ data, onFilterChange }: PaginationProps) {
  const handlePageChange = useCallback(
    (page: number) => {
      onFilterChange("page", page);
    },
    [data?.currentPage, onFilterChange]
  );

  if (!data || data.totalPages <= 1) {
    return null;
  }

  const renderPageNumbers = () => {
    const maxVisible = 5;
    const current = data.currentPage;
    const total = data.totalPages;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1).map(
        (pageNumber) => (
          <Button
            key={pageNumber}
            variant={current === pageNumber ? "default" : "outline"}
            size="icon"
            onClick={() => handlePageChange(pageNumber)}
            className="h-8 w-8"
          >
            {pageNumber}
          </Button>
        )
      );
    }

    // Smart pagination for many pages
    let startPage: number;
    let endPage: number;

    if (current <= 3) {
      startPage = 1;
      endPage = maxVisible;
    } else if (current >= total - 2) {
      startPage = total - maxVisible + 1;
      endPage = total;
    } else {
      startPage = current - 2;
      endPage = current + 2;
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={current === i ? "default" : "outline"}
          size="icon"
          onClick={() => handlePageChange(i)}
          className="h-8 w-8"
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t gap-4">
      <div className="text-sm text-muted-foreground">
        Page {data.currentPage} of {data.totalPages}
        <span className="ml-2 text-xs">({data.totalItems} items)</span>
      </div>

      <div className="flex items-center space-x-2">
        {/* First page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(1)}
          disabled={!data.hasPreviousPage}
          className="h-8 w-8"
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(Math.max(data.currentPage - 1, 1))}
          disabled={!data.hasPreviousPage}
          className="h-8 w-8"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">{renderPageNumbers()}</div>

        {/* Next page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            handlePageChange(Math.min(data.currentPage + 1, data.totalPages))
          }
          disabled={!data.hasNextPage}
          className="h-8 w-8"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(data.totalPages)}
          disabled={!data.hasNextPage}
          className="h-8 w-8"
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
