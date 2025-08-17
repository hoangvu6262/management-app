import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Plus, Loader2 } from "lucide-react";
import { AddFootballMatchModal } from "./add-match-modal";
import {
  useFootballMatches,
  footballMatchMutations,
} from "@/hooks/useFootballMatches";
import {
  FootballMatchFilter,
  FootballMatchResponse,
} from "@/services/footballMatchService";
import { footballMatchService } from "@/services/footballMatchService";

// Import view components
import { MobileView } from "./views/mobile-view";
import { TabletView } from "./views/tablet-view";
import { DesktopView } from "./views/desktop-view";
import { Filters } from "./views";
import { Pagination } from "./views/pagination";

export function FootballMatchTable() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] =
    useState<FootballMatchResponse | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filter, setFilter] = useState<FootballMatchFilter>({
    page: 1,
    pageSize: 10,
    sortBy: "date",
    sortOrder: "desc",
  });
  // Fetch data using SWR
  const { data, error, isLoading, mutateAll } = useFootballMatches(filter);

  const handleFilterChange = useCallback(
    (key: keyof FootballMatchFilter, value: any) => {
      setFilter((prev) => {
        const newFilter = {
          ...prev,
          [key]: value,
          // Reset page to 1 when changing filters (except when changing page itself)
          page: key !== "page" ? 1 : value,
        };
        return newFilter;
      });
    },
    []
  );

  const handleAddMatch = async (newMatchData: any) => {
    try {
      await footballMatchMutations.create(newMatchData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  const handleEditMatch = async (id: string, matchData: any) => {
    try {
      await footballMatchMutations.update(id, matchData);
      setEditingMatch(null);
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await footballMatchService.updateStatus(id, status as any);
      mutateAll();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteMatch = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      try {
        await footballMatchMutations.delete(id);
      } catch (error) {
        console.error("Error deleting match:", error);
      }
    }
  };

  const handleRowSelect = (matchId: string) => {
    setSelectedRows((prev) =>
      prev.includes(matchId)
        ? prev.filter((id) => id !== matchId)
        : [...prev, matchId]
    );
  };

  const handleSelectAll = () => {
    if (!data?.items) return;

    const allPaginatedIds = data.items.map((m) => m.id);
    const allPaginatedSelected = allPaginatedIds.every((id) =>
      selectedRows.includes(id)
    );

    if (allPaginatedSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !allPaginatedIds.includes(id))
      );
    } else {
      setSelectedRows((prev) => {
        const newIds = allPaginatedIds.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      });
    }
  };

  const getStatusBadge = useCallback((status: string, matchId: string) => {
    const statusStyle = footballMatchService.getStatusStyle(status);
    return (
      <Select
        value={status}
        onValueChange={(value) => handleStatusChange(matchId, value)}
      >
        <SelectTrigger
          className="w-auto min-w-[100px] h-8 px-3 py-1 rounded-full text-xs font-medium border"
          style={{
            backgroundColor: statusStyle.backgroundColor,
            color: statusStyle.color,
            borderColor: statusStyle.borderColor
          }}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    );
  }, []);

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading football matches</p>
            <p className="text-sm text-gray-500 mb-4">{error.message}</p>
            <Button onClick={() => mutateAll()} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-lg sm:text-xl">
              Football Matches Management
            </CardTitle>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Match
            </Button>
          </CardHeader>

          {/* Filters */}
          <Filters filter={filter} onFilterChange={handleFilterChange} />

          {/* Filter Results Info */}
          <div className="px-6 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                {data ? (
                  <>
                    Showing {(data.currentPage - 1) * data.pageSize + 1} to{" "}
                    {Math.min(
                      data.currentPage * data.pageSize,
                      data.totalItems
                    )}{" "}
                    of {data.totalItems} matches
                  </>
                ) : (
                  "Loading..."
                )}
              </div>

              {/* Items per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select
                  value={filter.pageSize?.toString() || "10"}
                  onValueChange={(value) =>
                    handleFilterChange("pageSize", Number(value))
                  }
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 p-6">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                {/* Mobile View */}
                <div className="p-6 lg:hidden">
                  <MobileView
                    matches={data?.items || []}
                    onEdit={setEditingMatch}
                    onDelete={handleDeleteMatch}
                    getStatusBadge={getStatusBadge}
                  />
                </div>

                {/* Tablet View */}
                <div className="p-6 hidden md:block lg:hidden">
                  <TabletView
                    matches={data?.items || []}
                    onEdit={setEditingMatch}
                    onDelete={handleDeleteMatch}
                    getStatusBadge={getStatusBadge}
                  />
                </div>

                {/* Desktop View */}
                <div className="p-6">
                  <DesktopView
                    matches={data?.items || []}
                    selectedRows={selectedRows}
                    onEdit={setEditingMatch}
                    onDelete={handleDeleteMatch}
                    onRowSelect={handleRowSelect}
                    onSelectAll={handleSelectAll}
                    getStatusBadge={getStatusBadge}
                  />
                </div>

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                  <div className="p-6 pt-0">
                    <Pagination
                      data={data}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <AddFootballMatchModal
          isOpen={isAddModalOpen || !!editingMatch}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingMatch(null);
          }}
          onAdd={handleAddMatch}
          match={editingMatch}
          onUpdate={handleEditMatch}
        />
      </div>
    </TooltipProvider>
  );
}
