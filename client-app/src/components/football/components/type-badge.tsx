import React from "react";

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <div className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-md whitespace-nowrap w-max dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
      <span className="w-3 h-3 mr-1.5 flex items-center justify-center flex-shrink-0 text-[10px] leading-none">⚽</span>
      <span className="leading-tight">{type}</span>
    </div>
  );
}
