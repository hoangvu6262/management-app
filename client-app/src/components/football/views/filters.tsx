import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  CalendarDays,
  Trophy,
} from "lucide-react";
import { FootballMatchFilter } from "@/services/footballMatchService";

interface FiltersProps {
  filter: FootballMatchFilter;
  onFilterChange: (key: keyof FootballMatchFilter, value: any) => void;
}

export function Filters({ filter, onFilterChange }: FiltersProps) {
  return (
    <div className="px-6 pb-4 space-y-4">
      {/* Mobile/Tablet Filters */}
      <div className="flex flex-col gap-4 lg:hidden">
        {/* Search - Full width on mobile */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search stadium or team..."
            value={filter.searchText || ""}
            onChange={(e) => onFilterChange("searchText", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status and Type filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select
              value={filter.status || "all"}
              onValueChange={(value) =>
                onFilterChange("status", value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select
              value={filter.type || "all"}
              onValueChange={(value) =>
                onFilterChange("type", value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="S5">Sân 5</SelectItem>
                <SelectItem value="S7">Sân 7</SelectItem>
                <SelectItem value="S11">Sân 11</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Input
              type="date"
              value={filter.fromDate || ""}
              onChange={(e) => onFilterChange("fromDate", e.target.value)}
              className="w-full"
              placeholder="From Date"
            />
          </div>

          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Input
              type="date"
              value={filter.toDate || ""}
              onChange={(e) => onFilterChange("toDate", e.target.value)}
              className="w-full"
              placeholder="To Date"
            />
          </div>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:flex lg:flex-row gap-4">
        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search stadium or team..."
            value={filter.searchText || ""}
            onChange={(e) => onFilterChange("searchText", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={filter.status || "all"}
            onValueChange={(value) =>
              onFilterChange("status", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center space-x-2">
          <Trophy className="h-4 w-4 text-muted-foreground" />
          <Select
            value={filter.type || "all"}
            onValueChange={(value) =>
              onFilterChange("type", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="S5">S5</SelectItem>
              <SelectItem value="S7">S7</SelectItem>
              <SelectItem value="S11">S11</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filters */}
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={filter.fromDate || ""}
            onChange={(e) => onFilterChange("fromDate", e.target.value)}
            className="w-40"
            placeholder="From Date"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Input
            type="date"
            value={filter.toDate || ""}
            onChange={(e) => onFilterChange("toDate", e.target.value)}
            className="w-40"
            placeholder="To Date"
          />
        </div>
      </div>
    </div>
  );
}
