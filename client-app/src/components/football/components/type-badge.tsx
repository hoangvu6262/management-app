import React from "react";

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const getTypeStyle = (type: string) => {
    return {
      bg: "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200/50 dark:border-blue-700/50",
      icon: "⚽",
    };
  };

  const style = getTypeStyle(type);

  return (
    <div
      className={`group cursor-default inline-flex items-center px-3 py-1.5 text-xs font-semibold border rounded-xl whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-lg ${style.bg} ${style.text} ${style.border}`}
    >
      <span className="mr-2 text-sm">{style.icon}</span>
      <span className="font-bold tracking-wide">{type}</span>
    </div>
  );
}
