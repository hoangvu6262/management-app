"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import type { AnalyticsFilter } from "@/services/analyticsService";

interface AnalyticsFilterProps {
  onFilterChange: (filter: AnalyticsFilter) => void;
  initialFilter?: AnalyticsFilter;
}

export const AnalyticsFilterComponent: React.FC<AnalyticsFilterProps> = ({
  onFilterChange,
  initialFilter = {},
}) => {
  const [filter, setFilter] = useState<AnalyticsFilter>(initialFilter);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (
    key: keyof AnalyticsFilter,
    value: string | undefined
  ) => {
    const newFilter = { ...filter, [key]: value || undefined };
    setFilter(newFilter);
  };

  const applyFilter = () => {
    onFilterChange(filter);
  };

  const clearFilter = () => {
    const emptyFilter: AnalyticsFilter = {};
    setFilter(emptyFilter);
    onFilterChange(emptyFilter);
  };

  const hasActiveFilters = Object.values(filter).some(
    (value) => value !== undefined && value !== ""
  );

  return (
    <Card>
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Hide" : "Show"}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={filter.fromDate || ""}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={filter.toDate || ""}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
              />
            </div>

            {/* Stadium */}
            <div>
              <Label htmlFor="stadium">Stadium</Label>
              <Input
                id="stadium"
                placeholder="Enter stadium name"
                value={filter.stadium || ""}
                onChange={(e) => handleFilterChange("stadium", e.target.value)}
              />
            </div>

            {/* Team */}
            <div>
              <Label htmlFor="team">Team</Label>
              <Input
                id="team"
                placeholder="Enter team name"
                value={filter.team || ""}
                onChange={(e) => handleFilterChange("team", e.target.value)}
              />
            </div>

            {/* Match Type */}
            <div>
              <Label htmlFor="type">Match Type</Label>
              <Select
                value={filter.type || ""}
                onValueChange={(value) =>
                  handleFilterChange(
                    "type",
                    value === "all" ? undefined : value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select match type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="S5">S5</SelectItem>
                  <SelectItem value="S7">S7</SelectItem>
                  <SelectItem value="S11">S11</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={filter.status || ""}
                onValueChange={(value) =>
                  handleFilterChange(
                    "status",
                    value === "all" ? undefined : value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-4">
            <Button onClick={applyFilter} className="flex-1 md:flex-none">
              Apply Filters
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilter}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2">
              {filter.fromDate && (
                <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  From: {filter.fromDate}
                </div>
              )}
              {filter.toDate && (
                <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  To: {filter.toDate}
                </div>
              )}
              {filter.stadium && (
                <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  Stadium: {filter.stadium}
                </div>
              )}
              {filter.team && (
                <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  Team: {filter.team}
                </div>
              )}
              {filter.type && (
                <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  Type: {filter.type}
                </div>
              )}
              {filter.status && (
                <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  Status: {filter.status}
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
