import React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { PagedFootballMatches, FootballMatchFilter } from "@/services/footballMatchService";

interface PaginationProps {
  data: PagedFootballMatches;
  onFilterChange: (key: keyof FootballMatchFilter, value: any) => void;
}

export function Pagination({ data, onFilterChange }: PaginationProps) {
  if (!data || data.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-6 border-t gap-4">
      <div className="text-sm text-muted-foreground">
        Page {data.currentPage} of {data.totalPages}
      </div>

      <div className="flex items-center space-x-2">
        {/* First page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onFilterChange("page", 1)}
          disabled={data.currentPage === 1}
          className="h-8 w-8"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            onFilterChange("page", Math.max(data.currentPage - 1, 1))
          }
          disabled={data.currentPage === 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
            let pageNumber;
            if (data.totalPages <= 5) {
              pageNumber = i + 1;
            } else if (data.currentPage <= 3) {
              pageNumber = i + 1;
            } else if (data.currentPage >= data.totalPages - 2) {
              pageNumber = data.totalPages - 4 + i;
            } else {
              pageNumber = data.currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNumber}
                variant={data.currentPage === pageNumber ? "default" : "outline"}
                size="icon"
                onClick={() => onFilterChange("page", pageNumber)}
                className="h-8 w-8"
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        {/* Next page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            onFilterChange("page", Math.min(data.currentPage + 1, data.totalPages))
          }
          disabled={data.currentPage === data.totalPages}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onFilterChange("page", data.totalPages)}
          disabled={data.currentPage === data.totalPages}
          className="h-8 w-8"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
