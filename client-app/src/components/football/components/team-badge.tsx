import React from "react";
import { Users } from "lucide-react";

interface TeamBadgeProps {
  team: string;
}

export function TeamBadge({ team }: TeamBadgeProps) {
  return (
    <div className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-md whitespace-nowrap w-max dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
      <Users className="w-3 h-3 mr-1.5 flex-shrink-0" />
      <span className="leading-tight">{team}</span>
    </div>
  );
}
