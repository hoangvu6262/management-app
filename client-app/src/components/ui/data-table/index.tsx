import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string, direction: "asc" | "desc") => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onRowClick?: (row: T, index: number) => void;
  actions?: (row: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  height?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onSort,
  sortKey,
  sortDirection,
  onRowClick,
  actions,
  emptyMessage = "No data available",
  className = "",
  height = "600px",
}: DataTableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;

    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    onSort(key, newDirection);
  };

  const getValue = (row: T, key: string): any => {
    return key.split(".").reduce((obj, k) => obj?.[k], row);
  };

  const getAlignment = (align?: string) => {
    switch (align) {
      case "center":
        return "text-center justify-center";
      case "right":
        return "text-right justify-end";
      default:
        return "text-left justify-start";
    }
  };

  // Calculate total width for proper scrolling
  const totalWidth = columns.reduce(
    (acc, col) => {
      const width = col.width || "150px";
      const numericWidth = parseInt(width.replace("px", ""));
      return acc + numericWidth;
    },
    actions ? 120 : 0
  ); // Add 120px for actions column

  const gridTemplate = `${columns
    .map((col) => col.width || "150px")
    .join(" ")}${actions ? " 90px" : ""}`;

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Single scroll container for both header and body */}
      <div style={{ height }} className="flex flex-col overflow-hidden">
        {/* Scrollable container for entire table */}
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <div style={{ minWidth: `${totalWidth}px` }}>
            {/* Sticky Header */}
            <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
              <div
                className="grid px-6 py-4"
                style={{ gridTemplateColumns: gridTemplate }}
              >
                {columns.map((column, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ${getAlignment(
                      column.align
                    )}`}
                  >
                    <span className="truncate">{column.label}</span>
                    {column.sortable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent flex-shrink-0"
                        onClick={() => handleSort(column.key as string)}
                      >
                        {sortKey === column.key ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )
                        ) : (
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        )}
                      </Button>
                    )}
                  </div>
                ))}
                {actions && (
                  <div className="flex items-center justify-end">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Table Body */}
            {data.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {emptyMessage}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`grid px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      onRowClick ? "cursor-pointer" : ""
                    }`}
                    style={{ gridTemplateColumns: gridTemplate }}
                    onClick={() => onRowClick?.(row, rowIndex)}
                  >
                    {columns.map((column, colIndex) => {
                      const value = getValue(row, column.key as string);
                      return (
                        <div
                          key={colIndex}
                          className={`flex items-center ${getAlignment(
                            column.align
                          )} text-sm min-w-0`}
                        >
                          {column.render ? (
                            column.render(value, row, rowIndex)
                          ) : (
                            <span className="text-gray-900 dark:text-gray-100 truncate">
                              {value?.toString() || "-"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {actions && (
                      <div className="flex items-center justify-end">
                        {actions(row, rowIndex)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Avatar component without radix dependency
export const SimpleAvatar = ({
  src,
  fallback,
  className = "",
}: {
  src?: string;
  fallback: string;
  className?: string;
}) => (
  <div
    className={`relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 ${className}`}
  >
    {src ? (
      <img
        src={src}
        alt={fallback}
        className="aspect-square h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
        {fallback}
      </div>
    )}
  </div>
);

// Helper components for common use cases
export const AvatarCell = ({
  src,
  fallback,
  name,
  subtitle,
}: {
  src?: string;
  fallback: string;
  name: string;
  subtitle?: string;
}) => (
  <div className="flex items-center space-x-3 min-w-0">
    <SimpleAvatar src={src} fallback={fallback} />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
        {name}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export const BadgeCell = ({
  text,
  variant = "secondary",
}: {
  text: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}) => (
  <Badge variant={variant} className="font-medium">
    {text}
  </Badge>
);

export const ActionsCell = ({
  onEdit,
  onDelete,
  onView,
  editLabel = "Edit",
  deleteLabel = "Delete",
  viewLabel = "View",
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  viewLabel?: string;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {onView && (
        <DropdownMenuItem onClick={onView}>{viewLabel}</DropdownMenuItem>
      )}
      {onEdit && (
        <DropdownMenuItem onClick={onEdit}>{editLabel}</DropdownMenuItem>
      )}
      {onDelete && (
        <DropdownMenuItem
          onClick={onDelete}
          className="text-red-600 dark:text-red-400"
        >
          {deleteLabel}
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);
