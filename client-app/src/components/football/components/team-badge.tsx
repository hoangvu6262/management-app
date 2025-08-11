import React from "react";
import { Users, Shield, Star, Trophy } from "lucide-react";

interface TeamBadgeProps {
  team: string;
}

export function TeamBadge({ team }: TeamBadgeProps) {
  const getTeamStyle = (team: string) => {
    return {
      bg: "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200/50 dark:border-blue-700/50",
      icon: Shield,
    };
  };

  const style = getTeamStyle(team);
  const IconComponent = style.icon;

  return (
    <div
      className={`group cursor-default inline-flex items-center px-3 py-1.5 text-xs font-semibold border rounded-xl whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-lg ${style.bg} ${style.text} ${style.border}`}
    >
      <IconComponent className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
      <span className="font-bold tracking-wide">{team}</span>
    </div>
  );
}
